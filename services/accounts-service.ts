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

export interface LoginPayload {
  email: string;
  password: string;
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
   * Logs a user into the admin account at accounts/login/
   * @param payload - LoginPayload object
   */
  login: async (payload: LoginPayload): Promise<any> => {
    const response = await publicApi.post('', payload, {
      params: { path: 'api/v1/accounts/login/' }
    });
    return response.data;
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
  },

  /**
   * Verifies the OTP sent to the user after registration
   * @param otp - The one-time password code
   */
  verifyOTP: async (otp: string): Promise<any> => {
    const response = await publicApi.post('', { otp }, {
      params: { path: 'api/v1/accounts/verify-otp/' }
    });
    return response.data;
  },
  /**
   * Creates a new role in the admin account at admin/roles/
   * @param payload - RolePayload object
   */
  createRole: async (payload: any): Promise<any> => {
    const response = await publicApi.post('', payload, {
      params: { path: 'api/v1/admin/roles/' }
    });
    return response.data;
  },
  /**
   * Updates an existing role in the admin account at admin/roles/{id}/
   * @param payload - RolePayload object
   */
  updateRole: async (id: string, payload: any): Promise<any> => {
    const response = await publicApi.put('', payload, {
      params: { path: `api/v1/admin/roles/`, role_id: id }
    });
    return response.data;
  },
  /**
   * Deletes a role from the admin account at admin/roles/?role_id={id}
   * @param id - The ID of the role to delete
   */
  deleteRole: async (id: string): Promise<any> => {
    const response = await publicApi.delete('', {
      params: { path: `api/v1/admin/roles/`, role_id: id }
    });
    return response.data;
  },
  /**
   * Deactivates a role from the admin account at admin/roles/deactivate/?role_id={id}
   * @param id - The ID of the role to deactivate
   */
  deactivateRole: async (id: string): Promise<any> => {
    const response = await publicApi.patch('', {}, {
      params: { path: `api/v1/admin/roles/deactivate/`, role_id: id }
    });
    return response.data;
  },
  /**
   * Gets all roles from the admin account at admin/roles/
   * @param payload - RolePayload object
   */
  getRoles: async (): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/roles/' }
    });
    return response.data;
  },

  /**
   * Gets all team members from the admin account at admin/members/
   */
  getTeamMembers: async (): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/members/' }
    });
    return response.data;
  },

  /**
   * Adds a team member to the admin account at admin/members/
   * @param payload - Team member payload object
   */
  addTeamMember: async (payload: any): Promise<any> => {
    const response = await publicApi.post('', payload, {
      params: { path: 'api/v1/admin/members/' }
    });
    return response.data;
  },

  /**
   * Updates a team member's role
   */
  updateTeamMember: async (id: string, payload: any): Promise<any> => {
    const response = await publicApi.put('', payload, {
      params: { path: `api/v1/admin/member/update-role/`, member_id: id }
    });
    return response.data;
  },

  /**
   * Suspends a team member
   */
  suspendTeamMember: async (id: string, payload: { reason: string }): Promise<any> => {
    const response = await publicApi.post('', payload, {
      params: { path: `api/v1/admin/members/suspend/`, member_id: id }
    });
    return response.data;
  },

  /**
   * Logs the user out by hitting the custom proxy logout route which clears cookies
   */
  logout: async () => {
    try {
      await publicApi.get('', {
        params: { path: 'auth/logout' }
      });
    } catch (e) {
      console.error('Logout failed:', e);
    }
  }
};
