import { publicApi } from "@/lib/api-client";

export const notificationsService = {
  /**
   * Fetches notifications for the admin dashboard.
   */
  getNotifications: async (page = 1, search = "") => {
    try {
      const response = await publicApi.get("", {
        params: { path: "api/v1/admin/notifications/", page, search },
      });
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      throw error;
    }
  },

  /**
   * Fetches a single notification by ID.
   */
  getNotificationById: async (id: string) => {
    try {
      const response = await publicApi.get("", {
        params: { path: `api/v1/admin/notifications/${id}/` },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch notification ${id}:`, error);
      throw error;
    }
  },

  /**
   * Fetches available delivery channel choices.
   */
  getDeliveryChannels: async () => {
    try {
      const response = await publicApi.get("", {
        params: { path: "api/v1/admin/notifications/choices/delivery-channels/" },
      });
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error("Failed to fetch delivery channels:", error);
      throw error;
    }
  },

  /**
   * Fetches available recipient type choices.
   */
  getRecipientTypes: async () => {
    try {
      const response = await publicApi.get("", {
        params: { path: "api/v1/admin/notifications/choices/recipient-types/" },
      });
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error("Failed to fetch recipient types:", error);
      throw error;
    }
  },

  /**
   * Creates a new notification.
   */
  createNotification: async (data: any) => {
    try {
      const response = await publicApi.post("", data, {
        params: { path: "api/v1/admin/notifications/" },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create notification:", error);
      throw error;
    }
  },

  /**
   * Sends an existing notification.
   */
  sendNotification: async (id: string, payload: any = {}) => {
    try {
      const response = await publicApi.post("", payload, {
        params: { path: `api/v1/admin/notifications/${id}/send/` },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to send notification ${id}:`, error);
      throw error;
    }
  },

  /**
   * Duplicates a notification.
   */
  duplicateNotification: async (id: string) => {
    try {
      const response = await publicApi.post("", null, {
        params: { path: "api/v1/admin/notifications/duplicate/", notification_id: id },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to duplicate notification ${id}:`, error);
      throw error;
    }
  },

  /**
   * Updates an existing notification.
   */
  editNotification: async (id: string, data: any) => {
    try {
      const response = await publicApi.put("", data, {
        params: { path: "api/v1/admin/notifications/", notification_id: id },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to update notification ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cancels a scheduled notification.
   */
  cancelScheduledNotification: async (id: string) => {
    try {
      const response = await publicApi.post("", null, {
        params: { path: "api/v1/admin/notifications/cancel-schedule/", notification_id: id },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to cancel notification schedule for ${id}:`, error);
      throw error;
    }
  },

  /**
   * Fetches the list of users available for targeted notifications.
   */
  getUsersForNotifications: async () => {
    try {
      const response = await publicApi.get("", {
        params: { path: "api/v1/admin/notifications/users/" },
      });
      return Array.isArray(response.data) ? response.data : response.data?.results || [];
    } catch (error) {
      console.error("Failed to fetch notification users:", error);
      throw error;
    }
  },

  /**
   * Deactivates a notification.
   */
  deactivateNotification: async (id: string) => {
    try {
      const response = await publicApi.post("", null, {
        params: { path: "api/v1/admin/notifications/deactivate/", notification_id: id },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to deactivate notification ${id}:`, error);
      throw error;
    }
  },
};