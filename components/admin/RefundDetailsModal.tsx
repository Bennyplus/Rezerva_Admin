"use client";

import { useEffect } from "react";
import styles from "./RefundDetailsModal.module.css";
import { Refund, formatAmount, formatDate, getStatusDisplay } from "@/data/admin-refunds";

interface RefundDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  refund: Refund | null;
  onReject: () => void;
  onProcess: () => void;
}

export default function RefundDetailsModal({
  isOpen,
  onClose,
  refund,
  onReject,
  onProcess,
}: RefundDetailsModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen || !refund) return null;

  const statusLabel = getStatusDisplay(refund.status);
  const isPending = refund.status === "pending";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>{refund.reference}</h2>
            <Badge status={refund.status} label={statusLabel} />
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Payment Information</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <span className={styles.label}>Payment Reference</span>
                <CopyField value={refund.payment?.reference ?? "—"} />
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Initiated By</span>
                <span className={styles.value}>
                  {refund.initiated_by?.full_name ?? refund.initiated_by?.email ?? "—"}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Reviewed By</span>
                <span className={styles.value}>
                  {refund.reviewed_by?.full_name ?? refund.reviewed_by?.email ?? "—"}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Date Requested</span>
                <span className={styles.value}>{formatDate(refund.created_at)}</span>
              </div>
              {refund.refunded_at && (
                <div className={styles.field}>
                  <span className={styles.label}>Date Refunded</span>
                  <span className={styles.value}>{formatDate(refund.refunded_at)}</span>
                </div>
              )}
              {refund.rejected_at && (
                <div className={styles.field}>
                  <span className={styles.label}>Date Rejected</span>
                  <span className={styles.value}>{formatDate(refund.rejected_at)}</span>
                </div>
              )}
              {refund.gateway_reference && (
                <div className={styles.field}>
                  <span className={styles.label}>Gateway Reference</span>
                  <CopyField value={refund.gateway_reference} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Refund Details</h3>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <span className={styles.label}>Reason</span>
                <span className={styles.value}>{refund.reason_display}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Amount</span>
                <span className={styles.value}>{formatAmount(refund.amount)}</span>
              </div>
              {refund.reason_note && (
                <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
                  <span className={styles.label}>Notes</span>
                  <span className={styles.value}>{refund.reason_note}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer — only show actions for pending refunds */}
        {isPending && (
          <div className={styles.footer}>
            <button className={styles.secondaryBtn} onClick={onReject}>
              Reject Refund
            </button>
            <button className={styles.primaryBtn} onClick={onProcess}>
              Process Refund
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Internal helpers ─────────────────────────────────────────── */

function Badge({ status, label }: { status: string; label: string }) {
  const map: Record<string, string> = {
    pending: styles.badgePending,
    processing: styles.badgeProcessing,
    success: styles.badgeCompleted,
    rejected: styles.badgeRejected,
    failed: styles.badgeRejected,
  };
  const cls = map[status?.toLowerCase()] ?? styles.badgePending;
  return (
    <span className={`${styles.badge} ${cls}`}>
      <span className={styles.badgeDot} />
      {label}
    </span>
  );
}

function CopyField({ value }: { value: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value).catch(() => {});
  };
  return (
    <span className={styles.valueGroup}>
      {value}
      <button className={styles.copyBtn} aria-label="Copy" onClick={handleCopy}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
    </span>
  );
}
