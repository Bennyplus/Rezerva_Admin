import { publicApi } from "@/lib/api-client";

export interface ReferralHistoryItem {
  referred_user_id: number;
  full_name: string;
  date_joined: string;
  referral_id?: string;
  referrer_name?: string;
  reward_amount?: string | number;
  is_fraud?: boolean;
  status?: "Successful" | "Failed" | string;
}

export interface ReferralDashboardResponse {
  reward_points: number;
  no_of_referrals: number;
  referral_code: string;
  history: ReferralHistoryItem[];
  total_referrals?: number;
  successful_referrals?: number;
  rewards_paid?: number | string;
  flagged_referrals?: number;
}

export const referralsService = {
  /**
   * Referral(s) Dashboard
   * GET accounts/referrals/
   */
  getReferralsDashboard: async (
    filters?: Record<string, any>,
  ): Promise<ReferralDashboardResponse> => {
    const response = await publicApi.get("", {
      params: { path: "accounts/referrals/", ...filters },
    });
    return response.data;
  },

  /**
   * Suspend Referral Reward
   * PUT accounts/referrals/suspend/?referral_id={id}
   */
  suspendReward: async (referralId: string | number): Promise<any> => {
    const response = await publicApi.put(
      "",
      { status: "suspended" },
      {
        params: {
          path: "accounts/referrals/suspend/",
          referral_id: referralId,
        },
        successMessage: "Referral reward suspended successfully!",
      } as any,
    );
    return response.data;
  },

  /**
   * Reinstate Referral Reward
   * PUT accounts/referrals/reinstate/?referral_id={id}
   */
  reinstateReward: async (referralId: string | number): Promise<any> => {
    const response = await publicApi.put(
      "",
      { status: "reinstated" },
      {
        params: {
          path: "accounts/referrals/reinstate/",
          referral_id: referralId,
        },
        successMessage: "Referral reward reinstated successfully!",
      } as any,
    );
    return response.data;
  },

  /**
   * Mark As Fraud
   * PUT accounts/referrals/fraud/?referral_id={id}
   */
  markAsFraud: async (
    referralId: string | number,
    reason?: string,
  ): Promise<any> => {
    const response = await publicApi.put(
      "",
      { is_fraud: true, reason: reason || "Fraudulent activity detected" },
      {
        params: {
          path: "accounts/referrals/fraud/",
          referral_id: referralId,
        },
        successMessage: "Referral marked as fraud successfully!",
      } as any,
    );
    return response.data;
  },
};
