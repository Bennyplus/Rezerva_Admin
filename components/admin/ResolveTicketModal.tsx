"use client";

import React, { useState } from "react";
import styles from "./TicketModals.module.css";
import Spinner from "./Spinner";

interface ResolveTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (notes: string, sendEmail: boolean) => void;
  isLoading: boolean;
}

export default function ResolveTicketModal({ isOpen, onClose, onResolve, isLoading }: ResolveTicketModalProps) {
  const [notes, setNotes] = useState("");
  const [sendEmail, setSendEmail] = useState(false);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Resolve Ticket</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Resolution Notes</label>
            <textarea
              className={styles.textarea}
              placeholder="Describe how the issue was resolved..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className={styles.toggleRow}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
            <span className={styles.toggleLabel}>Send email notification to user</span>
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={styles.submitBtn}
            disabled={!notes.trim() || isLoading}
            onClick={() => {
              onResolve(notes, sendEmail);
              setNotes("");
              setSendEmail(false);
            }}
          >
            {isLoading ? <><Spinner /> Resolving...</> : "Resolve"}
          </button>
        </div>
      </div>
    </div>
  );
}
