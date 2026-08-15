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
  country_code: string | number; // Country ID selected from list countries
  phone_number: string;
  password: string;
  confirm_password: string;
  gender: string;
  user_type: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ContactUsPayload {
  full_name: string;
  email: string;
  phone_number?: string;
  country?: string | number;
  subject: string;
  message: string;
}

export const accountsService = {
  /**
   * Sets the password for a team member
   * @param uid - User ID
   * @param token - Secure token
   * @param payload - Password payload object
   */
  setPassword: async (uid: string, token: string, payload: any): Promise<any> => {
    const response = await publicApi.post('', payload, {
      params: {
        path: `api/v1/admin/set-password/`,
        uid: uid,
        token: token
      }
    });
    return response.data;
  },

  /**
   * Fetches the list of countries from accounts/countries/
   * Returns an array of countries
   */
  getCountries: async (): Promise<Country[]> => {
    const response = await publicApi.get('', {
      params: { path: 'accounts/countries/' }
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
    const formData = new FormData();
    formData.append('email', payload.email);
    formData.append('password', payload.password);

    const response = await publicApi.post('', formData, {
      params: { path: 'accounts/login/' },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<any> => {
    const formData = new FormData();
    formData.append('full_name', payload.full_name);
    formData.append('email', payload.email);
    formData.append('country_code', String(payload.country_code));
    formData.append('phone_number', payload.phone_number);
    formData.append('password', payload.password);
    formData.append('confirm_password', payload.confirm_password);
    if (payload.gender) formData.append('gender', payload.gender);
    if (payload.user_type) formData.append('user_type', payload.user_type);

    const response = await publicApi.post('', formData, {
      params: { path: 'accounts/register/' },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Verifies the OTP sent to the user after registration
   * @param otp - The one-time password code
   */
  verifyOTP: async (otp: string): Promise<any> => {
    const formData = new FormData();
    formData.append('otp', otp);
    formData.append('otp_code', otp);

    const response = await publicApi.post('', formData, {
      params: { path: 'accounts/verify-otp/' },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Submits the contact us form
   * @param payload - ContactUsPayload object
   */
  contactUs: async (payload: ContactUsPayload): Promise<any> => {
    const response = await publicApi.post('', payload, {
      params: { path: 'api/v1/accounts/contact-us/' }
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
      params: { path: 'api/v1/admin/members/' },
      // skipToast: true
    } as any);
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
      params: { path: `api/v1/admin/suspend-member/`, user_id: id }
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
      throw e;
    }
  },

  /**
   * Verifies the referral code for driver online registration
   * @param data - FormData containing referral_code
   */
  verifyDriverReferral: async (data: FormData): Promise<any> => {
    const response = await publicApi.post('', data, {
      params: { path: 'api/v1/drivers/verify-referral/' },
      skipToast: true
    } as any);
    return response.data;
  },

  /**
   * Registers a new driver online
   * @param referralCode - Validated referral code
   * @param data - FormData containing driver metadata and files
   */
  registerDriverOnline: async (referralCode: string, data: FormData): Promise<any> => {
    const response = await publicApi.post('', data, {
      params: {
        path: 'api/v1/drivers/online/register/',
        referral_code: referralCode
      },
      skipToast: true
    } as any);
    return response.data;
  },

  /**
   * Updates user profile details at accounts/profile/
   */
  updateProfile: async (payload: any): Promise<any> => {
    const response = await publicApi.put('', payload, {
      params: { path: 'api/v1/accounts/profile/' }
    });
    return response.data;
  }
};
