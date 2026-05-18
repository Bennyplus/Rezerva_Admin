import { publicApi } from '@/lib/api-client';

export interface Country {
  id: number;
  name: string;
  iso_code: string;
  dial_code: string;
  flag: string | null;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  country_code: string | number; // Country ID selected from list countries
}

export const accountsService = {
  /**
   * Fetches the list of countries from accounts/countries/
   * Returns an array of countries
   */
  getCountries: async (): Promise<Country[]> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/accounts/countries/' }
    });
    
    // API response formatting handles both arrays directly or wrapped results
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.results || response.data?.data || [];
  },

  /**
   * Creates a new user account at accounts/register/
   * @param payload - RegisterPayload object
   */
  register: async (payload: RegisterPayload): Promise<any> => {
    const response = await publicApi.post('', payload, {
      params: { path: 'api/v1/accounts/register/' }
    });
    return response.data;
  }
};
