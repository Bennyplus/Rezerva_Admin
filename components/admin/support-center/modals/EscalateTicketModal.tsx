"use client";

import { useState } from "react";
import { SupportTicket } from "@/services/support-center-service";
import styles from "./SupportModals.module.css";

interface EscalateTicketModalProps {
  isOpen: boolean;
  ticket: SupportTicket | null;
  onClose: () => void;
  onEscalate: (ticket: SupportTicket, reason: string) => void;
}

export default function EscalateTicketModal({
  isOpen,
  ticket,
  onClose,
  onEscalate,
}: EscalateTicketModalProps) {
  const [escalationReason, setEscalationReason] = useState("High impact issue requiring tier-2 supervisor");

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEscalate(ticket, escalationReason);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Escalate Ticket</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <p className={styles.description}>
              Escalate ticket <strong>{ticket.ticketId}</strong> to High / Critical priority and notify management.
            </p>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Escalation Reason / Notes</label>
              <textarea
                className={styles.textarea}
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                placeholder="Detail the urgency or escalation trigger..."
                required
              />
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.confirmDangerBtn}>
              Escalate Ticket
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
