import { publicApi } from "@/lib/api-client";

export interface ApiWallet {
  id: string; // e.g. "RES-WA-786"
  balance: string; // e.g. "2000.00"
  pending_balance: string; // e.g. "0.00"
  currency: string; // e.g. "NGN"
  status: "active" | "suspended" | string;
  freeze_reason?: string | null; // e.g. "Fraudlent activity"
  updated_at?: string; // e.g. "2026-08-03T12:36:18.245853Z"
  user?: number;
  username?: string;
}

export const walletService = {
  /**
   * List Wallet (Customer & Driver)
   * GET administration/wallet/
   */
  getWallets: async (filters?: Record<string, any>): Promise<ApiWallet[]> => {
    const response = await publicApi.get("", {
      params: { path: "administration/wallet/", ...filters },
    });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  },

  /**
   * Retrieve Wallet
   * GET administration/wallet/?wallet_id={wallet_id}
   */
  getWallet: async (walletId: string): Promise<ApiWallet> => {
    const response = await publicApi.get("", {
      params: { path: "administration/wallet/", wallet_id: walletId },
    });
    return response.data;
  },

  /**
   * Freeze / Suspend Wallet
   * PUT administration/wallet/?wallet_id={wallet_id}
   * Body: FormData (status, freeze_reason)
   */
  freezeWallet: async (
    walletId: string,
    payload?: { status?: string; freeze_reason?: string; reason?: string } | FormData,
  ): Promise<any> => {
    let body: FormData;
    if (payload instanceof FormData) {
      body = payload;
    } else {
      body = new FormData();
      body.append("status", payload?.status || "suspended");
      const reason =
        payload?.freeze_reason || payload?.reason || "Fraudlent activity";
      body.append("freeze_reason", reason);
    }

    const response = await publicApi.put(
      "",
      body,
      {
        params: { path: "administration/wallet/", wallet_id: walletId },
        headers: { "Content-Type": "multipart/form-data" },
        successMessage: "Wallet updated successfully!",
      } as any,
    );
    return response.data;
  },

  /**
   * Credit Wallet
   * POST administration/wallet/credit/?wallet_id={wallet_id}
   * Body: FormData (amount, reason, category)
   */
  creditWallet: async (
    walletId: string,
    payload:
      | {
          amount: number | string;
          reason?: string;
          category?: string;
        }
      | FormData,
  ): Promise<any> => {
    let body: FormData;
    if (payload instanceof FormData) {
      body = payload;
    } else {
      body = new FormData();
      body.append("amount", String(payload.amount));
      if (payload.reason) body.append("reason", payload.reason);
      if (payload.category) {
        const cat = payload.category.toLowerCase().replace(/\s+/g, "_");
        body.append("category", cat === "bonus" ? "referral_bonus" : cat);
      }
    }

    const response = await publicApi.post("", body, {
      params: {
        path: "administration/wallet/credit/",
        wallet_id: walletId,
      },
      headers: { "Content-Type": "multipart/form-data" },
      successMessage: "Wallet credited successfully!",
    } as any);
    return response.data;
  },
};
