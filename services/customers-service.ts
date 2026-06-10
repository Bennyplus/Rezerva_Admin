import { publicApi } from "@/lib/api-client";

export const customersService = {
  /**
   * Fetches the customer list.
   * @param params Query parameters (e.g., page, search)
   */
  getCustomers: async (params?: any): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/customers/management/', ...params }
    });
    return response.data;
  },

  /**
   * Fetches a specific customer's info
   * @param userId The ID of the customer
   */
  getCustomerInfo: async (userId: number | string): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: `api/v1/admin/customers/info/`, user_id: userId }
    });
    return response.data;
  },

  /**
   * Fetches a specific customer's bookings
   * @param userId The ID of the customer
   */
  getCustomerBookings: async (userId: number | string): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: `api/v1/admin/customers/bookings/`, user_id: userId }
    });
    return response.data;
  },

  /**
   * Fetches a specific customer's reviews
   * @param userId The ID of the customer
   */
  getCustomerReviews: async (userId: number | string): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: `api/v1/admin/customers/reviews/`, user_id: userId }
    });
    return response.data;
  },

  /**
   * Fetches a specific review
   * @param reviewId The ID of the review
   */
  getCustomerReview: async (reviewId: string): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: `api/v1/admin/customers/reviews/`, review_id: reviewId }
    });
    return response.data;
  },

  /**
   * Triggers an export of the customer list
   */
  exportCustomers: async (): Promise<Blob> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/customers/management/', export: 'xlsx' },
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Suspends a customer account
   * @param userId The ID of the customer
   * @param payload Optional reason for suspension
   */
  suspendCustomer: async (userId: number | string, payload?: any): Promise<any> => {
    const response = await publicApi.post('', payload || {}, {
      params: { path: `api/v1/admin/customers/suspend/`, user_id: userId }
    });
    return response.data;
  },

  /**
   * Deactivates a customer account
   * @param userId The ID of the customer
   */
  deactivateCustomer: async (userId: number | string): Promise<any> => {
    const response = await publicApi.post('', {}, {
      params: { path: `api/v1/admin/customers/deactivate/`, user_id: userId }
    });
    return response.data;
  }
};
