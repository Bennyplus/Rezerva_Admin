"use client";

import { useState } from "react";
import styles from "./CancelBookingModal.module.css";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  bookingId?: string;
}

export default function CancelBookingModal({ isOpen, onClose, onConfirm, bookingId }: CancelBookingModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Cancel Booking?</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.message}>
            Are you sure you want to cancel this booking? Please provide a reason before proceeding.
          </p>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Reason <span className={styles.required}>*</span>
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Please provide reason for action"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.dismissBtn} onClick={onClose}>Dismiss</button>
          <button
            className={`${styles.confirmBtn} ${reason.trim() ? styles.confirmBtnActive : ""}`}
            onClick={handleConfirm}
            disabled={!reason.trim()}
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}
