"use client";

import React, { useState } from "react";
import styles from "./TicketModals.module.css";
import Spinner from "./Spinner";

interface EscalateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEscalate: (reason: string) => void;
  isLoading: boolean;
}

export default function EscalateTicketModal({ isOpen, onClose, onEscalate, isLoading }: EscalateTicketModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Escalate Ticket</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Reason for Escalation</label>
            <textarea
              className={styles.textarea}
              placeholder="Why does this need to be escalated?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={styles.submitBtn}
            disabled={!reason.trim() || isLoading}
            onClick={() => {
              onEscalate(reason);
              setReason("");
            }}
          >
            {isLoading ? <><Spinner /> Escalating...</> : "Escalate"}
          </button>
        </div>
      </div>
    </div>
  );
}
