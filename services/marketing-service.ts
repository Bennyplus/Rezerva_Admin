import { publicApi } from '@/lib/api-client';
import { Vehicle } from '@/types/vehicle';
import { Faq } from '@/types/faq';

export const marketingService = {
  /**
   * Fetches vehicles with optional filters
   * @param vehicleTypes - Array of vehicle types (e.g., ['suv', 'sedan'])
   */
  getVehicles: async (vehicleTypes?: string[]): Promise<Vehicle[]> => {
    const params = new URLSearchParams();
    
    if (vehicleTypes && vehicleTypes.length > 0) {
      vehicleTypes.forEach(type => {
        params.append('vehicle_type', type.toLowerCase());
      });
    }

    const response = await publicApi.get(`vehicles/manage/`, {
      params: params
    });
    
    return response.data;
  },

  /**
   * Fetches a single vehicle by ID
   */
  getVehicleById: async (id: string | number): Promise<Vehicle> => {
    const response = await publicApi.get(`vehicles/manage/${id}/`);
    return response.data;
  },

  /**
   * Fetches FAQs
   */
  getFaqs: async (): Promise<Faq[]> => {
    const response = await publicApi.get('api/v1/accounts/faqs/');
    return response.data;
  }
};
