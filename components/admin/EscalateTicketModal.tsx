"use client";

import { useEffect, useState } from "react";
import styles from "./TicketModals.module.css";

interface EscalateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEscalate: (reason: string) => void;
  isLoading?: boolean;
}

export default function EscalateTicketModal({
  isOpen,
  onClose,
  onEscalate,
  isLoading = false,
}: EscalateTicketModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setReason("");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isValid = reason.trim().length > 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Escalate Ticket</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Escalation Reason</label>
            <textarea
              className={styles.textarea}
              placeholder="Describe why this ticket needs escalation"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className={styles.submitBtn}
            disabled={!isValid || isLoading}
            onClick={() => isValid && onEscalate(reason)}
          >
            {isLoading ? "Escalating…" : "Escalate Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}
