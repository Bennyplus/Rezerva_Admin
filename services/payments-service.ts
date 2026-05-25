import { publicApi } from '@/lib/api-client';
import { Transaction, Payout } from '@/data/admin-payments'; // Reusing your types for now

export const paymentsService = {
  /**
   * Fetches all transactions
   */
  getTransactions: async (page = 1, search = ""): Promise<Transaction[]> => {
    const response = await publicApi.get('', {
      // Update this path to match your exact backend endpoint
      params: { path: 'api/v1/admin/payments/transactions/', page, search }
    });
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.results || response.data?.data || [];
  },

  /**
   * Fetches all payouts
   */
  getPayouts: async (page = 1, search = ""): Promise<Payout[]> => {
    const response = await publicApi.get('', {
      // Update this path to match your exact backend endpoint
      params: { path: 'api/v1/admin/payments/payouts/', page, search }
    });
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.results || response.data?.data || [];
  },

  /**
   * Fetches payment statistics
   */
  getPaymentStats: async (): Promise<any> => {
    const response = await publicApi.get('', {
      // Update this path to match your exact backend endpoint
      params: { path: 'api/v1/admin/payments/stats/' }
    });
    
    return response.data;
  }
};
