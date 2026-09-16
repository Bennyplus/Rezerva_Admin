import { publicApi } from "@/lib/api-client";

export interface DashboardStatMetric {
  label: string;
  value: string;
  raw_value: string;
  growth_percentage: string;
  growth_direction: "up" | "down" | "flat" | string;
}

export interface DashboardTrendItem {
  label: string;
  value: string;
}

export interface AdminDashboardResponse {
  total_revenue: DashboardStatMetric;
  total_passengers: DashboardStatMetric;
  total_drivers: DashboardStatMetric;
  total_trips: DashboardStatMetric;
  user_growth: DashboardTrendItem[];
  revenue_trend: DashboardTrendItem[];
}

export const dashboardService = {
  /**
   * Fetches data for the main admin dashboard.
   * GET administration/admin/dashboard/
   */
  getMainDashboard: async (): Promise<AdminDashboardResponse> => {
    const response = await publicApi.get("", {
      params: { path: "administration/admin/dashboard/" },
    });
    return response.data;
  },
};
