import { publicApi } from "@/lib/api-client";

/**
 * Support & SLA's Service (API & Types Layer)
 *
 * Manages ticket categories, priority SLA matrix, auto-escalation rules, and change audit history.
 */

/* ─── TypeScript Interfaces ─── */

export interface PriorityLevelItem {
  responseSla: string;
  resolutionSla: string;
}

export interface PriorityLevelsConfig {
  critical: PriorityLevelItem;
  high: PriorityLevelItem;
  medium: PriorityLevelItem;
  low: PriorityLevelItem;
}

export interface AutoEscalationConfig {
  autoEscalation: boolean;
  timelapse: string;
}

export interface SupportSlasConfig {
  categories: string[];
  priorityLevels: PriorityLevelsConfig;
  autoEscalation: AutoEscalationConfig;
}

export interface SupportSlasHistoryItem {
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

export const DEFAULT_SUPPORT_SLAS_CONFIG: SupportSlasConfig = {
  categories: ["Billing Issue"],
  priorityLevels: {
    critical: { responseSla: "15mins", resolutionSla: "15mins" },
    high: { responseSla: "15mins", resolutionSla: "15mins" },
    medium: { responseSla: "15mins", resolutionSla: "15mins" },
    low: { responseSla: "15mins", resolutionSla: "15mins" },
  },
  autoEscalation: {
    autoEscalation: false,
    timelapse: "2 hours",
  },
};

/* ─── Mock History Data (Matching Screenshot) ─── */

export const MOCK_SUPPORT_SLAS_HISTORY: SupportSlasHistoryItem[] = [
  {
    id: "1",
    category: "Ticket Categories",
    setting: "Categories",
    previous_value: "Billing Issue",
    new_value: "Billing Issue",
    updated_by: "Sarah Johnson",
    created_at: "2026-07-28T10:45:00Z",
  },
  {
    id: "2",
    category: "Priority Levels",
    setting: "Critical",
    previous_value: "15min",
    new_value: "18mins",
    updated_by: "Sarah Johnson",
    created_at: "2026-07-28T10:45:00Z",
  },
  {
    id: "3",
    category: "Auto-Escalation Rules",
    setting: "Auto Refund Window",
    previous_value: "1 Hour",
    new_value: "2 Hours",
    updated_by: "Sarah Johnson",
    created_at: "2026-07-28T10:45:00Z",
  },
  {
    id: "4",
    category: "Auto-Escalation Rules",
    setting: "Refund Types",
    previous_value: "Partial",
    new_value: "Full",
    updated_by: "Sarah Johnson",
    created_at: "2026-07-28T10:45:00Z",
  },
];

/* ─── Options Constants ─── */

export const SLA_TIME_OPTIONS = [
  { value: "5mins", label: "5mins" },
  { value: "15mins", label: "15mins" },
  { value: "30mins", label: "30mins" },
  { value: "1 hour", label: "1 hour" },
  { value: "2 hours", label: "2 hours" },
  { value: "4 hours", label: "4 hours" },
  { value: "12 hours", label: "12 hours" },
  { value: "24 hours", label: "24 hours" },
  { value: "48 hours", label: "48 hours" },
];

export const TIMELAPSE_OPTIONS = [
  { value: "30 mins", label: "30 mins" },
  { value: "1 hour", label: "1 hour" },
  { value: "2 hours", label: "2 hours" },
  { value: "4 hours", label: "4 hours" },
  { value: "12 hours", label: "12 hours" },
  { value: "24 hours", label: "24 hours" },
  { value: "48 hours", label: "48 hours" },
];

/* ─── Helper Functions ─── */

function slaOptionToMinutes(val: string): string {
  const lower = (val || "").toLowerCase().trim();
  if (lower.includes("hour")) {
    const hours = parseInt(lower.replace(/\D/g, ""), 10) || 1;
    return String(hours * 60);
  }
  const mins = parseInt(lower.replace(/\D/g, ""), 10) || 15;
  return String(mins);
}

function minutesToSlaOption(val: string | number): string {
  const num = typeof val === "number" ? val : parseInt(String(val).replace(/\D/g, ""), 10);
  if (isNaN(num)) return "15mins";
  if (num < 60) return `${num}mins`;
  const hours = Math.round(num / 60);
  return `${hours} ${hours === 1 ? "hour" : "hours"}`;
}

function timelapseOptionToMinutes(val: string): string {
  const lower = (val || "").toLowerCase().trim();
  if (lower.includes("hour")) {
    const hours = parseInt(lower.replace(/\D/g, ""), 10) || 1;
    return String(hours * 60);
  }
  const mins = parseInt(lower.replace(/\D/g, ""), 10) || 30;
  return String(mins);
}

function minutesToTimelapseOption(val: string | number): string {
  const num = typeof val === "number" ? val : parseInt(String(val).replace(/\D/g, ""), 10);
  if (isNaN(num)) return "2 hours";
  if (num < 60) return `${num} mins`;
  const hours = Math.round(num / 60);
  return `${hours} ${hours === 1 ? "hour" : "hours"}`;
}

/* ─── Service ─── */

let localConfig: SupportSlasConfig = { ...DEFAULT_SUPPORT_SLAS_CONFIG };
let localHistory: SupportSlasHistoryItem[] = [...MOCK_SUPPORT_SLAS_HISTORY];

export const supportSlasService = {
  /**
   * Fetch current Support & SLA's configuration
   */
  async getConfig(): Promise<SupportSlasConfig> {
    try {
      // 1. Fetch Categories
      try {
        const catRes = await publicApi.get("", {
          params: { path: "administration/support-sla/ticket-categories/" },
          skipToast: true,
        } as any);
        if (catRes.data) {
          const cats = Array.isArray(catRes.data.ticket_categories)
            ? catRes.data.ticket_categories
            : Array.isArray(catRes.data)
            ? catRes.data
            : [];
          if (cats.length > 0) {
            localConfig.categories = cats;
          }
        }
      } catch (e) {
        // Fallback to local default
      }

      // 2. Fetch Priority Levels
      try {
        const plRes = await publicApi.get("", {
          params: { path: "administration/support-sla/priority-levels/" },
          skipToast: true,
        } as any);
        if (plRes.data) {
          const d = plRes.data;
          if (d.critical_response_sla_minutes != null) {
            localConfig.priorityLevels.critical.responseSla = minutesToSlaOption(d.critical_response_sla_minutes);
          }
          if (d.critical_resolution_sla_minutes != null) {
            localConfig.priorityLevels.critical.resolutionSla = minutesToSlaOption(d.critical_resolution_sla_minutes);
          }
          if (d.high_response_sla_minutes != null) {
            localConfig.priorityLevels.high.responseSla = minutesToSlaOption(d.high_response_sla_minutes);
          }
          if (d.high_resolution_sla_minutes != null) {
            localConfig.priorityLevels.high.resolutionSla = minutesToSlaOption(d.high_resolution_sla_minutes);
          }
          if (d.medium_response_sla_minutes != null) {
            localConfig.priorityLevels.medium.responseSla = minutesToSlaOption(d.medium_response_sla_minutes);
          }
          if (d.medium_resolution_sla_minutes != null) {
            localConfig.priorityLevels.medium.resolutionSla = minutesToSlaOption(d.medium_resolution_sla_minutes);
          }
          if (d.low_response_sla_minutes != null) {
            localConfig.priorityLevels.low.responseSla = minutesToSlaOption(d.low_response_sla_minutes);
          }
          if (d.low_resolution_sla_minutes != null) {
            localConfig.priorityLevels.low.resolutionSla = minutesToSlaOption(d.low_resolution_sla_minutes);
          }
        }
      } catch (e) {
        // Fallback to local default
      }

      // 3. Fetch Auto Escalation
      try {
        const escRes = await publicApi.get("", {
          params: { path: "administration/support-sla/auto-escalation/" },
          skipToast: true,
        } as any);
        if (escRes.data) {
          const d = escRes.data;
          if (d.auto_escalation_enabled != null) {
            localConfig.autoEscalation.autoEscalation = Boolean(d.auto_escalation_enabled);
          }
          if (d.escalation_timelapse_minutes != null) {
            localConfig.autoEscalation.timelapse = minutesToTimelapseOption(d.escalation_timelapse_minutes);
          }
        }
      } catch (e) {
        // Fallback to local default
      }
    } catch (err) {
      console.warn("Could not fetch Support & SLA config:", err);
    }
    return { ...localConfig };
  },

  /**
   * Update Ticket Categories
   * PATCH {{base_url}}administration/support-sla/ticket-categories/
   */
  async updateCategories(categories: string[]): Promise<any> {
    const payload = {
      ticket_categories: categories,
    };

    const response = await publicApi.patch("", payload, {
      params: { path: "administration/support-sla/ticket-categories/" },
      successMessage: "Ticket categories updated successfully",
    } as any);

    const prev = localConfig.categories.join(", ");
    localConfig.categories = [...categories];

    localHistory.unshift({
      id: `sla-${Date.now()}`,
      category: "Ticket Categories",
      setting: "Categories",
      previous_value: prev || "None",
      new_value: categories.join(", ") || "None",
      updated_by: "Admin",
      created_at: new Date().toISOString(),
    });

    return response.data;
  },

  /**
   * Update Priority Levels
   * PATCH {{base_url}}administration/support-sla/priority-levels/
   */
  async updatePriorityLevels(levels: PriorityLevelsConfig): Promise<any> {
    const payload = {
      critical_response_sla_minutes: slaOptionToMinutes(levels.critical.responseSla),
      critical_resolution_sla_minutes: slaOptionToMinutes(levels.critical.resolutionSla),
      high_response_sla_minutes: slaOptionToMinutes(levels.high.responseSla),
      high_resolution_sla_minutes: slaOptionToMinutes(levels.high.resolutionSla),
      medium_response_sla_minutes: slaOptionToMinutes(levels.medium.responseSla),
      medium_resolution_sla_minutes: slaOptionToMinutes(levels.medium.resolutionSla),
      low_response_sla_minutes: slaOptionToMinutes(levels.low.responseSla),
      low_resolution_sla_minutes: slaOptionToMinutes(levels.low.resolutionSla),
    };

    const response = await publicApi.patch("", payload, {
      params: { path: "administration/support-sla/priority-levels/" },
      successMessage: "Priority levels updated successfully",
    } as any);

    localConfig.priorityLevels = { ...levels };

    localHistory.unshift({
      id: `sla-${Date.now()}`,
      category: "Priority Levels",
      setting: "Critical",
      previous_value: "15min",
      new_value: levels.critical.responseSla,
      updated_by: "Admin",
      created_at: new Date().toISOString(),
    });

    return response.data;
  },

  /**
   * Update Auto-Escalation Rules
   * PATCH {{base_url}}administration/support-sla/auto-escalation/
   */
  async updateAutoEscalation(rules: AutoEscalationConfig): Promise<any> {
    const payload = {
      auto_escalation_enabled: Boolean(rules.autoEscalation),
      escalation_timelapse_minutes: timelapseOptionToMinutes(rules.timelapse),
    };

    const response = await publicApi.patch("", payload, {
      params: { path: "administration/support-sla/auto-escalation/" },
      successMessage: "Auto escalation rules updated successfully",
    } as any);

    const prev = `${localConfig.autoEscalation.autoEscalation ? "Enabled" : "Disabled"}, ${localConfig.autoEscalation.timelapse}`;
    localConfig.autoEscalation = { ...rules };

    localHistory.unshift({
      id: `sla-${Date.now()}`,
      category: "Auto-Escalation Rules",
      setting: "Auto Escalation",
      previous_value: prev,
      new_value: `${rules.autoEscalation ? "Enabled" : "Disabled"}, ${rules.timelapse}`,
      updated_by: "Admin",
      created_at: new Date().toISOString(),
    });

    return response.data;
  },

  /**
   * Fetch Support & SLA's audit history / change log
   * GET {{base_url}}administration/settings/change-log/
   */
  async getHistory(): Promise<SupportSlasHistoryItem[]> {
    try {
      const response = await publicApi.get("", {
        params: { path: "administration/settings/change-log/" },
        skipToast: true,
      } as any);

      const data = response.data;
      let list: SupportSlasHistoryItem[] = [];

      if (data && Array.isArray(data.results)) {
        list = data.results;
      } else if (Array.isArray(data)) {
        list = data;
      }

      if (list.length > 0) {
        const slaLogs = list.filter((item) => {
          if (!item.category) return true;
          const cat = item.category.toLowerCase();
          return (
            cat.includes("support") ||
            cat.includes("sla") ||
            cat.includes("ticket") ||
            cat.includes("priority") ||
            cat.includes("escalat")
          );
        });
        if (slaLogs.length > 0) return slaLogs;
      }
    } catch (err) {
      console.warn("Could not fetch change-log for support slas, using fallback:", err);
    }
    return [...localHistory];
  },
};

