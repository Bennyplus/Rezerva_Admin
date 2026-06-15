import { publicApi } from "@/lib/api-client";

export const dashboardService = {
  /**
   * Fetches data for the admin dashboard.
   */
  fetchDashboardOverview: async () => {
    try {
      console.log("Dashboard Service: Fetching dashboard overview...");
      const response = await publicApi.get("", {
        params: { path: "api/v1/admin/dashboard/" },
      });
      console.log("Dashboard Service: Response received", response);
      return response.data;
    } catch (error: any) {
      console.error("Dashboard Service: Failed to fetch dashboard overview:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },
};
