import { publicApi } from '@/lib/api-client';

export const driversService = {
  getDrivers: async (): Promise<any[]> => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/drivers/management/' }
      });
      const raw = response?.data?.results || response?.data?.data || (Array.isArray(response?.data) ? response.data : []);
      return raw.map((item: any) => mapDriver(item));
    } catch (error) {
      console.error('Failed to get drivers:', error);
      throw error;
    }
  },

  addDriver: async (formData: FormData): Promise<any> => {
    try {
      const response = await publicApi.post('', formData, {
        params: { path: 'api/v1/admin/drivers/management/' },
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add driver:', error);
      throw error;
    }
  },

  suspendDriver: async (id: string): Promise<any> => {
    try {
      const response = await publicApi.post('', {}, {
        params: { path: `api/v1/admin/drivers/management/suspend/?driver_id=${id}/` },
        successMessage: 'Driver has been suspended.',
      } as any);
      return response.data;
    } catch (error) {
      console.error(`Failed to suspend driver ${id}:`, error);
      throw error;
    }
  },
};

function mapDriver(item: any) {
  return {
    id: String(item.id),
    name: item.full_name || 'N/A',
    email: item.email || 'N/A',
    phone: item.phone_number || 'N/A',
    licenseNo: item?.profile?.license_number || 'N/A',
    avatar: item?.profile?.profile_picture || '/images/admin/profile-Avatar.svg',
    rating: item?.profile?.rating || 0,
    status: item?.profile?.status === 'Available' ? 'Active' : 'Inactive',
    availability: item?.profile?.status || 'Offline',
    location: item.location || 'Unknown',
    licenseStatus: 'Valid',
    totalTrips: 0,
    reports: 0,
    currentBooking: null,
    assignedTrips: 0,
    bookingHistory: [],
    documents: {
      driversLicense: { label: "Drivers License", filename: item?.profile?.driver_license ? "driver_license.jpg" : "—", size: "—" },
      nin: { label: "NIN", filename: item?.profile?.nin_document ? "nin_document.jpg" : "—", size: "—" },
      proofOfAddress: { label: "Proof Of Address", filename: "—", size: "—" },
      nin2: { label: "NIN", filename: "—", size: "—" },
    },
  };
}
