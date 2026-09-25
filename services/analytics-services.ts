import { publicApi } from "@/lib/api-client";

export interface MetricValue {
  value: number | null;
  previous: number | null;
  change_pct: number | null;
}

export interface AnalyticsRange {
  period: string;
  start: string;
  end: string;
  group_by: string;
  currency: string;
}

export interface OverviewSummaryResponse {
  range: AnalyticsRange;
  active_users: MetricValue;
  platform_revenue: MetricValue;
  completed_trips: MetricValue;
  total_bookings: MetricValue;
}

export interface RevenuePoint { date: string; label: string; value: number; }
export interface RevenueTrendResponse { range: AnalyticsRange; total: number; points: RevenuePoint[]; }

export interface PayoutPoint { date: string; label: string; value: number; }
export interface PayoutsResponse { range: AnalyticsRange; total: number; points: PayoutPoint[]; }

export interface CommissionPoint { date: string; label: string; value: number; }
export interface CommissionTrendResponse { range: AnalyticsRange; total: number; points: CommissionPoint[]; }

export interface UserGrowthPoint { date: string; label: string; value: number; }
export interface UserGrowthResponse { range: AnalyticsRange; total: number; new_in_range: number; points: UserGrowthPoint[]; }

export interface ActiveVsNewUserPoint { date: string; label: string; active_users: number; new_users: number; }
export interface ActiveVsNewUsersResponse { range: AnalyticsRange; points: ActiveVsNewUserPoint[]; }

export interface RetentionCohort { cohort: string; cohort_start: string; cohort_size: number; periods: (number | null)[]; }
export interface RetentionResponse { year: number; period_labels: string[]; cohorts: RetentionCohort[]; }

export interface ChurnPoint { date: string; label: string; active_previous_month: number; churned: number; churn_rate: number | null; is_partial: boolean; }
export interface ChurnResponse { year: number; points: ChurnPoint[]; }

export interface PopularDestination { rank: number; name: string; trip_count: number; booking_count: number; latitude: number | null; longitude: number | null; }
export interface PopularDestinationsResponse { range: AnalyticsRange; results: PopularDestination[]; }

export interface AverageOccupancyResponse {
  range: AnalyticsRange;
  avg_seats_booked: number;
  avg_capacity: number;
  capacity: number;
  occupancy_rate: number;
  trip_count: number;
  previous_avg_seats_booked: number;
  change_pct: number | null;
}

export interface UsersSummaryResponse {
  range: AnalyticsRange;
  active_users: MetricValue;
  total_users: MetricValue;
  new_users: MetricValue;
  retention_rate: MetricValue;
}

export interface AdminUserItem {
  id: number;
  profile_picture: string | null;
  full_name: string;
  referral_code: string | null;
  email: string;
  phone_number: string;
  gender: string;
  rating: number;
  total_trips: number;
  account_number: string | null;
  bank_name: string | null;
  is_verified: string;
  date_joined: string;
}

export interface TripsSummaryResponse {
  range: AnalyticsRange;
  total_trips: MetricValue;
  average_occupancy: MetricValue;
  average_distance_km: MetricValue;
  completion_rate: MetricValue;
}

export interface TripPassenger {
  id: number;
  full_name: string;
}

export interface AdminTripItem {
  id: number;
  driver: string;
  email: string;
  phone_number: string;
  license_status: string;
  origin: string;
  destination: string;
  departure_time: string;
  available_seats: string;
  price_per_seat: string;
  status: "completed" | "upcoming" | "cancelled" | string;
  passengers: TripPassenger[];
}

export interface DriversSummaryResponse {
  range: AnalyticsRange;
  active_drivers: MetricValue;
  average_rating: MetricValue;
  acceptance_rate: MetricValue;
  cancellation_rate: MetricValue;
}

export interface AdminDriverItem {
  id: number;
  full_name: string;
  email: string;
  rating: number | null;
  acceptance_rate: number | null;
  cancellation_rate: number | null;
  trips: number;
  earnings: number;
}

export interface DriversListResponse {
  range: AnalyticsRange;
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminDriverItem[];
}

export interface PassengersSummaryResponse {
  range: AnalyticsRange;
  active_passengers: MetricValue;
  average_trips_per_passenger: MetricValue;
  repeat_rate: MetricValue;
  cancellation_rate: MetricValue;
}

export interface AdminPassengerItem {
  id: number;
  full_name: string;
  email: string;
  trips: number;
  repeat_trips: number;
  rating: number | null;
  cancellation_rate: number | null;
  last_trip: string | null;
}

export interface PassengersListResponse {
  range: AnalyticsRange;
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminPassengerItem[];
}

export const analyticsService = {
  getOverviewSummary: async (period: string = "this_year"): Promise<OverviewSummaryResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/overview/summary/", period } });
    return res.data;
  },
  getRevenueTrend: async (period: string = "this_month"): Promise<RevenueTrendResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/overview/revenue-trend/", period } });
    return res.data;
  },
  getPayouts: async (period: string = "this_month"): Promise<PayoutsResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/overview/payouts/", period } });
    return res.data;
  },
  getCommissionTrend: async (period: string = "this_month"): Promise<CommissionTrendResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/overview/commission-trend/", period } });
    return res.data;
  },
  getUserGrowth: async (period: string = "this_year"): Promise<UserGrowthResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/overview/user-growth/", period } });
    return res.data;
  },
  getActiveVsNewUsers: async (period: string = "this_year"): Promise<ActiveVsNewUsersResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/overview/active-vs-new-users/", period } });
    return res.data;
  },
  getRetention: async (period: string = "this_year"): Promise<RetentionResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/overview/retention/", period } });
    return res.data;
  },
  getChurn: async (period: string = "this_year"): Promise<ChurnResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/overview/churn/", period } });
    return res.data;
  },
  getPopularDestinations: async (period: string = "this_year"): Promise<PopularDestinationsResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/overview/popular-destinations/", period } });
    return res.data;
  },
  getAverageOccupancy: async (period: string = "this_year"): Promise<AverageOccupancyResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/overview/average-occupancy/", period } });
    return res.data;
  },
  getUsersSummary: async (period: string = "this_month"): Promise<UsersSummaryResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/users/summary/", period } });
    return res.data;
  },
  getUsersList: async (params?: Record<string, any>): Promise<AdminUserItem[]> => {
    const res = await publicApi.get("", { params: { path: "administration/users/", ...params } });
    return res.data;
  },
  getTripsSummary: async (period: string = "this_month"): Promise<TripsSummaryResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/trips/summary/", period } });
    return res.data;
  },
  getTripsList: async (params?: Record<string, any>): Promise<AdminTripItem[]> => {
    const res = await publicApi.get("", { params: { path: "administration/trips/", ...params } });
    return res.data;
  },
  getDriversSummary: async (period: string = "this_month"): Promise<DriversSummaryResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/insights/drivers/summary/", period } });
    return res.data;
  },
  getDriversList: async (params?: Record<string, any>): Promise<DriversListResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/insights/drivers/", ...params } });
    return res.data;
  },
  getPassengersSummary: async (period: string = "this_month"): Promise<PassengersSummaryResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/insights/passengers/summary/", period } });
    return res.data;
  },
  getPassengersList: async (params?: Record<string, any>): Promise<PassengersListResponse> => {
    const res = await publicApi.get("", { params: { path: "administration/insights/passengers/", ...params } });
    return res.data;
  },
  exportReportanalytics: async (format: string = "pdf") => {
    try {
      const res = await publicApi.get("", {
        params: { path: "administration/overview/summary/", export: format },
        responseType: "blob",
      });
      return res.data as Blob;
    } catch (error) {
      console.error("Failed to export analytics:", error);
      throw error;
    }
  },
};