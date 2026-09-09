"use client";

import React, { useState } from "react";
import styles from "./CancelRideModal.module.css";

interface CancelRideModalProps {
  isOpen: boolean;
  tripId?: number | string | null;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export default function CancelRideModal({
  isOpen,
  tripId,
  onClose,
  onConfirm,
}: CancelRideModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
    setTimeout(() => {
      setReason("");
      setErrorMsg("");
      setIsSubmitting(false);
    }, 250);
  };

  const handleConfirm = async () => {
    if (!reason.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      await onConfirm(reason.trim());
      handleClose();
    } catch (err: any) {
      setIsSubmitting(false);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "An error occurred while cancelling this ride. Please try again.";
      setErrorMsg(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Cancel Ride?</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close"
            disabled={isSubmitting}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#98A2B3"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <path
                d="M15 9l-6 6M9 9l6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <p className={styles.message}>
            Are you sure you want to cancel this booking? Please provide a
            reason before proceeding.
          </p>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Reason<span className={styles.required}>*</span>
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Please provide reason for action"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.dismissBtn}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Dismiss
          </button>
          <button
            type="button"
            className={`${styles.confirmBtn} ${
              reason.trim() ? styles.confirmBtnActive : ""
            }`}
            onClick={handleConfirm}
            disabled={!reason.trim() || isSubmitting}
          >
            {isSubmitting ? "Cancelling..." : "Cancel Ride"}
          </button>
        </div>
      </div>
    </div>
  );
}
