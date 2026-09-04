"use client";

import { useState } from "react";
import Spinner from "@/components/admin/Spinner";
import styles from "./WalletConfirmModal.module.css";

interface WalletConfirmModalProps {
  isOpen: boolean;
  mode: "credit" | "debit";
  amount: number;
  customerName: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function WalletConfirmModal({
  isOpen,
  mode,
  amount,
  customerName,
  onClose,
  onConfirm,
}: WalletConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isCredit = mode === "credit";
  const title = isCredit ? "Credit Wallet?" : "Debit Wallet?";
  const actionText = isCredit ? "Credit" : "Debit";
  const preposition = isCredit ? "to" : "from";
  const firstName = customerName.split(" ")[0] || customerName;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      console.error("Confirmation error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          {/* Blue Info Icon */}
          <div className={styles.iconWrap}>
            <InfoIcon />
          </div>

          {/* Texts */}
          <div className={styles.content}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>
              {actionText} ${amount.toFixed(2)} {preposition} {firstName}&apos;s wallet?
            </p>
            <p className={styles.warning}>This action cannot be undone</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Spinner size={16} color="#ffffff" />
                Processing…
              </span>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
