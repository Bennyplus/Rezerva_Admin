import { publicApi } from "@/lib/api-client";

/**
 * Driver Verification Service (API & Types Layer)
 *
 * Manages driver document verification configuration and audit change logs.
 */

/* ─── TypeScript Interfaces ─── */

export interface DriverVerificationConfig {
  required_driver_documents: string;
  document_reverification_interval: string;
}

export interface DriverVerificationBackendPayload {
  required_driver_documents: string[];
  document_reverification_interval_months: number;
}

export interface DriverVerificationBackendResponse {
  required_driver_documents: string[];
  document_reverification_interval_months: number;
  updated_at?: string;
  updated_by?: number | string;
}

export interface DriverVerificationHistoryItem {
  id: string | number;
  category: string;
  setting: string;
  previous_value: string;
  new_value: string;
  updated_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChangeLogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DriverVerificationHistoryItem[];
}

/* ─── Defaults ─── */

export const DEFAULT_DRIVER_VERIFICATION: DriverVerificationConfig = {
  required_driver_documents: "license",
  document_reverification_interval: "12",
};

/* ─── Document Options ─── */

export const DOCUMENT_OPTIONS = [
  { value: "license", label: "License" },
  { value: "insurance", label: "Insurance" },
  { value: "vehicle_registration", label: "Vehicle Registration" },
  { value: "selfie", label: "Selfie" },
  { value: "national_id", label: "National ID" },
  { value: "passport", label: "Passport" },
  { value: "proof_of_address", label: "Proof of Address" },
];

/* ─── Helper Functions ─── */

function parseIntervalMonths(val: string | number): number {
  if (typeof val === "number") return val;
  const cleaned = (val || "").replace(/\D/g, "");
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 12 : parsed;
}

function normalizeDocArray(val: string | string[]): string[] {
  if (Array.isArray(val)) return val;
  if (!val) return ["license"];
  return val.split(",").map((s) => s.trim()).filter(Boolean);
}

/* ─── Service ─── */

export const driverVerificationService = {
  /**
   * Fetch current driver verification configuration
   * GET {{base_url}}administration/driver-verification/settings/
   */
  async getConfig(): Promise<DriverVerificationConfig> {
    try {
      const response = await publicApi.get("", {
        params: { path: "administration/driver-verification/settings/" },
        skipToast: true,
      } as any);

      const data = response.data;
      if (data) {
        let docs = "license";
        if (Array.isArray(data.required_driver_documents) && data.required_driver_documents.length > 0) {
          docs = data.required_driver_documents[0];
        } else if (typeof data.required_driver_documents === "string") {
          docs = data.required_driver_documents;
        }

        const interval = data.document_reverification_interval_months != null
          ? String(data.document_reverification_interval_months)
          : "12";

        return {
          required_driver_documents: docs,
          document_reverification_interval: interval,
        };
      }
    } catch (err) {
      console.warn("Could not fetch driver verification config from backend, using defaults:", err);
    }
    return { ...DEFAULT_DRIVER_VERIFICATION };
  },

  /**
   * Update driver verification configuration
   * PATCH {{base_url}}administration/driver-verification/settings/
   */
  async updateConfig(
    data: Partial<DriverVerificationConfig>
  ): Promise<DriverVerificationBackendResponse> {
    const payload: DriverVerificationBackendPayload = {
      required_driver_documents: normalizeDocArray(data.required_driver_documents || "license"),
      document_reverification_interval_months: parseIntervalMonths(
        data.document_reverification_interval ?? "12"
      ),
    };

    const response = await publicApi.patch("", payload, {
      params: { path: "administration/driver-verification/settings/" },
      successMessage: "Driver verification settings updated successfully",
    } as any);

    return response.data;
  },

  /**
   * Fetch driver verification change log / audit history
   * GET {{base_url}}administration/settings/change-log/
   */
  async getHistory(): Promise<DriverVerificationHistoryItem[]> {
    try {
      const response = await publicApi.get("", {
        params: { path: "administration/settings/change-log/" },
        skipToast: true,
      } as any);

      const data = response.data;
      let list: DriverVerificationHistoryItem[] = [];

      if (data && Array.isArray(data.results)) {
        list = data.results;
      } else if (Array.isArray(data)) {
        list = data;
      }

      // Filter by Driver Verification if needed or return all results
      if (list.length > 0) {
        const driverLogs = list.filter(
          (item) => !item.category || item.category.toLowerCase().includes("driver")
        );
        return driverLogs.length > 0 ? driverLogs : list;
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch driver verification change log:", err);
      return [];
    }
  },
};
