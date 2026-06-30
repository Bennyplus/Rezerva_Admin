// ─── API shape ────────────────────────────────────────────────────────────────

export interface RefundPayment {
  id: string;
  reference: string;
  amount_received: string;
  status: string;
}

export interface RefundActor {
  id: string;
  full_name: string;
  email: string;
}

export interface Refund {
  id: string;
  reference: string;
  payment: RefundPayment;
  gateway_reference: string;
  amount: string;
  reason: string;
  reason_display: string;
  reason_note: string;
  status: string;
  status_display: string;
  initiated_by: RefundActor | null;
  reviewed_by: RefundActor | null;
  rejected_at: string | null;
  refunded_at: string | null;
  created_at: string;
}

// ─── Derived helpers ───────────────────────────────────────────────────────────

export type RefundStatus = "pending" | "processing" | "success" | "rejected" | "failed";

/** Map API `status` string → display label */
export function getStatusDisplay(status: string): string {
  const map: Record<string, string> = {
    pending: "Pending",
    processing: "Processing",
    success: "Completed",
    rejected: "Rejected",
    failed: "Failed",
  };
  return map[status?.toLowerCase()] ?? status;
}

/** Format a raw amount string ("79875.00") → "₦79,875.00" */
export function formatAmount(raw: string | number): string {
  const num = parseFloat(String(raw));
  if (isNaN(num)) return String(raw);
  return `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

/** Format an ISO date string → "20 Jun 2026" */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
