"use client";

import { useEffect, useState } from "react";
import styles from "./ProcessRefundModal.module.css";
import CustomSelect from "./CustomSelect";
import { refundsService } from "@/services/refunds-service";

interface ProcessRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcess: () => void;
  refundId?: string;
}

export default function ProcessRefundModal({
  isOpen,
  onClose,
  onProcess,
  refundId,
}: ProcessRefundModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    refundType: "",
    amount: "20.00",
    currency: "EUR",
    reason: "",
    description: "Provide reason for giving the refund",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setShowConfirm(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const refundTypes = [
    { value: "Partial Refund", label: "Partial Refund" },
    { value: "Full Refund", label: "Full Refund" },
  ];

  const refundReasons = [
    { value: "Vehicle Issue", label: "Vehicle Issue" },
    { value: "Customer Cancelled", label: "Customer Cancelled" },
  ];

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>Process Refund</h2>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <div className={styles.content}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Refund type</label>
              <CustomSelect
                name="refundType"
                value={formData.refundType}
                placeholder="eg Partial Refund"
                options={refundTypes}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Amount</label>
              <div className={styles.amountInputWrap}>
                <span className={styles.currencySymbol}>€</span>
                <input
                  type="text"
                  className={styles.amountInput}
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                />
                <div className={styles.currencySelect}>
                  <div className={styles.currencyFlag}></div>
                  <span className={styles.currencyLabel}>{formData.currency}</span>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Refund Reason</label>
              <CustomSelect
                name="reason"
                value={formData.reason}
                placeholder="e.g Vehicle Issue"
                options={refundReasons}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.submitBtn}
              onClick={() => setShowConfirm(true)}
            >
              Process Refund
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      {showConfirm && (
        <div className={styles.overlayConfirm} onClick={() => setShowConfirm(false)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmHeader}>
              <div className={styles.iconWrap}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth={2} strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className={styles.confirmText}>
                <h3 className={styles.confirmTitle}>Process Refund?</h3>
                <p className={styles.confirmSubtitle}>
                  Are you sure you want to process this refund. This action cannot be reversed once processed.
                </p>
              </div>
            </div>
            <div className={styles.confirmFooter}>
              <button className={styles.secondaryBtn} onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button
                className={styles.primaryBtn}
                disabled={isSubmitting}
                onClick={async () => {
                  if (refundId) {
                    setIsSubmitting(true);
                    try {
                      await refundsService.processRefund(refundId);
                      setShowConfirm(false);
                      onProcess();
                    } catch {
                      // toast handled by API client interceptor — keep modal open
                    } finally {
                      setIsSubmitting(false);
                    }
                  } else {
                    // No refundId (shouldn't happen), close and notify anyway
                    setShowConfirm(false);
                    onProcess();
                  }
                }}
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
