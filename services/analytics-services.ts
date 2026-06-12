import { publicApi } from "@/lib/api-client";

export const analyticsService = {
  /**
   * Fetches analytics data for the admin dashboard.
   */
  fetchDashboardAnalytics: async () => {
    try {
      console.log("Analytics Service: Fetching dashboard analytics...");
      const response = await publicApi.get("", {
        params: { path: "api/v1/admin/analytics/overview/" },
      });
      console.log("Analytics Service: Response received", response);
      return response.data;
    } catch (error: any) {
      console.error("Analytics Service: Failed to fetch dashboard analytics:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },
  exportReportanalytics: async (format: string = 'pdf') => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/analytics/overview/', export: format },
        responseType: 'blob',
      });
      return response.data as Blob;
    } catch (error) {
      console.error('Failed to export analytics:', error);
      throw error;
    }
  },

};