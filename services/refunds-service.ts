import { publicApi } from "@/lib/api-client";
import { Refund } from "@/data/admin-refunds";

export interface RefundsListResponse {
  results: Refund[];
  count: number;
  next: string | null;
  previous: string | null;
}

export const refundsService = {
  /**
   * Fetches paginated refunds list.
   */
  getRefunds: async (params?: Record<string, any>): Promise<RefundsListResponse> => {
    const response = await publicApi.get("", {
      params: { path: "api/v1/admin/refunds" },
    });
    const data = response.data;
    // Support both paginated and flat array responses
    if (Array.isArray(data)) {
      return { results: data, count: data.length, next: null, previous: null };
    }
    return {
      results: data?.results ?? data?.data ?? [],
      count: data?.count ?? 0,
      next: data?.next ?? null,
      previous: data?.previous ?? null,
    };
  },

  /**
   * Fetches a single refund by ID.
   */
  getRefund: async (refundId: string): Promise<Refund> => {
    const response = await publicApi.get("", {
      params: { path: "api/v1/admin/payments/refunds/info/", refund_id: refundId },
    });
    return response.data;
  },

  /**
   * Approves / processes a refund.
   */
  processRefund: async (refundId: string, payload?: Record<string, any>): Promise<any> => {
    const response = await publicApi.post("", payload ?? {}, {
      params: { path: "api/v1/admin/process-refunds/", refund_id: refundId },
      successMessage: "Refund processed successfully.",
    } as any);
    return response.data;
  },

  /**
   * Rejects a refund.
   */
  rejectRefund: async (refundId: string, reason: string): Promise<any> => {
    const response = await publicApi.post(
      "",
      { reason },
      {
        params: { path: "api/v1/admin/refunds/reject/", refund_id: refundId },
        successMessage: "Refund rejected.",
      } as any
    );
    return response.data;
  },
};
