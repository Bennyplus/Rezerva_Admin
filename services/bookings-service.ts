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

  cancelBooking: async (bookingRef: string, data: { reason: string }) => {
    try {
      const response = await publicApi.post('', data, {
        params: { path: `api/v1/admin/bookings/cancel/`, booking_ref: bookingRef },
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
  },

  confirmPickup: async (bookingRef: string, data?: { otp_code: string }) => {
    try {
      const formData = new FormData();
      if (data?.otp_code) {
        formData.append('otp_code', data.otp_code);
      }
      const response = await publicApi.post('', formData, {
        params: { path: `api/v1/admin/bookings/confirm-pickup/`, booking_ref: bookingRef },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to confirm pickup for booking ${bookingRef}:`, error);
      throw error;
    }
  },

  uploadVehicleImages: async (
    bookingRef: string,
    data: { images: { [key: string]: File }; mileage: string }
  ) => {
    try {
      const formData = new FormData();
      Object.entries(data.images).forEach(([key, file]) => {
        if (file) {
          formData.append("images", file);
        }
      });
      formData.append("mileage_at_pickup", data.mileage);

      const response = await publicApi.post("", formData, {
        params: { path: `api/v1/admin/bookings/upload-pickup-data/`, booking_ref: bookingRef },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to upload vehicle images for booking ${bookingRef}:`, error);
      throw error;
    }
  },

  modifyBooking: async (bookingRef: string, data: {}) => {
    try {
      const response = await publicApi.put('', data, {
        params: { path: `api/v1/admin/bookings/`, booking_ref: bookingRef },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to modify booking ${bookingRef}:`, error);
      throw error;
    }
  },

  sendReminder: async (bookingRef: string, data: { reason: string }) => {
    try {
      const response = await publicApi.post('', data, {
        params: { path: `api/v1/admin/bookings/send-reminder/`, booking_ref: bookingRef },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to send reminder for booking ${bookingRef}:`, error);
      throw error;
    }
  },
};
