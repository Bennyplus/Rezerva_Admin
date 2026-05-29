import { publicApi } from '@/lib/api-client';

export const bookingsService = {
  getBookings: async () => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/bookings/list/' }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      throw error;
    }
  },

  getBookingDetail: async (bookingRef: string) => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/bookings/', booking_ref: bookingRef }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch booking detail for ${bookingRef}:`, error);
      throw error;
    }
  },

  cancelBooking: async (bookingRef: string) => {
    try {
      const response = await publicApi.post('', {
        params: { path: `api/v1/admin/bookings/cancel/`, booking_ref: bookingRef }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to cancel booking ${bookingRef}:`, error);
      throw error;
    }
  },

  getMetrics: async () => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/bookings/metrics/' }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch booking metrics:', error);
      throw error;
    }
  },

  exportBookings: async () => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/bookings/list/', export: 'xlsx' },
        responseType: 'arraybuffer',
      });
      return response;
    } catch (error) {
      console.error('Failed to export bookings:', error);
      throw error;
    }
  }
};
