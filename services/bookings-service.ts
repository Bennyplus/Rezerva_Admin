import { publicApi } from "@/lib/api-client";

export interface ApiDriver {
  id?: number;
  full_name: string;
  rating?: number;
  profile_picture?: string;
  email?: string;
  phone_number?: string;
  license_status?: string;
}

export interface ApiVehicle {
  brand: string;
  model: string;
  colour?: string;
  plate_number?: string;
}

export interface ApiStopPoint {
  id?: number;
  stop_type: "pickup" | "dropoff" | string;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
}

export interface ApiPassenger {
  id?: number | string;
  full_name?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  profile_picture?: string;
}

export interface ApiBooking {
  id: string;
  booking_reference?: string;
  driver?: ApiDriver;
  vehicle?: ApiVehicle;
  passenger?: ApiPassenger;
  rider?: ApiPassenger;
  user?: ApiPassenger;
  pickup_location: string;
  destination: string;
  pickup_point?: ApiStopPoint;
  dropoff_point?: ApiStopPoint;
  seats_requested: number;
  price_at_booking: string;
  status: "pending" | "confirmed" | "completed" | "ongoing" | "cancelled" | string;
  payment_status?: "completed" | "pending" | "failed" | string;
  trip_date?: string;
  departure_time?: string;
  trip_frequency?: string;
  recurrence_days?: number[];
  start_date?: string;
  end_date?: string;
  trip_status?: string;
  trip_price_per_seat?: string;
  created_at?: string;
}

export interface BookingsApiResponse {
  count: number;
  results: ApiBooking[];
}

export const bookingsService = {
  /**
   * List Bookings
   * GET riders/bookings/?status=confirmed
   */
  getBookings: async (params?: Record<string, any>): Promise<ApiBooking[]> => {
    try {
      const response = await publicApi.get("", {
        params: {
          path: "riders/bookings/",
          status: "confirmed",
          ...params,
        },
      });
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.results)) return data.results;
      if (Array.isArray(data?.data)) return data.data;
      return [];
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      throw error;
    }
  },

  /**
   * Cancel Booking
   * Can be hooked to backend cancellation endpoint if available
   */
  cancelBooking: async (bookingId: string, data?: { reason: string }): Promise<any> => {
    try {
      const response = await publicApi.put(
        "",
        data || {},
        {
          params: {
            path: "riders/bookings/cancel/",
            booking_id: bookingId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to cancel booking ${bookingId}:`, error);
      throw error;
    }
  },
};
