import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  // Add other fields as needed based on backend response
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = async () => {
      try {
        // Fetch the token
        const response = await fetch('/api/auth/token');
        if (!response.ok) {
          console.error('Failed to fetch auth token for WebSocket');
          return;
        }

        const { token } = await response.json();

        // Connect to WebSocket
        const wsUrl = `wss://drifully-backend-1qa6.onrender.com/ws/notification/?token=${token}`;
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          // console.log('WebSocket connected');
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            // console.log('WebSocket message received:', data);

            // Handle plain message format { message: "..." }
            if (data && typeof data.message === 'string') {
              // console.log('Processing flat message into notification:', data.message);
              const newNotification: Notification = {
                id: Math.random().toString(36).substring(2, 11),
                title: 'System Notification',
                message: data.message,
                type: 'info',
                is_read: false,
                created_at: new Date().toISOString(),
              };
              setNotifications(prev => [newNotification, ...prev].slice(0, 30));
              setUnreadCount(prev => prev + 1);
            }
            // Assuming the backend sends a notification object
            else if (data && data.type === 'notification') {
              const newNotification = data.payload as Notification;
              setNotifications(prev => [newNotification, ...prev].slice(0, 30));
              setUnreadCount(prev => prev + 1);
            } else if (data && data.type === 'unread_count') {
              setUnreadCount(data.payload.count);
            }
          } catch (e) {
            console.error('Failed to parse WebSocket message:', e);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          // console.log('WebSocket disconnected');
          setIsConnected(false);
          // Attempt to reconnect after 5 seconds
          reconnectTimeout = setTimeout(connectWebSocket, 5000);
        };

        setSocket(ws);
      } catch (error) {
        console.error('Error in connectWebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  const markAsRead = useCallback((id: string) => {
    // Implement API call to mark as read if needed
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
}
