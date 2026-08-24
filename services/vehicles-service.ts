import { publicApi } from '@/lib/api-client';

export const vehiclesService = {
  /**
   * Fetches the administration vehicles list
   * GET administration/vehicles/
   */
  getVehicles: async (page: number = 1, filters?: Record<string, string>): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: 'administration/vehicles/', page, ...filters }
    });
    return response.data;
  },

  /**
   * Fetches pending vehicles list
   * GET administration/vehicles/?status=pending
   */
  getPendingVehicles: async (page: number = 1, filters?: Record<string, string>): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: 'administration/vehicles/', status: 'pending', page, ...filters }
    });
    return response.data;
  },

  /**
   * Approve Vehicle
   * PUT administration/vehicles/?vehicle_id={id}
   */
  approveVehicle: async (vehicleId: number | string): Promise<any> => {
    const response = await publicApi.put('', { is_active: true, status: 'approved' }, {
      params: { path: 'administration/vehicles/', vehicle_id: vehicleId }
    });
    return response.data;
  },

  /**
   * Decline Vehicle
   * PUT administration/vehicles/?vehicle_id={id}
   */
  declineVehicle: async (vehicleId: number | string, reason?: string): Promise<any> => {
    const response = await publicApi.put('', { is_active: false, status: 'declined', reason }, {
      params: { path: 'administration/vehicles/', vehicle_id: vehicleId }
    });
    return response.data;
  },

  /**
   * View Vehicle Documents
   * GET administration/vehicles/documents/?vehicle_id={id}
   */
  getVehicleDocuments: async (vehicleId: number | string): Promise<any[]> => {
    const response = await publicApi.get('', {
      params: { path: 'administration/vehicles/documents/', vehicle_id: vehicleId }
    });
    return Array.isArray(response.data) ? response.data : [];
  }
};
