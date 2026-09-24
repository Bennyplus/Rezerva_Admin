import { publicApi } from "@/lib/api-client";

export interface BackendReferralItem {
  id?: string | number;
  referral_id: string;
  referrer: string;
  referred_user: string;
  reward?: string;
  status: "Successful" | "Failed" | string;
  fraud_flag?: "Yes" | "No" | boolean | string;
  referral_code?: string;
  referral_date?: string;
  date_joined?: string;
  reward_credited_on?: string;
  referrer_transaction_id?: string;
  referred_transaction_id?: string;
}

export interface ListReferralsResponse {
  count: number;
  results: BackendReferralItem[];
}

export interface AdminReferral {
  id: string | number;
  referralId: string;
  referrer: string;
  referredUser: string;
  referralCode?: string;
  referralDate?: string;
  reward: string;
  fraudFlag: "Yes" | "No";
  status: "Successful" | "Failed";
  rewardCreditedOn?: string;
  referrerTxId?: string;
  referredTxId?: string;
}

export function mapBackendReferral(
  item: BackendReferralItem,
  index: number,
): AdminReferral {
  const isFailed =
    item.status?.toLowerCase() === "failed" ||
    item.fraud_flag === true ||
    item.fraud_flag === "Yes";
  const fraudFlag =
    item.fraud_flag === true || item.fraud_flag === "Yes" ? "Yes" : "No";

  return {
    id: item.id ?? item.referral_id ?? `ref-${index + 1}`,
    referralId: item.referral_id || `RES-EP-${index + 1}`,
    referrer: item.referrer || "N/A",
    referredUser: item.referred_user || "N/A",
    referralCode: item.referral_code || item.referral_id || "ProsperEddy01",
    referralDate: item.referral_date || item.date_joined || "11 Jun 2026 11:12 PM",
    reward: item.reward || "£194.00",
    fraudFlag,
    status: isFailed ? "Failed" : "Successful",
    rewardCreditedOn: item.reward_credited_on || "30 March 2026",
    referrerTxId: item.referrer_transaction_id || "KP-123-2344",
    referredTxId: item.referred_transaction_id || "KP-123-2344",
  };
}

export const MOCK_ADMIN_REFERRALS: AdminReferral[] = [
  {
    id: "1",
    referralId: "RES-EP-60794",
    referrer: "Edward Prosper",
    referredUser: "Ambrose Egwonu",
    referralCode: "RES-EP-60794",
    referralDate: "11 Jun 2026 11:12 PM",
    reward: "10 Points",
    fraudFlag: "No",
    status: "Successful",
    rewardCreditedOn: "30 March 2026",
    referrerTxId: "KP-123-2344",
    referredTxId: "KP-123-2344",
  },
  {
    id: "2",
    referralId: "RXD-001-EAL1",
    referrer: "Arlene McCoy",
    referredUser: "Ralph Edwards",
    referralCode: "ProsperEddy01",
    referralDate: "11 Jun 2026 11:12 PM",
    reward: "£194.00",
    fraudFlag: "No",
    status: "Successful",
    rewardCreditedOn: "30 March 2026",
    referrerTxId: "KP-123-2344",
    referredTxId: "KP-123-2344",
  },
  {
    id: "3",
    referralId: "RXD-001-EAL1",
    referrer: "Wade Warren",
    referredUser: "Jerome Bell",
    referralCode: "WarrenWade02",
    referralDate: "12 Jun 2026 10:00 AM",
    reward: "£194.00",
    fraudFlag: "Yes",
    status: "Failed",
    rewardCreditedOn: "31 March 2026",
    referrerTxId: "KP-123-2345",
    referredTxId: "KP-123-2345",
  },
  {
    id: "4",
    referralId: "RXD-001-EAL1",
    referrer: "Esther Howard",
    referredUser: "Jenny Wilson",
    referralCode: "EstherHow03",
    referralDate: "15 Jun 2026 03:45 PM",
    reward: "£194.00",
    fraudFlag: "No",
    status: "Successful",
    rewardCreditedOn: "01 April 2026",
    referrerTxId: "KP-123-2346",
    referredTxId: "KP-123-2346",
  },
  {
    id: "5",
    referralId: "RXD-001-EAL1",
    referrer: "Courtney Henry",
    referredUser: "Eleanor Pena",
    referralCode: "CourtneyH04",
    referralDate: "18 Jun 2026 08:20 PM",
    reward: "£194.00",
    fraudFlag: "Yes",
    status: "Failed",
    rewardCreditedOn: "02 April 2026",
    referrerTxId: "KP-123-2347",
    referredTxId: "KP-123-2347",
  },
];

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
   * List Referrals
   * GET administration/referrals/
   */
  getReferrals: async (
    params?: Record<string, any>,
  ): Promise<{ count: number; results: AdminReferral[] }> => {
    const response = await publicApi.get("", {
      params: { path: "administration/referrals/", ...params },
    });
    const rawData = response.data;
    const rawList: BackendReferralItem[] = Array.isArray(rawData?.results)
      ? rawData.results
      : Array.isArray(rawData)
      ? rawData
      : [];
    const count =
      typeof rawData?.count === "number" ? rawData.count : rawList.length;

    return {
      count,
      results: rawList.map((item, index) => mapBackendReferral(item, index)),
    };
  },

  /**
   * Referral(s) Dashboard (Legacy)
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
