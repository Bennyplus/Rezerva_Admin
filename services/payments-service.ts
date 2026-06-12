import { publicApi } from '@/lib/api-client';
import { Transaction, Payout } from '@/data/admin-payments'; // Reusing your types for now

export const paymentsService = {
  /**
   * Fetches all transactions
   */
  getTransactions: async (page = 1, search = ""): Promise<Transaction[]> => {
    const response = await publicApi.get('', {
      params: { path: 'api/v1/admin/payments/' } // no search params
    });

    const rawData = response?.data?.results || response?.data?.data || (Array.isArray(response?.data) ? response.data : []);

    return rawData.map((item: any) => {
      let mappedStatus = "Pending";
      const s = String(item?.status || "").toLowerCase();
      if (s === "success" || s === "successful" || s === "completed") mappedStatus = "Completed";
      else if (s === "failed") mappedStatus = "Failed";
      else if (s === "reversed") mappedStatus = "Reversed";
      else if (s === "processing") mappedStatus = "Processing";

      return {
        id: item?.transaction_id || item?.id || `txn-${Math.random().toString(36).substring(2, 9)}`,
        customerId: item?.customer_id || item?.user_id || "",
        customerName: item?.customer_name || item?.user_name || item?.customer || "Unknown",
        amount: item?.amount || "$0.00",
        type: item?.transaction_type || item?.type || item?.payment_type || "Payment",
        date: item?.date || item?.created_at || item?.payment_date || "N/A",
        status: mappedStatus,
      };
    });
  },

  /**
   * Marks a payment as successful
   */
  markAsSuccessful: async (paymentId: string): Promise<any> => {
    const response = await publicApi.put('', {}, {
      params: { path: `api/v1/admin/payments/mark-as-successful/`, payment_id: paymentId }
    });
    return response.data;
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
      params: { path: 'api/v1/admin/payments/metrics/' }
    });

    return response.data;
  },

  /**
   * Fetches payment details
   */
  getPaymentDetails: async (paymentId: string): Promise<any> => {
    const response = await publicApi.get('', {
      params: { path: `api/v1/admin/payments/info/`, payment_id: paymentId }
    });
    return response.data;
  }
};
