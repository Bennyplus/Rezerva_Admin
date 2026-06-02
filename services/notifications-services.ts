import { publicApi } from "@/lib/api-client";

export const notificationsService = {
  /**
   * Fetches all notifications */
//   getNotifications: async (page = 1, search = "") => {
//     const response = await publicApi.get("", {
//       // Update this path to match your exact backend endpoint
//       params: { path: "api/v1/admin/notifications/", page, search },
//     });
//     return response.data;
//   },
    getNotifications: async () => {
        try {
            const res = await publicApi.get("", {
                params: { path: "api/v1/admin/notifications/" },
            });
            return res.data;
        } catch (error) {
            throw error;
        }   
    },
};