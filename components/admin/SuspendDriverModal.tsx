"use client";

import { useState } from "react";
import styles from "./SuspendDriverModal.module.css";

interface SuspendDriverModalProps {
  isOpen: boolean;
  driverName: string;
  onDismiss: () => void;
  onConfirm: () => Promise<void>;
}

export default function SuspendDriverModal({
  isOpen,
  driverName,
  onDismiss,
  onConfirm,
}: SuspendDriverModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onDismiss}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className={styles.iconWrap}>
          <WarningIcon />
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h2 className={styles.title}>Suspend Driver</h2>
          <p className={styles.body}>
            Are you sure you want to suspend{" "}
            <strong>{driverName}</strong>? They will no longer be able
            to accept or manage bookings.
          </p>
        </div>

        {/* Actions */}
        <div className={styles.footer}>
          <button
            className={styles.dismissBtn}
            onClick={onDismiss}
            id="suspend-driver-dismiss"
          >
            Dismiss
          </button>
          <button
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={isSubmitting}
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

function WarningIcon() {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#EF4444"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
