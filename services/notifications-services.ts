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

export const notificationsService = {
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
      return { results: Array.isArray(data) ? data : [], count: Array.isArray(data) ? data.length : 0 };
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
   * GET administration/notifications/?id={id}
   */
  getNotificationById: async (notificationId: string | number) => {
    try {
      const response = await publicApi.get("", {
        params: {
          path: `administration/notifications/`,
          id: notificationId,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch notification ${notificationId}:`, error);
      throw error;
    }
  },
};