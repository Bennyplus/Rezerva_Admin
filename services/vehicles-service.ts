import { publicApi } from '@/lib/api-client';
import { AdminVehicle } from '@/data/admin-vehicles';

export const vehiclesService = {
  /**
   * Fetches the list of vehicles from admin/vehicles/
   * Returns an array of vehicles
   */
  getVehicles: async (): Promise<AdminVehicle[]> => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/vehicles/manage/' }
      });

      let rawVehicles: any[] = [];

      // Check if the response is the grouped dictionary structure
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        // It might be wrapped in results/data, or it might be the dictionary directly
        const dataToProcess = response.data.results || response.data.data || response.data;
        
        if (Array.isArray(dataToProcess)) {
          rawVehicles = dataToProcess;
        } else if (typeof dataToProcess === 'object') {
          // Extract vehicles from each group (e.g. "Budget Friendly", "Hot Cars")
          // Use a Map to deduplicate vehicles that appear in multiple groups
          const uniqueVehicles = new Map<number, any>();
          Object.values(dataToProcess).forEach((group: any) => {
            if (group && Array.isArray(group.vehicles)) {
              group.vehicles.forEach((v: any) => {
                if (v.id && !uniqueVehicles.has(v.id)) {
                  uniqueVehicles.set(v.id, v);
                }
              });
            }
          });
          rawVehicles = Array.from(uniqueVehicles.values());
        }
      } else if (Array.isArray(response.data)) {
        rawVehicles = response.data;
      }

      // Map the raw API vehicles to the expected AdminVehicle interface
      return rawVehicles.map((v: any): AdminVehicle => {
        // Capitalize status properly to match "Available" | "Maintenance" | "Booked"
        let mappedStatus: AdminVehicle['status'] = "Available";
        if (v.status) {
          const lowerStatus = v.status.toLowerCase();
          if (lowerStatus.includes('maintenance')) mappedStatus = 'Maintenance';
          else if (lowerStatus.includes('book')) mappedStatus = 'Booked';
        }

        return {
          name: `${v.year || ''} ${v.model || 'Unknown'}`.trim(),
          brand: typeof v.brand === 'string' ? v.brand : `Brand ${v.brand || 'Unknown'}`,
          image: v.images && v.images.length > 0 ? v.images[0].image : '/images/3rd-img.png', // Fallback to a default
          category: typeof v.category === 'string' ? v.category : `Category ${v.category || 'Unknown'}`,
          dailyPrice: parseFloat(v.price_per_day) || 0,
          capacity: v.seats || 4,
          status: mappedStatus,
          chassisNo: v.chasis_number || v.vin_number || 'N/A',
          location: 'N/A', // Location is not provided in this response payload
        };
      });
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      return []; // Return empty array on error for fallback to empty state
    }
  }
};
