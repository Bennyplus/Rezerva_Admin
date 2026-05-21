import { publicApi } from '@/lib/api-client';
import { Vehicle } from '@/types/vehicle';
import { Faq } from '@/types/faq';

// Brand ID to name mapping
const BRAND_MAP: { [key: number]: string } = {
  1: 'Toyota',
  2: 'Honda',
  3: 'BMW',
  4: 'Mercedes-Benz',
  5: 'Audi',
  6: 'Porsche',
  7: 'Tesla',
  8: 'Volkswagen',
  9: 'Ford',
  10: 'Chevrolet',
};

// Category ID to name mapping
const CATEGORY_MAP: { [key: number]: string } = {
  1: 'Sedan',
  2: 'SUV',
  3: 'Hatchback',
  4: 'Van',
  5: 'Luxury',
  6: 'Sports',
};

// Helper function to transform API vehicle to Vehicle interface
const transformVehicle = (apiVehicle: any): Vehicle => {
  const brandName = BRAND_MAP[apiVehicle.brand] || `Brand ${apiVehicle.brand}`;
  const categoryName = CATEGORY_MAP[apiVehicle.category] || `Category ${apiVehicle.category}`;
  const primaryImage = apiVehicle.images?.find((img: any) => img.is_primary)?.image ||
                       apiVehicle.images?.[0]?.image ||
                       '/images/placeholder-car.png';

  return {
    id: apiVehicle.id,
    name: `${brandName} ${apiVehicle.model}`,
    type: categoryName,
    transmission: apiVehicle.transmission || 'Automatic',
    capacity: apiVehicle.seats || 5,
    price: apiVehicle.price_per_day || '0',
    location: 'Available', // Default location since API doesn't provide it
    image: primaryImage,
    category: categoryName,
    rating: apiVehicle.rating || '4.5',
    reviews: apiVehicle.reviews || 0,
    fuel: apiVehicle.fuel_type || 'Petrol',
    gallery: apiVehicle.images?.map((img: any) => img.image) || [],
    features: apiVehicle.features || [],
    rules: [],
  };
};

export const marketingService = {
  /**
   * Fetches vehicles with optional filters
   * @param vehicleTypes - Array of vehicle types (e.g., ['suv', 'sedan'])
   */
  getVehicles: async (vehicleTypes?: string[]): Promise<Vehicle[]> => {
    const params: any = {
      path: 'api/v1/vehicles/fleet/',
    };

    if (vehicleTypes && vehicleTypes.length > 0) {
      params.vehicle_type = vehicleTypes.map(t => t.toLowerCase());
    }

    const response = await publicApi.get('', { params });
    const vehicles = response.data;
    
    // Transform API response to Vehicle interface
    return Array.isArray(vehicles) ? vehicles.map(transformVehicle) : [];
  },

  getVehicleById: async (id: string | number): Promise<Vehicle> => {
    const response = await publicApi.get('', {
      params: { path: `api/v1/vehicles/fleet/${id}/` }
    });
    return transformVehicle(response.data);
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
  },
  // getFleetVehicles: async (): Promise<any[]> => {
  //   const res = await publicApi.get('', {
  //     params: { path: 'api/v1/vehicles/fleet/' }
  //   });
  //   return res.data;
  // }
};
