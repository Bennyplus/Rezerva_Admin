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
  exportAnalyticsReport: async (reportType: string, filters: Record<string, any> = {}) => {
    try {
      console.log(`Analytics Service: Exporting ${reportType} report...`);
      const response = await publicApi.get("", {
        params: { path: `api/v1/admin/analytics/reports/${reportType}/`, ...filters },
        responseType: "blob", // Expecting a file download
      });
      console.log(`Analytics Service: ${reportType} report exported successfully`);
      return response.data; // This will be the file blob
    } catch (error) {
      console.error(`Analytics Service: Failed to export analytics report ${reportType}:`, error);
      throw error;
    }
    },
};