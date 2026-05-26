"use client";

import { useEffect, useState } from "react";
import styles from "./RejectRefundModal.module.css";

interface RejectRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: () => void;
}

export default function RejectRefundModal({
  isOpen,
  onClose,
  onReject,
}: RejectRefundModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setReason("");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
          <h2 className={styles.title}>Reject Refund</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <p className={styles.subtitle}>
            Are you sure you want to reject this transaction. This action cannot be reversed once processed.
          </p>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Reason<span className={styles.required}>*</span>
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Please provide reason for action"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.secondaryBtn} onClick={onClose}>
            Dismiss
          </button>
          <button
            className={styles.rejectBtn}
            onClick={() => {
              if (reason.trim()) {
                onReject();
              }
            }}
            disabled={!reason.trim()}
          >
            Reject Refund
          </button>
        </div>
      </div>
    </div>
  );
}
