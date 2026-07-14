import { publicApi } from '@/lib/api-client';
import { AdminVehicle } from '@/data/admin-vehicles';

export const vehiclesService = {
  /**
   * Fetches all dynamic options for vehicle forms (brands, colors, fuels, transmissions, features)
   */
  getVehicleOptions: async () => {
    try {
      const [brandsRes, colorsRes, fuelsRes, transRes, featuresRes, categoriesRes] = await Promise.all([
        publicApi.get("", { params: { path: "api/v1/vehicles/brands/" } }),
        publicApi.get("", { params: { path: "api/v1/vehicles/colors/" } }),
        publicApi.get("", { params: { path: "api/v1/vehicles/fuel-types/" } }),
        publicApi.get("", { params: { path: "api/v1/vehicles/transmissions/" } }),
        publicApi.get("", { params: { path: "api/v1/vehicles/features/" } }),
        publicApi.get("", { params: { path: "api/v1/vehicles/categories/" } }),
      ]);

      return {
        brands: Array.isArray(brandsRes.data) ? brandsRes.data : brandsRes.data?.results || [],
        colors: Array.isArray(colorsRes.data) ? colorsRes.data : colorsRes.data?.results || [],
        fuels: Array.isArray(fuelsRes.data) ? fuelsRes.data : fuelsRes.data?.results || [],
        transmissions: Array.isArray(transRes.data) ? transRes.data : transRes.data?.results || [],
        features: Array.isArray(featuresRes.data) ? featuresRes.data : featuresRes.data?.results || [],
        categories: Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data?.results || [],
      };
    } catch (error) {
      console.error("Failed to fetch vehicle options:", error);
      throw error;
    }
  },

  /**
   * Creates a new vehicle using FormData
   */
  createVehicle: async (payload: FormData) => {
    try {
      const response = await publicApi.post("", payload, {
        params: { path: "api/v1/vehicles/manage/" },
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create vehicle:", error);
      throw error;
    }
  },

  /**
   * Updates a vehicle's status (Booked, Maintenance, Inactive)
   */
  updateVehicleStatus: async (vehicleId: number, status: string) => {
    try {
      const formData = new FormData();
      formData.append("status", status);

      const response = await publicApi.patch("", formData, {
        params: { path: "api/v1/admin/vehicles/update-status/", vehicle_id: vehicleId },
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to update vehicle status:", error);
      throw error;
    }
  },

  /**
   * Fetches the dashboard vehicles, stats, and pagination data
   */
  getVehicles: async (page: number = 1, filters?: Record<string, string>): Promise<any> => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/vehicles/dashboard/', page, ...filters }
      });
      return response.data;
    } catch (error) {
      // Fallback in case api/v1 is not needed
      try {
        const fallbackResponse = await publicApi.get('', {
          params: { path: 'admin/vehicles/dashboard/', page, ...filters }
        });
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Failed to fetch dashboard vehicles:', fallbackError);
        throw fallbackError;
      }
    }
  },

  /**
   * Fetches brands and categories for mapping
   */
  getBrandsAndCategories: async () => {
    try {
      const [brandsRes, categoriesRes] = await Promise.all([
        publicApi.get("", { params: { path: "api/v1/vehicles/brands/" } }),
        publicApi.get("", { params: { path: "api/v1/vehicles/categories/" } })
      ]);
      return {
        brands: Array.isArray(brandsRes.data) ? brandsRes.data : brandsRes.data?.results || [],
        categories: Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data?.results || []
      };
    } catch (e) {
      console.error("Failed to fetch brands and categories:", e);
      return { brands: [], categories: [] };
    }
  },

  bulkUploadVehicles: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await publicApi.post("", formData, {
        params: { path: "api/v1/vehicles/bulk-upload/" },
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to bulk upload vehicles:", error);
      throw error;
    }
  }
};
