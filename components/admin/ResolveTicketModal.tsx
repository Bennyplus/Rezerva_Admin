"use client";

import { useEffect, useState } from "react";
import styles from "./TicketModals.module.css";

interface ResolveTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (notes: string, notifyEmail?: string) => void;
}

export default function ResolveTicketModal({
  isOpen,
  onClose,
  onResolve,
}: ResolveTicketModalProps) {
  const [notes, setNotes] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setNotes("");
      setNotifyCustomer(false);
      setEmail("");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isValid = notes.trim().length > 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Resolve Ticket</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Resolution Notes</label>
            <textarea
              className={styles.textarea}
              placeholder="Enter resolution details"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.toggleRow}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={notifyCustomer}
                  onChange={(e) => setNotifyCustomer(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
              <span className={styles.toggleLabel}>Notify customer of resolution</span>
            </div>
            {notifyCustomer && (
              <input
                type="email"
                className={styles.textInput}
                placeholder="Sarajoson@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={styles.submitBtn}
            disabled={!isValid}
            onClick={() => isValid && onResolve(notes, notifyCustomer ? email : undefined)}
          >
            Resolve Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
