"use client";

import { useState } from "react";
import styles from "./SuspendDriverModal.module.css";

interface SuspendDriverModalProps {
  isOpen: boolean;
  driverName?: string;
  onDismiss: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
}

export default function SuspendDriverModal({
  isOpen,
  onDismiss,
  onConfirm,
}: SuspendDriverModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    setIsSubmitting(true);
    try {
      await onConfirm(reason);
      setReason("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    onDismiss();
  };

  const isEnabled = reason.trim().length > 0;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header with icon and title */}
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <WarningOctagonIcon />
          </div>
          <div className={styles.headerText}>
            <h2 className={styles.title}>Suspend Driver</h2>
            <p className={styles.subtitle}>
              Are you sure you want to suspend this driver? They will no longer be able
              to accept or manage bookings.
            </p>
          </div>
        </div>

        {/* Reason form field */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Reason <span className={styles.asterisk}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Please provide reason for action"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>

        {/* Footer actions */}
        <div className={styles.footer}>
          <button
            className={styles.dismissBtn}
            onClick={handleClose}
            disabled={isSubmitting}
            id="suspend-driver-dismiss"
          >
            Dismiss
          </button>
          <button
            className={`${styles.confirmBtn} ${isEnabled ? styles.confirmBtnActive : styles.confirmBtnDisabled}`}
            onClick={handleConfirm}
            disabled={!isEnabled || isSubmitting}
            aria-busy={isSubmitting}
            id="suspend-driver-confirm"
          >
            {isSubmitting ? "Suspending..." : "Suspend Driver"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WarningOctagonIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#F79009" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 2 7.86 7.86 2" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
