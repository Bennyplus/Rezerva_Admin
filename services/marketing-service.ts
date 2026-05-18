import { publicApi } from '@/lib/api-client';
import { Vehicle } from '@/types/vehicle';
import { Faq } from '@/types/faq';

export const marketingService = {
  /**
   * Fetches vehicles with optional filters
   * @param vehicleTypes - Array of vehicle types (e.g., ['suv', 'sedan'])
   */
  getVehicles: async (vehicleTypes?: string[]): Promise<Vehicle[]> => {
    const params: any = {
      path: 'vehicles/manage/',
    };

    if (vehicleTypes && vehicleTypes.length > 0) {
      params.vehicle_type = vehicleTypes.map(t => t.toLowerCase());
    }

    const response = await publicApi.get('', { params });
    return response.data;
  },

  getVehicleById: async (id: string | number): Promise<Vehicle> => {
    const response = await publicApi.get('', {
      params: { path: `vehicles/manage/${id}/` }
    });
    return response.data;
  },

  getFaqs: async (): Promise<Faq[]> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/accounts/faqs/' }
    });
    return response.data;
  },

  getTestimonials: async (): Promise<any[]> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/accounts/testimonials/' }
    });
    return response.data;
  }
};
