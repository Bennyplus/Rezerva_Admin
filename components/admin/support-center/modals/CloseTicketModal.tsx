"use client";

import { useState } from "react";
import { SupportTicket } from "@/services/support-center-service";
import styles from "./SupportModals.module.css";

interface CloseTicketModalProps {
  isOpen: boolean;
  ticket: SupportTicket | null;
  onClose: () => void;
  onConfirmClose: (ticket: SupportTicket, reason: string) => void;
}

export default function CloseTicketModal({
  isOpen,
  ticket,
  onClose,
  onConfirmClose,
}: CloseTicketModalProps) {
  const [reason, setReason] = useState("Issue resolved or no response");

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmClose(ticket, reason);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Close Ticket</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <p className={styles.description}>
              Are you sure you want to close ticket <strong>{ticket.ticketId}</strong>?
            </p>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Reason for Closure</label>
              <select
                className={styles.select}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="Issue resolved">Issue resolved</option>
                <option value="No response from user">No response from user</option>
                <option value="Duplicate ticket">Duplicate ticket</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.confirmDangerBtn}>
              Close Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1={18} y1={6} x2={6} y2={18} />
      <line x1={6} y1={6} x2={18} y2={18} />
    </svg>
  );
}
