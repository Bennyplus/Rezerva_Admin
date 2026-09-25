"use client";

import { useState } from "react";
import { SupportTicket } from "@/services/support-center-service";
import styles from "./SupportModals.module.css";

interface AssignTicketModalProps {
  isOpen: boolean;
  ticket: SupportTicket | null;
  onClose: () => void;
  onAssign: (ticket: SupportTicket, assignedTo: string | number, adminNotes?: string) => void;
}

export default function AssignTicketModal({
  isOpen,
  ticket,
  onClose,
  onAssign,
}: AssignTicketModalProps) {
  const [assignedTo, setAssignedTo] = useState<string>("1");
  const [adminNotes, setAdminNotes] = useState<string>("Treat as urgent");

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedTo) return;
    onAssign(ticket, assignedTo, adminNotes.trim());
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Assign Ticket</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <p className={styles.description}>
              Assign ticket <strong>{ticket.ticketId}</strong> to an administrator or support agent.
            </p>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Assign To (Admin)</label>
              <select
                className={styles.select}
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="1">Edward Prosper (ID: 1)</option>
                <option value="2">Prosper Edward (ID: 2)</option>
                <option value="3">Sarah Johnson (ID: 3)</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Admin Notes</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Treat as urgent"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.confirmBtn}>
              Assign Ticket
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
