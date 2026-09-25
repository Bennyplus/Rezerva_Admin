"use client";

import { useState } from "react";
import { SupportTicket } from "@/services/support-center-service";
import styles from "./SupportModals.module.css";

interface ResolveTicketModalProps {
  isOpen: boolean;
  ticket: SupportTicket | null;
  onClose: () => void;
  onResolve: (ticket: SupportTicket, notes: string) => void;
}

export default function ResolveTicketModal({
  isOpen,
  ticket,
  onClose,
  onResolve,
}: ResolveTicketModalProps) {
  const [notes, setNotes] = useState("");

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResolve(ticket, notes.trim());
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Resolve Ticket</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <p className={styles.description}>
              Mark ticket <strong>{ticket.ticketId}</strong> for <strong>{ticket.user}</strong> as Resolved.
            </p>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Resolution Notes</label>
              <textarea
                className={styles.textarea}
                placeholder="Explain the resolution provided to the customer (e.g., Refund issued, problem solved)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.confirmBtn}>
              Mark as Resolved
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
