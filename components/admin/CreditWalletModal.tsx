"use client";

import { useState } from "react";
import Spinner from "@/components/admin/Spinner";
import styles from "./CreditWalletModal.module.css";

interface CreditWalletModalProps {
  isOpen: boolean;
  mode?: "credit" | "debit";
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    reason: string;
    category: string;
  }) => Promise<void> | void;
}

const CATEGORY_OPTIONS = [
  { label: "Referral Bonus", value: "referral_bonus" },
  { label: "Compensation", value: "compensation" },
  { label: "Refund", value: "refund" },
];

export default function CreditWalletModal({
  isOpen,
  mode = "credit",
  onClose,
  onSubmit,
}: CreditWalletModalProps) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState("referral_bonus");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount);
  const isValid = !isNaN(numAmount) && numAmount > 0 && reason.trim().length > 0;
  const title = mode === "credit" ? "Credit Wallet" : "Debit Wallet";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        amount: numAmount,
        reason: reason.trim(),
        category,
      });
      setAmount("");
      setReason("");
      onClose();
    } catch (err) {
      console.error(`Failed to ${mode} wallet:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Amount */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Amount</label>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="€ 0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={styles.input}
                disabled={isSubmitting}
                autoFocus
              />
            </div>
          </div>

          {/* Reason */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Reason</label>
            <textarea
              placeholder="Provide reason for this action"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={styles.textarea}
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Category</label>
            <div className={styles.selectWrapper}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.select}
                disabled={isSubmitting}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className={styles.chevronIcon}>
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          {/* Footer */}
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
              type="submit"
              className={`${styles.submitBtn} ${
                isValid ? styles.submitBtnActive : ""
              }`}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Spinner size={16} color="#ffffff" />
                  Processing…
                </span>
              ) : (
                title
              )}
            </button>
          </div>
        </form>
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

function ChevronDownIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
