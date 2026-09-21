import { publicApi } from "@/lib/api-client";

/* ─── TypeScript Interfaces ─── */

export type PromotionStatus = "active" | "inactive" | "draft";

export interface EligibilityGroupChoice {
  value: string;
  label: string;
}

export interface EligibilityGroupsResponse {
  choices: EligibilityGroupChoice[];
}

export interface PromotionTypeChoice {
  value: string;
  label: string;
}

export interface PromotionItem {
  id: string | number;
  name: string;
  promotion_type?: string;
  type_display?: string;
  type: string; // for UI table display
  coupon_code?: string;
  code?: string;
  start_date?: string;
  end_date?: string;
  validUntil: string; // for UI table display
  usage_limit?: number | string | null;
  eligibility?: string[];
  percent_discount?: string;
  discountValue?: string;
  redemptions: number;
  revenue_impact?: string | number;
  status: PromotionStatus;
  created_by?: number | string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
}

export interface PromotionsStats {
  activePromotions: number;
  totalRedemptions: number;
  revenueImpact: number | string;
  newUsersFromReferrals: number;
}

export interface PromotionsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PromotionItem[];
  stats?: PromotionsStats;
}

export interface CreatePromotionPayload {
  name: string;
  promotion_type?: string;
  type?: string;
  status?: PromotionStatus;
  start_date?: string;
  end_date?: string;
  startDate?: string;
  endDate?: string;
  validUntil?: string;
  usage_limit?: number | string | null;
  usageLimit?: string;
  eligibility?: string[];
  percent_discount?: string;
  discountValue?: string;
  coupon_code?: string;
  code?: string;
}

/* ─── Defaults & Choices ─── */

export const DEFAULT_ELIGIBILITY_CHOICES: EligibilityGroupChoice[] = [];

export const DEFAULT_PROMOTION_TYPE_CHOICES: PromotionTypeChoice[] = [];

export const MOCK_PROMOTIONS: PromotionItem[] = [
  {
    id: "1",
    name: "Welcome50",
    code: "WELCOME50",
    coupon_code: "WELCOME50",
    type: "Coupon Code",
    type_display: "Coupon Code",
    promotion_type: "coupon",
    validUntil: "31 Aug 2026",
    end_date: "2026-08-31",
    redemptions: 922,
    status: "inactive",
    discountValue: "50%",
    percent_discount: "50%",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "2",
    name: "ValentinesDay",
    code: "VALENTINE",
    coupon_code: "VALENTINE",
    type: "Referral Campaign",
    type_display: "Referral Campaign",
    promotion_type: "referral_campaign",
    validUntil: "27 Jul 2027",
    end_date: "2027-07-27",
    redemptions: 177,
    status: "active",
    discountValue: "₦5,000",
    percent_discount: "₦5,000",
    createdAt: "2026-02-14T08:30:00Z",
  },
  {
    id: "3",
    name: "April Fools10",
    code: "APRILFOOLS",
    coupon_code: "APRILFOOLS",
    type: "Ride Discount",
    type_display: "Ride Discount",
    promotion_type: "ride_discount",
    validUntil: "1 Feb 2021",
    end_date: "2021-02-01",
    redemptions: 877,
    status: "draft",
    discountValue: "10%",
    percent_discount: "10%",
    createdAt: "2026-04-01T12:00:00Z",
  },
  {
    id: "4",
    name: "HappyHannukkah",
    code: "HANUKKAH",
    coupon_code: "HANUKKAH",
    type: "Seasonal Promotion",
    type_display: "Seasonal Promotion",
    promotion_type: "seasonal",
    validUntil: "3 Jun 2028",
    end_date: "2028-06-03",
    redemptions: 600,
    status: "active",
    discountValue: "25%",
    percent_discount: "25%",
    createdAt: "2026-06-03T15:45:00Z",
  },
];

export const MOCK_PROMOTIONS_STATS: PromotionsStats = {
  activePromotions: 0,
  totalRedemptions: 0,
  revenueImpact: "0.00",
  newUsersFromReferrals: 0,
};

/* ─── Helpers ─── */

export function formatTypeDisplay(slug: string): string {
  if (!slug) return "Coupon Code";
  const lower = slug.toLowerCase().trim();
  if (lower === "coupon" || lower === "coupon_code") return "Coupon Code";
  if (lower === "ride_discount" || lower === "discount") return "Ride Discount";
  if (lower === "referral" || lower === "referral_campaign") return "Referral Campaign";
  if (lower === "seasonal" || lower === "seasonal_promotion") return "Seasonal Promotion";
  return slug
    .split(/[_\-\s]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function typeDisplayToSlug(type: string): string {
  if (!type) return "coupon";
  const lower = type.toLowerCase().trim();
  if (lower.includes("coupon")) return "coupon";
  if (lower.includes("ride") || lower.includes("discount")) return "ride_discount";
  if (lower.includes("referral")) return "referral_campaign";
  if (lower.includes("seasonal")) return "seasonal";
  return lower.replace(/\s+/g, "_");
}

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  } catch {
    // fallback
  }
  return dateStr;
}

export function normalizePromotionItem(raw: any): PromotionItem {
  const typeDisplay =
    raw.type_display ||
    raw.type ||
    (raw.promotion_type ? formatTypeDisplay(raw.promotion_type) : "Coupon Code");

  const validUntil =
    raw.validUntil ||
    (raw.end_date ? formatDateDisplay(raw.end_date) : "N/A");

  return {
    id: raw.id,
    name: raw.name || "",
    promotion_type: raw.promotion_type,
    type_display: typeDisplay,
    type: typeDisplay,
    coupon_code: raw.coupon_code || raw.code,
    code: raw.coupon_code || raw.code,
    start_date: raw.start_date || raw.startDate,
    end_date: raw.end_date || raw.endDate,
    validUntil: validUntil,
    usage_limit: raw.usage_limit ?? raw.usageLimit,
    eligibility: Array.isArray(raw.eligibility) ? raw.eligibility : [],
    percent_discount: raw.percent_discount || raw.discountValue,
    discountValue: raw.percent_discount || raw.discountValue,
    redemptions: typeof raw.redemptions === "number" ? raw.redemptions : 0,
    revenue_impact: raw.revenue_impact ?? "0.00",
    status: (raw.status || "draft").toLowerCase() as PromotionStatus,
    created_by: raw.created_by,
    created_at: raw.created_at || raw.createdAt,
    updated_at: raw.updated_at,
  };
}

/* ─── Service ─── */

let localPromotions: PromotionItem[] = [...MOCK_PROMOTIONS];

export const promotionsService = {
  /**
   * List Promotion Eligibility Groups
   * GET {{base_url}}administration/eligibility-groups/
   */
  async getEligibilityGroups(): Promise<EligibilityGroupChoice[]> {
    try {
      const response = await publicApi.get("", {
        params: { path: "administration/eligibility-groups/" },
        skipToast: true,
      } as any);

      if (response.data?.choices && Array.isArray(response.data.choices)) {
        return response.data.choices;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
    } catch (err) {
      console.warn("Failed to fetch eligibility groups from BE:", err);
    }
    return [];
  },

  /**
   * List Promotion Types
   * GET {{base_url}}administration/promotion-types/
   */
  async getPromotionTypes(): Promise<PromotionTypeChoice[]> {
    try {
      const response = await publicApi.get("", {
        params: { path: "administration/promotion-types/" },
        skipToast: true,
      } as any);

      if (response.data?.choices && Array.isArray(response.data.choices)) {
        return response.data.choices;
      }
      if (Array.isArray(response.data)) {
        return response.data.map((item: any) =>
          typeof item === "string"
            ? { value: typeDisplayToSlug(item), label: item }
            : { value: item.value || typeDisplayToSlug(item.label), label: item.label || item.name || item.value }
        );
      }
    } catch (err) {
      console.warn("Failed to fetch promotion types from BE:", err);
    }
    return [];
  },

  /**
   * List Promotions
   * GET {{base_url}}administration/promotions/
   */
  async getPromotions(
    page: number = 1,
    search: string = "",
    statusFilter: string = "all"
  ): Promise<PromotionsListResponse> {
    try {
      const response = await publicApi.get("", {
        params: {
          path: "administration/promotions/",
          page,
          ...(search && { search }),
          ...(statusFilter !== "all" && { status: statusFilter }),
        },
        skipToast: true,
      } as any);

      const data = response.data;
      if (data && Array.isArray(data.results)) {
        return {
          count: data.count ?? data.results.length,
          next: data.next ?? null,
          previous: data.previous ?? null,
          results: data.results.map(normalizePromotionItem),
        };
      }
      if (Array.isArray(data)) {
        const normalized = data.map(normalizePromotionItem);
        return {
          count: normalized.length,
          next: null,
          previous: null,
          results: normalized,
        };
      }
    } catch (err) {
      // Fallback to local filtering
    }

    let filtered = [...localPromotions];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          (p.code && p.code.toLowerCase().includes(q))
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    return {
      count: filtered.length,
      next: null,
      previous: null,
      results: filtered,
    };
  },

  /**
   * Retrieve Promotion
   * GET {{base_url}}administration/promotions/?promotion_id=<id>
   */
  async getPromotion(promotionId: string | number): Promise<PromotionItem> {
    try {
      const response = await publicApi.get("", {
        params: {
          path: "administration/promotions/",
          promotion_id: promotionId,
        },
        skipToast: true,
      } as any);

      if (response.data) {
        return normalizePromotionItem(response.data);
      }
    } catch (err) {
      console.warn(`Failed to fetch promotion ${promotionId}:`, err);
    }

    const found = localPromotions.find((p) => String(p.id) === String(promotionId));
    if (found) return found;
    throw new Error("Promotion not found");
  },

  /**
   * Create Promotion
   * POST {{base_url}}administration/promotions/
   */
  async createPromotion(payload: CreatePromotionPayload): Promise<PromotionItem> {
    const rawUsage = payload.usage_limit ?? payload.usageLimit;
    const usageNumber =
      typeof rawUsage === "number"
        ? rawUsage
        : typeof rawUsage === "string" && !rawUsage.toLowerCase().includes("unlimited")
        ? parseInt(rawUsage.replace(/\D/g, ""), 10) || null
        : null;

    const bePayload = {
      name: payload.name,
      promotion_type:
        payload.promotion_type ||
        typeDisplayToSlug(payload.type || "Coupon Code"),
      status: payload.status || "active",
      ...(payload.start_date || payload.startDate
        ? { start_date: payload.start_date || payload.startDate }
        : {}),
      ...(payload.end_date || payload.endDate
        ? { end_date: payload.end_date || payload.endDate }
        : {}),
      ...(usageNumber !== null ? { usage_limit: usageNumber } : {}),
      eligibility: payload.eligibility || [],
      ...(payload.percent_discount || payload.discountValue
        ? { percent_discount: payload.percent_discount || payload.discountValue }
        : {}),
      ...(payload.coupon_code || payload.code
        ? { coupon_code: payload.coupon_code || payload.code }
        : {}),
    };

    try {
      const response = await publicApi.post("", bePayload, {
        params: { path: "administration/promotions/" },
        successMessage: "Promotion created successfully",
      } as any);

      if (response.data) {
        const item = normalizePromotionItem(response.data);
        localPromotions.unshift(item);
        return item;
      }
    } catch (err) {
      // Local fallback
    }

    const newPromo = normalizePromotionItem({
      id: `promo-${Date.now()}`,
      ...bePayload,
      type_display: payload.type || formatTypeDisplay(bePayload.promotion_type),
      redemptions: 0,
      revenue_impact: "0.00",
      created_at: new Date().toISOString(),
    });

    localPromotions.unshift(newPromo);
    return newPromo;
  },

  /**
   * Update Promotion
   * PUT {{base_url}}administration/promotions/?promotion_id=<id>
   */
  async updatePromotion(
    id: string | number,
    payload: Partial<CreatePromotionPayload>
  ): Promise<PromotionItem> {
    const rawUsage = payload.usage_limit ?? payload.usageLimit;
    const usageNumber =
      typeof rawUsage === "number"
        ? rawUsage
        : typeof rawUsage === "string" && !rawUsage.toLowerCase().includes("unlimited")
        ? parseInt(rawUsage.replace(/\D/g, ""), 10) || null
        : undefined;

    const bePayload: any = {
      ...(payload.name ? { name: payload.name } : {}),
      ...(payload.promotion_type || payload.type
        ? { promotion_type: payload.promotion_type || typeDisplayToSlug(payload.type!) }
        : {}),
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.start_date || payload.startDate
        ? { start_date: payload.start_date || payload.startDate }
        : {}),
      ...(payload.end_date || payload.endDate
        ? { end_date: payload.end_date || payload.endDate }
        : {}),
      ...(usageNumber !== undefined ? { usage_limit: usageNumber } : {}),
      ...(payload.eligibility ? { eligibility: payload.eligibility } : {}),
      ...(payload.percent_discount || payload.discountValue
        ? { percent_discount: payload.percent_discount || payload.discountValue }
        : {}),
      ...(payload.coupon_code || payload.code
        ? { coupon_code: payload.coupon_code || payload.code }
        : {}),
    };

    try {
      const response = await publicApi.put("", bePayload, {
        params: { path: "administration/promotions/", promotion_id: id },
        successMessage: "Promotion updated successfully",
      } as any);

      if (response.data) {
        const item = normalizePromotionItem(response.data);
        const idx = localPromotions.findIndex((p) => String(p.id) === String(id));
        if (idx !== -1) localPromotions[idx] = item;
        return item;
      }
    } catch (err) {
      // Local fallback
    }

    const idx = localPromotions.findIndex((p) => String(p.id) === String(id));
    if (idx !== -1) {
      localPromotions[idx] = normalizePromotionItem({
        ...localPromotions[idx],
        ...bePayload,
        updated_at: new Date().toISOString(),
      });
      return localPromotions[idx];
    }

    throw new Error("Promotion not found");
  },

  /**
   * Toggle promotion active / inactive status
   * PUT {{base_url}}administration/promotions/?promotion_id=<id>
   */
  async toggleStatus(
    id: string | number,
    newStatus: PromotionStatus
  ): Promise<PromotionItem> {
    return this.updatePromotion(id, { status: newStatus });
  },

  /**
   * Delete Promotion
   * DELETE {{base_url}}administration/promotions/?promotion_id=<id>
   */
  async deletePromotion(id: string | number): Promise<boolean> {
    try {
      await publicApi.delete("", {
        params: { path: "administration/promotions/", promotion_id: id },
        successMessage: "Promotion deleted successfully",
      } as any);
    } catch (err) {
      // Local fallback
    }

    localPromotions = localPromotions.filter((p) => String(p.id) !== String(id));
    return true;
  },

  /**
   * Promotions Dashboard Stats
   * GET {{base_url}}administration/promotions/stats/
   */
  async getStats(): Promise<PromotionsStats> {
    try {
      const response = await publicApi.get("", {
        params: { path: "administration/promotions/stats/" },
        skipToast: true,
      } as any);

      if (response.data) {
        return {
          activePromotions:
            response.data.active_promotions ??
            response.data.activePromotions ??
            0,
          totalRedemptions:
            response.data.total_redemptions ??
            response.data.totalRedemptions ??
            0,
          revenueImpact:
            response.data.revenue_impact ??
            response.data.revenueImpact ??
            "0.00",
          newUsersFromReferrals:
            response.data.new_users_from_referrals ??
            response.data.newUsersFromReferrals ??
            0,
        };
      }
    } catch (err) {
      // Fallback to mock stats
    }

    return { ...MOCK_PROMOTIONS_STATS };
  },
};
