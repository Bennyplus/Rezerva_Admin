"use client";

import { useState } from "react";
import Spinner from "@/components/admin/Spinner";
import styles from "./FreezeWalletModal.module.css";

interface FreezeWalletModalProps {
  isOpen: boolean;
  customerName: string;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
}

export default function FreezeWalletModal({
  isOpen,
  customerName,
  onClose,
  onConfirm,
}: FreezeWalletModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isValid = reason.trim().length > 0;

  const handleFreeze = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirm(reason.trim());
      setReason("");
      onClose();
    } catch (e) {
      console.error("Freeze wallet failed:", e);
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
            <h2 className={styles.title}>Freeze Wallet</h2>
            <p className={styles.subtitle}>
              Are you sure you want to freeze {customerName}&apos;s Wallet, user will
              not be able to perform actions on this wallet&gt;
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon />
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
            autoFocus
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
            className={`${styles.freezeBtn} ${
              isValid ? styles.freezeBtnActive : ""
            }`}
            disabled={!isValid || isSubmitting}
            onClick={handleFreeze}
          >
            {isSubmitting ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Spinner size={16} color="#ffffff" />
                Freezing…
              </span>
            ) : (
              "Freeze Wallet"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
