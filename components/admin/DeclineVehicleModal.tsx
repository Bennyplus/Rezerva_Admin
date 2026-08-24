"use client";

import { useState } from "react";
import styles from "./DeclineVehicleModal.module.css";
import { AdminVehicle } from "@/data/admin-vehicles";

interface DeclineVehicleModalProps {
  isOpen: boolean;
  vehicle: AdminVehicle | null;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
}

export default function DeclineVehicleModal({
  isOpen,
  vehicle,
  onClose,
  onConfirm,
}: DeclineVehicleModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !vehicle) return null;

  const isFormValid = reason.trim().length > 0;

  const handleDecline = async () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirm(reason);
      setReason("");
      onClose();
    } catch (e) {
      console.error("Decline vehicle failed:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>Decline Vehicle?</h2>
            <p className={styles.subtitle}>Are you sure you want to decline vehicle?</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </button>
        </div>

        {/* Reason Field */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Reason<span className={styles.requiredMark}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Please provide reason for action"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.dismissBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Dismiss
          </button>
          <button
            type="button"
            className={`${styles.declineBtn} ${isFormValid ? styles.declineBtnActive : ""}`}
            disabled={!isFormValid || isSubmitting}
            onClick={handleDecline}
          >
            {isSubmitting ? "Declining…" : "Decline Vehicle"}
          </button>
        </div>
      </div>
    </div>
  );
}
