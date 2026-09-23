import { publicApi } from '@/lib/api-client';

export interface PaymentCustomer {
  id: number | string;
  full_name: string;
  email: string;
  phone_number: string;
}

export interface PaymentTransaction {
  id: string;
  provider_reference: string | null;
  customer: PaymentCustomer;
  amount: string;
  method: string;
  initiated_at: string;
  status: string;
}

export interface PaymentStats {
  total_revenue: string;
  total_refunds: string;
  pending_transactions: number;
  total_payouts: string;
  total_commissions?: string;
}

export interface PaymentsResponse {
  stats: PaymentStats;
  transactions: PaymentTransaction[];
}

export interface PaymentDetailResponse {
  id: string;
  customer: PaymentCustomer;
  booking_id: string;
  amount: string;
  fees: string | null;
  method: string;
  provider_reference: string | null;
  initiated_at: string;
  paid_at: string | null;
  status: string;
  error_message: string;
  retry_count: number;
}

export interface Payout {
  id: string;
  driverName: string;
  amount: string;
  transactionReference: string;
  date: string;
  status: "Pending" | "Completed";
}

export interface PayoutRequest {
  id: string;
  requestAmount: string;
  requestDated: string;
  bank: string;
  accountNumber: string;
  accountName: string;
  currentBalance: string;
}

export interface PayoutHistory {
  id: string;
  date: string;
  amount: string;
  bank: string;
  reference: string;
  status: "Paid" | "Rejected";
}

export const paymentsService = {
  /**
   * Fetches payments summary & transactions from administration endpoint
   */
  getPayments: async (): Promise<PaymentsResponse> => {
    const response = await publicApi.get('', {
      params: { path: 'administration/payments/' }
    });
    return response.data;
  },

  /**
   * Fetches top stats card data from administration/payments/stats/
   */
  getPaymentStats: async (): Promise<PaymentStats> => {
    const response = await publicApi.get('', {
      params: { path: 'administration/payments/stats/' }
    });
    return response.data;
  },

  /**
   * Fetches single payment detail by payment_id
   */
  getPaymentDetails: async (paymentId: string): Promise<PaymentDetailResponse> => {
    const response = await publicApi.get('', {
      params: {
        path: 'administration/payments/',
        payment_id: paymentId,
      }
    });
    return response.data;
  },

  /**
   * Marks a payment as successful via POST administration/payments/action/
   */
  markAsSuccessful: async (paymentId: string): Promise<any> => {
    const formData = new FormData();
    formData.append('payment_id', paymentId);
    formData.append('action', 'mark_successful');

    const response = await publicApi.post('', formData, {
      params: { path: 'administration/payments/action/' },
    });
    return response.data;
  }
};
