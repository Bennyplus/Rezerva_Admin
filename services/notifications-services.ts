import { publicApi } from "@/lib/api-client";

export interface CreateNotificationPayload {
  title: string;
  message: string;
  call_to_action?: string;
  media_attachment?: File | Blob | null;
  recipient_type: string; // e.g. "all_users"
  delivery_channel: string; // e.g. "email"
  specific_recipients?: string[];
  scheduled_time?: string;
  [key: string]: any;
}

export interface InAppNotification {
  id: string | number;
  receiver?: number;
  actor?: number;
  actor_type?: string;
  event_type?: string;
  title?: string;
  message: string;
  is_read: boolean;
  type?: string;
  created_at: string;
}

export const notificationsService = {
  /* ─── Admin In-App Notifications (Bell Icon) ─── */

  /**
   * Retrieve In-App Notifications
   * GET {{base_url}}notifications/all/
   */
  getInAppNotifications: async (): Promise<InAppNotification[]> => {
    try {
      const response = await publicApi.get("", {
        params: { path: "notifications/all/" },
        skipToast: true,
      } as any);
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }
      if (data && Array.isArray(data.results)) {
        return data.results;
      }
      if (data && typeof data === "object" && (data.id !== undefined || data.message)) {
        return [data];
      }
      return [];
    } catch (error) {
      console.warn("Failed to fetch in-app notifications:", error);
      return [];
    }
  },

  /**
   * Mark Notification As Read
   * PATCH {{base_url}}notifications/read/?notification_id={id}
   */
  markNotificationAsRead: async (notificationId: string | number) => {
    try {
      const response = await publicApi.patch(
        "",
        {},
        {
          params: {
            path: "notifications/read/",
            notification_id: notificationId,
          },
          skipToast: true,
        } as any
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to mark notification ${notificationId} as read:`, error);
      throw error;
    }
  },

  /**
   * Mark Notification As Unread
   * PATCH {{base_url}}notifications/unread/?notification_id={id}
   */
  markNotificationAsUnread: async (notificationId: string | number) => {
    try {
      const response = await publicApi.patch(
        "",
        {},
        {
          params: {
            path: "notifications/unread/",
            notification_id: notificationId,
          },
          skipToast: true,
        } as any
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to mark notification ${notificationId} as unread:`, error);
      throw error;
    }
  },

  /**
   * Mark All Notifications As Read (Read All)
   * POST {{base_url}}notifications/read-all/
   */
  markAllNotificationsAsRead: async () => {
    try {
      const response = await publicApi.post(
        "",
        {},
        {
          params: { path: "notifications/read-all/" },
          skipToast: true,
        } as any
      );
      return response.data;
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  },

  /* ─── Admin Broadcast Notifications Management (/admin/notifications) ─── */

  /**
   * List Notifications
   * GET administration/notifications/
   */
  getNotifications: async (page = 1, search = "") => {
    try {
      const response = await publicApi.get("", {
        params: {
          path: "administration/notifications/",
          page,
          ...(search && { search }),
        },
      });
      const data = response.data;
      if (data && data.results !== undefined) {
        return data;
      }
      return {
        results: Array.isArray(data) ? data : [],
        count: Array.isArray(data) ? data.length : 0,
      };
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      throw error;
    }
  },

  /**
   * Create Notification (Draft)
   * POST administration/notifications/
   * Body: formdata
   */
  createNotification: async (payload: CreateNotificationPayload | FormData) => {
    try {
      let body: FormData;
      if (payload instanceof FormData) {
        body = payload;
      } else {
        body = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach((item) => body.append(key, item));
            } else if (value instanceof File || value instanceof Blob) {
              body.append(key, value);
            } else {
              body.append(key, String(value));
            }
          }
        });
      }

      const response = await publicApi.post("", body, {
        params: { path: "administration/notifications/" },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create notification:", error);
      throw error;
    }
  },

  /**
   * Publish/Send Notification
   * POST administration/notifications/send/?notification_id={id}
   * Body: formdata (confirm=True)
   */
  sendNotification: async (notificationId: string | number) => {
    try {
      const formData = new FormData();
      formData.append("confirm", "True");

      const response = await publicApi.post("", formData, {
        params: {
          path: "administration/notifications/send/",
          notification_id: notificationId,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to send notification ${notificationId}:`, error);
      throw error;
    }
  },

  /**
   * Fetch Single Notification Detail
   * GET administration/notifications/?notification_id={id}
   */
  getNotificationById: async (notificationId: string | number) => {
    try {
      const response = await publicApi.get("", {
        params: {
          path: "administration/notifications/",
          notification_id: notificationId,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch notification ${notificationId}:`, error);
      throw error;
    }
  },
};