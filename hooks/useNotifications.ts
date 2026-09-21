import { useState, useEffect, useCallback, useRef } from "react";
import {
  notificationsService,
  InAppNotification,
} from "@/services/notifications-services";

export interface Notification {
  id: string | number;
  receiver?: number;
  actor?: number;
  actor_type?: string;
  event_type?: string;
  title: string;
  message: string;
  type?: string;
  is_read: boolean;
  created_at: string;
}

function normalizeNotification(item: InAppNotification | any): Notification {
  const fallbackTitle = item.event_type
    ? item.event_type
        .split(/[_\s]+/)
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "System Notification";

  return {
    id: item.id ?? Math.random().toString(36).substring(2, 11),
    receiver: item.receiver,
    actor: item.actor,
    actor_type: item.actor_type,
    event_type: item.event_type,
    title: item.title || fallbackTitle,
    message: item.message || "",
    type: item.type || item.actor_type || "info",
    is_read: Boolean(item.is_read),
    created_at: item.created_at || new Date().toISOString(),
  };
}

function getWebSocketUrl(token: string): string {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://drifully-backup.onrender.com";
  const wsProtocol = backendUrl.startsWith("https") ? "wss" : "ws";
  const host = backendUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return `${wsProtocol}://${host}/ws/notification/?token=${token}`;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const retryCountRef = useRef(0);
  const maxRetries = 5;

  // 1. Initial REST Fetch
  const fetchInAppNotifications = useCallback(async () => {
    try {
      const data = await notificationsService.getInAppNotifications();
      const list = Array.isArray(data) ? data.map(normalizeNotification) : [];
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.is_read).length);
    } catch (err) {
      console.warn("Failed to load in-app notifications via REST:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInAppNotifications();
  }, [fetchInAppNotifications]);

  // 2. Real-time WebSocket Connection
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let isDisposed = false;

    const connectWebSocket = async () => {
      try {
        // Fetch session auth token
        const response = await fetch("/api/auth/token");
        if (!response.ok) {
          // User might not be logged in yet
          return;
        }

        const { token } = await response.json();
        if (!token || isDisposed) return;

        const wsUrl = getWebSocketUrl(token);
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          if (isDisposed) return;
          setIsConnected(true);
          retryCountRef.current = 0;
        };

        ws.onmessage = (event) => {
          if (isDisposed) return;
          try {
            const data = JSON.parse(event.data);

            if (data && typeof data.message === "string" && !data.type) {
              const newNotif = normalizeNotification(data);
              setNotifications((prev) => [newNotif, ...prev].slice(0, 50));
              setUnreadCount((prev) => prev + 1);
            } else if (data && (data.type === "notification" || data.payload)) {
              const payload = data.payload || data;
              const newNotif = normalizeNotification(payload);
              setNotifications((prev) => [newNotif, ...prev].slice(0, 50));
              setUnreadCount((prev) => prev + 1);
            } else if (data && data.type === "unread_count") {
              setUnreadCount(Number(data.payload?.count ?? data.count ?? 0));
            }
          } catch (e) {
            console.warn("Could not parse incoming WebSocket message:", e);
          }
        };

        ws.onerror = () => {
          // Browser WebSocket error events do not expose error details for security reasons
          // Disconnect reasons are handled in onclose
        };

        ws.onclose = (event) => {
          if (isDisposed) return;
          setIsConnected(false);

          // Exponential backoff reconnect
          if (retryCountRef.current < maxRetries) {
            const delay = Math.min(
              1000 * Math.pow(2, retryCountRef.current) + Math.random() * 1000,
              30000
            );
            retryCountRef.current += 1;
            reconnectTimeout = setTimeout(connectWebSocket, delay);
          }
        };

        setSocket(ws);
      } catch (err) {
        console.warn("WebSocket initialization error:", err);
      }
    };

    connectWebSocket();

    // 3. Fallback Periodic Polling (every 60s)
    const pollInterval = setInterval(() => {
      fetchInAppNotifications();
    }, 60000);

    return () => {
      isDisposed = true;
      clearInterval(pollInterval);
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [fetchInAppNotifications]);

  // 4. Mark Single Notification as Read
  const markAsRead = useCallback(async (id: string | number) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (String(n.id) === String(id) ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await notificationsService.markNotificationAsRead(id);
    } catch (err) {
      console.warn(`Failed to mark notification ${id} as read on BE:`, err);
    }
  }, []);

  // 5. Mark Single Notification as Unread
  const markAsUnread = useCallback(async (id: string | number) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (String(n.id) === String(id) ? { ...n, is_read: false } : n))
    );
    setUnreadCount((prev) => prev + 1);

    try {
      await notificationsService.markNotificationAsUnread(id);
    } catch (err) {
      console.warn(`Failed to mark notification ${id} as unread on BE:`, err);
    }
  }, []);

  // 6. Mark All Notifications as Read
  const markAllAsRead = useCallback(async () => {
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      await notificationsService.markAllNotificationsAsRead();
    } catch (err) {
      console.warn("Failed to mark all notifications as read on BE:", err);
    }
  }, []);

  // 7. Clear Notifications locally
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    clearNotifications,
    refetch: fetchInAppNotifications,
  };
}
