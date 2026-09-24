import { publicApi } from "@/lib/api-client";

export interface MetricValue {
  value: number;
  previous: number;
  change_pct: number | null;
}

export interface OverviewSummaryResponse {
  range: {
    period: string;
    start: string;
    end: string;
    group_by: string;
    currency: string;
  };
  active_users: MetricValue;
  platform_revenue: MetricValue;
  completed_trips: MetricValue;
  total_bookings: MetricValue;
}

export interface RevenuePoint {
  date: string;
  label: string;
  value: number;
}

export interface RevenueTrendResponse {
  range: {
    period: string;
    start: string;
    end: string;
    group_by: string;
    currency: string;
  };
  total: number;
  points: RevenuePoint[];
}

export interface PayoutPoint {
  date: string;
  label: string;
  value: number;
}

export interface PayoutsResponse {
  range: {
    period: string;
    start: string;
    end: string;
    group_by: string;
    currency: string;
  };
  total: number;
  points: PayoutPoint[];
}

export const analyticsService = {
  /**
   * Admin Overview Summary
   * GET administration/overview/summary/?period=this_year
   */
  getOverviewSummary: async (
    period: string = "this_year",
  ): Promise<OverviewSummaryResponse> => {
    const response = await publicApi.get("", {
      params: {
        path: "administration/overview/summary/",
        period,
      },
    });
    return response.data;
  },

  /**
   * Revenue Trend
   * GET administration/overview/revenue-trend/?period=this_month
   */
  getRevenueTrend: async (
    period: string = "this_month",
  ): Promise<RevenueTrendResponse> => {
    const response = await publicApi.get("", {
      params: {
        path: "administration/overview/revenue-trend/",
        period,
      },
    });
    return response.data;
  },

  /**
   * Payouts
   * GET administration/overview/payouts/?period=this_month
   */
  getPayouts: async (
    period: string = "this_month",
  ): Promise<PayoutsResponse> => {
    const response = await publicApi.get("", {
      params: {
        path: "administration/overview/payouts/",
        period,
      },
    });
    return response.data;
  },

  exportReportanalytics: async (format: string = "pdf") => {
    try {
      const response = await publicApi.get("", {
        params: { path: "administration/overview/summary/", export: format },
        responseType: "blob",
      });
      return response.data as Blob;
    } catch (error) {
      console.error("Failed to export analytics:", error);
      throw error;
    }
  },
};