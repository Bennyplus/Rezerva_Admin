import { publicApi } from "@/lib/api-client";

export interface RideDashboardData {
  total_trips: number;
  trips_today: number;
  ongoing_trips: number;
  completed_trips: number;
  cancelled_trips: number;
}

export interface ApiTrip {
  id: number;
  driver: string;
  origin: string;
  destination: string;
  departure_time: string;
  available_seats: number;
  price_per_seat: string;
  status: "upcoming" | "completed" | "ongoing" | "cancelled" | string;
}

export interface ApiPassenger {
  id?: number | string;
  name?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
}

export interface ApiTripDetail {
  id: number;
  driver: string;
  email?: string;
  phone_number?: string;
  license_status?: string;
  origin: string;
  destination: string;
  departure_time: string;
  available_seats: number;
  seats_booked?: number;
  price_per_seat: string;
  status: "upcoming" | "completed" | "ongoing" | "cancelled" | string;
  passengers?: ApiPassenger[];
}

export const ridesService = {
  /**
   * Ride Dashboard
   * GET administration/trips/dashboard/
   */
  getDashboard: async (): Promise<RideDashboardData> => {
    const response = await publicApi.get("", {
      params: { path: "administration/trips/dashboard/" },
    });
    return response.data;
  },

  /**
   * List Ride(s)
   * GET administration/trips/
   */
  getTrips: async (filters?: Record<string, any>): Promise<ApiTrip[]> => {
    const response = await publicApi.get("", {
      params: { path: "administration/trips/", ...filters },
    });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  },

  /**
   * Retrieve Ride
   * GET administration/trips/?trip_id=${tripId}
   */
  getTripById: async (tripId: number | string): Promise<ApiTripDetail> => {
    const response = await publicApi.get("", {
      params: {
        path: "administration/trips/",
        trip_id: tripId,
      },
    });
    const data = response.data;
    if (Array.isArray(data)) return data[0];
    if (Array.isArray(data?.results)) return data.results[0];
    if (Array.isArray(data?.data)) return data.data[0];
    return data;
  },

  /**
   * Cancel Ride
   * PUT administration/trips/cancel/?trip_id=${tripId}
   */
  cancelTrip: async (tripId: number | string, reason?: string): Promise<any> => {
    const response = await publicApi.put(
      "",
      reason ? { reason } : {},
      {
        params: {
          path: "administration/trips/cancel/",
          trip_id: tripId,
        },
      }
    );
    return response.data;
  },
};
