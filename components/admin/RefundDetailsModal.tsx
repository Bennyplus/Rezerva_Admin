"use client";

import { useEffect } from "react";
import Image from "next/image";
import styles from "./RefundDetailsModal.module.css";
import { Refund } from "@/data/admin-refunds";

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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !refund) return null;

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
            <h2 className={styles.title}>T{refund.bookingId}</h2>
            <Badge status={refund.status} />
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
            <h3 className={styles.sectionTitle}>Booking Information</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <span className={styles.label}>Booking ID</span>
                <span className={styles.valueGroup}>
                  {refund.bookingId}
                  <button className={styles.copyBtn} aria-label="Copy booking ID">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Customer</span>
                <span className={styles.value}>{refund.customerName}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Booking Status</span>
                <span className={styles.badgeCompleted}>
                  <span className={styles.badgeDot} /> Completed
                </span>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Transaction ID</span>
                <span className={styles.valueGroup}>
                  {refund.transactionId}
                  <button className={styles.copyBtn} aria-label="Copy transaction ID">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Vehicle</span>
                <span className={styles.value}>{refund.vehicle}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Date Requested</span>
                <span className={styles.value}>{refund.dateRequested}  12:00PM</span>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Refund Details</h3>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <span className={styles.label}>Refund Type</span>
                <span className={styles.value}>{refund.refundType}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Amount</span>
                <span className={styles.value}>{refund.amount}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Refund Reason</span>
                <span className={styles.value}>{refund.refundReason}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.secondaryBtn} onClick={onReject}>
            Reject Refund
          </button>
          <button className={styles.primaryBtn} onClick={onProcess}>
            Process Refund
          </button>
        </div>
      </div>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  let cls = styles.badgePending;
  if (status === "Completed") cls = styles.badgeCompleted;
  if (status === "Rejected") cls = styles.badgeRejected;
  if (status === "Processing") cls = styles.badgeProcessing;

  return (
    <span className={`${styles.badge} ${cls}`}>
      <span className={styles.badgeDot} />
      {status}
    </span>
  );
}
