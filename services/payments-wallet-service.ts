import { publicApi } from "@/lib/api-client";

/**
 * Payments & Wallet Service (API & Types Layer)
 *
 * Manages platform currency, accepted payment methods, refund policies, and change audit history.
 */

/* ─── TypeScript Interfaces ─── */

export interface CurrencyConfig {
  defaultCurrency: string;
}

export interface PaymentMethodsConfig {
  wallet: boolean;
  card: boolean;
  bankTransfers: boolean;
  cash: boolean;
}

export interface RefundPolicyConfig {
  autoRefundWindow: string;
  refundTypes: string;
}

export interface PaymentsWalletConfig {
  currency: CurrencyConfig;
  paymentMethods: PaymentMethodsConfig;
  refundPolicy: RefundPolicyConfig;
}

export interface PaymentsWalletHistoryItem {
  id: string | number;
  category: string;
  setting: string;
  previous_value: string;
  new_value: string;
  updated_by: string;
  created_at?: string;
  updated_at?: string;
}

/* ─── Defaults ─── */

export const DEFAULT_PAYMENTS_WALLET_CONFIG: PaymentsWalletConfig = {
  currency: {
    defaultCurrency: "USD",
  },
  paymentMethods: {
    wallet: true,
    card: true,
    bankTransfers: false,
    cash: false,
  },
  refundPolicy: {
    autoRefundWindow: "1 Hour",
    refundTypes: "Partial",
  },
};

/* ─── Mock History Data (Matching Figma Screenshot) ─── */

export const MOCK_PAYMENTS_WALLET_HISTORY: PaymentsWalletHistoryItem[] = [
  {
    id: "1",
    category: "Currency",
    setting: "Default Currency",
    previous_value: "USD",
    new_value: "CNY",
    updated_by: "Sarah Johnson",
    created_at: "2026-07-28T10:45:00Z",
  },
  {
    id: "2",
    category: "Payment Methods",
    setting: "Payment Methods",
    previous_value: "Wallet",
    new_value: "Wallet, Cards",
    updated_by: "Sarah Johnson",
    created_at: "2026-07-28T10:45:00Z",
  },
  {
    id: "3",
    category: "Refund Policy",
    setting: "Auto Refund Window",
    previous_value: "1 Hour",
    new_value: "2 Hours",
    updated_by: "Sarah Johnson",
    created_at: "2026-07-28T10:45:00Z",
  },
  {
    id: "4",
    category: "Refund Policy",
    setting: "Refund Types",
    previous_value: "Partial",
    new_value: "Full",
    updated_by: "Sarah Johnson",
    created_at: "2026-07-28T10:45:00Z",
  },
];

/* ─── Option Constants ─── */

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "NGN", label: "NGN - Nigerian Naira" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
];

export const REFUND_WINDOW_OPTIONS = [
  { value: "1 Hour", label: "1 Hour" },
  { value: "2 Hours", label: "2 Hours" },
  { value: "6 Hours", label: "6 Hours" },
  { value: "12 Hours", label: "12 Hours" },
  { value: "24 Hours", label: "24 Hours" },
  { value: "48 Hours", label: "48 Hours" },
];

export const REFUND_TYPE_OPTIONS = [
  { value: "Partial", label: "Partial" },
  { value: "Full", label: "Full" },
  { value: "Partial & Full", label: "Partial & Full" },
];

/* ─── Helper Functions ─── */

function parseHoursString(val: string): string {
  const cleaned = (val || "").replace(/\D/g, "");
  return cleaned || "1";
}

function normalizeRefundType(val: string): string {
  const lower = (val || "").toLowerCase().trim();
  if (lower.includes("full") && lower.includes("partial")) return "partial_and_full";
  if (lower.includes("full")) return "full";
  if (lower.includes("partial")) return "partial";
  return "partial";
}

function formatRefundTypeForUI(val: string): string {
  const lower = (val || "").toLowerCase().trim();
  if (lower === "partial_and_full" || (lower.includes("full") && lower.includes("partial"))) {
    return "Partial & Full";
  }
  if (lower === "full") return "Full";
  if (lower === "partial") return "Partial";
  return "Partial";
}

/* ─── Service ─── */

let localConfig: PaymentsWalletConfig = { ...DEFAULT_PAYMENTS_WALLET_CONFIG };
let localHistory: PaymentsWalletHistoryItem[] = [...MOCK_PAYMENTS_WALLET_HISTORY];

export const paymentsWalletService = {
  /**
   * Fetch current Payments & Wallet configuration
   */
  async getConfig(): Promise<PaymentsWalletConfig> {
    try {
      // 1. Fetch Currency
      try {
        const currencyRes = await publicApi.get("", {
          params: { path: "administration/payments-wallet/currency/" },
          skipToast: true,
        } as any);
        if (currencyRes.data) {
          const curr = currencyRes.data.default_currency || currencyRes.data.currency;
          if (curr) localConfig.currency.defaultCurrency = curr;
        }
      } catch (e) {
        // Fallback to local default
      }

      // 2. Fetch Payment Methods
      try {
        const pmRes = await publicApi.get("", {
          params: { path: "administration/payments-wallet/payment-methods/" },
          skipToast: true,
        } as any);
        if (pmRes.data) {
          const methods: string[] = Array.isArray(pmRes.data.payment_methods)
            ? pmRes.data.payment_methods
            : Array.isArray(pmRes.data)
            ? pmRes.data
            : [];
          if (methods.length > 0) {
            const lowerMethods = methods.map((m) => String(m).toLowerCase());
            localConfig.paymentMethods = {
              wallet: lowerMethods.some((m) => m.includes("wallet")),
              card: lowerMethods.some((m) => m.includes("card")),
              bankTransfers: lowerMethods.some((m) => m.includes("bank")),
              cash: lowerMethods.some((m) => m.includes("cash")),
            };
          }
        }
      } catch (e) {
        // Fallback to local default
      }

      // 3. Fetch Refund Policy
      try {
        const refundRes = await publicApi.get("", {
          params: { path: "administration/payments/refund-policy/" },
          skipToast: true,
        } as any);
        if (refundRes.data) {
          const hours = refundRes.data.auto_refund_window_hours != null
            ? String(refundRes.data.auto_refund_window_hours)
            : null;
          const rType = refundRes.data.refund_type;
          if (hours) {
            localConfig.refundPolicy.autoRefundWindow = `${hours} ${Number(hours) === 1 ? "Hour" : "Hours"}`;
          }
          if (rType) {
            localConfig.refundPolicy.refundTypes = formatRefundTypeForUI(rType);
          }
        }
      } catch (e) {
        // Fallback to local default
      }
    } catch (err) {
      console.warn("Error fetching payments & wallet config:", err);
    }

    return { ...localConfig };
  },

  /**
   * Update Default Payment Currency
   * PATCH {{base_url}}administration/payments-wallet/currency/
   */
  async updateCurrency(data: CurrencyConfig): Promise<any> {
    const payload = {
      default_currency: data.defaultCurrency,
    };

    const response = await publicApi.patch("", payload, {
      params: { path: "administration/payments-wallet/currency/" },
      successMessage: "Default payment currency updated successfully",
    } as any);

    const prev = localConfig.currency.defaultCurrency;
    localConfig.currency = { ...data };

    localHistory.unshift({
      id: `pw-${Date.now()}`,
      category: "Currency",
      setting: "Default Currency",
      previous_value: prev,
      new_value: data.defaultCurrency,
      updated_by: "Admin",
      created_at: new Date().toISOString(),
    });

    return response.data;
  },

  /**
   * Update Payment Methods
   * PATCH {{base_url}}administration/payments-wallet/payment-methods/
   */
  async updatePaymentMethods(data: PaymentMethodsConfig): Promise<any> {
    const methodsArray: string[] = [];
    if (data.wallet) methodsArray.push("wallet");
    if (data.card) methodsArray.push("card");
    if (data.bankTransfers) methodsArray.push("bank_transfer");
    if (data.cash) methodsArray.push("cash");

    const payload = {
      payment_methods: methodsArray,
    };

    const response = await publicApi.patch("", payload, {
      params: { path: "administration/payments-wallet/payment-methods/" },
      successMessage: "Payment methods updated successfully",
    } as any);

    const prevActive: string[] = [];
    if (localConfig.paymentMethods.wallet) prevActive.push("Wallet");
    if (localConfig.paymentMethods.card) prevActive.push("Card");
    if (localConfig.paymentMethods.bankTransfers) prevActive.push("Bank Transfers");
    if (localConfig.paymentMethods.cash) prevActive.push("Cash");

    localConfig.paymentMethods = { ...data };

    const newActive: string[] = [];
    if (data.wallet) newActive.push("Wallet");
    if (data.card) newActive.push("Card");
    if (data.bankTransfers) newActive.push("Bank Transfers");
    if (data.cash) newActive.push("Cash");

    localHistory.unshift({
      id: `pw-${Date.now()}`,
      category: "Payment Methods",
      setting: "Payment Methods",
      previous_value: prevActive.join(", ") || "None",
      new_value: newActive.join(", ") || "None",
      updated_by: "Admin",
      created_at: new Date().toISOString(),
    });

    return response.data;
  },

  /**
   * Update Refund Policy
   * PATCH {{base_url}}administration/payments/refund-policy/
   */
  async updateRefundPolicy(data: RefundPolicyConfig): Promise<any> {
    const payload = {
      auto_refund_window_hours: parseHoursString(data.autoRefundWindow),
      refund_type: normalizeRefundType(data.refundTypes),
    };

    const response = await publicApi.patch("", payload, {
      params: { path: "administration/payments/refund-policy/" },
      successMessage: "Refund policy updated successfully",
    } as any);

    const prevWindow = localConfig.refundPolicy.autoRefundWindow;
    const prevType = localConfig.refundPolicy.refundTypes;

    localConfig.refundPolicy = { ...data };

    if (prevWindow !== data.autoRefundWindow) {
      localHistory.unshift({
        id: `pw-${Date.now()}-1`,
        category: "Refund Policy",
        setting: "Auto Refund Window",
        previous_value: prevWindow,
        new_value: data.autoRefundWindow,
        updated_by: "Admin",
        created_at: new Date().toISOString(),
      });
    }

    if (prevType !== data.refundTypes) {
      localHistory.unshift({
        id: `pw-${Date.now()}-2`,
        category: "Refund Policy",
        setting: "Refund Types",
        previous_value: prevType,
        new_value: data.refundTypes,
        updated_by: "Admin",
        created_at: new Date().toISOString(),
      });
    }

    return response.data;
  },

  /**
   * Fetch Payments & Wallet change log / audit history
   * GET {{base_url}}administration/settings/change-log/
   */
  async getHistory(): Promise<PaymentsWalletHistoryItem[]> {
    try {
      const response = await publicApi.get("", {
        params: { path: "administration/settings/change-log/" },
        skipToast: true,
      } as any);

      const data = response.data;
      let list: PaymentsWalletHistoryItem[] = [];

      if (data && Array.isArray(data.results)) {
        list = data.results;
      } else if (Array.isArray(data)) {
        list = data;
      }

      if (list.length > 0) {
        // Filter relevant categories for payments & wallet
        const paymentsLogs = list.filter((item) => {
          if (!item.category) return true;
          const cat = item.category.toLowerCase();
          return (
            cat.includes("payment") ||
            cat.includes("wallet") ||
            cat.includes("currency") ||
            cat.includes("refund")
          );
        });
        if (paymentsLogs.length > 0) return paymentsLogs;
      }
    } catch (err) {
      console.warn("Could not fetch change-log for payments & wallet, using fallback:", err);
    }
    return [...localHistory];
  },
};
