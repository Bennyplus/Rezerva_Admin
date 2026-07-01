"use client";

import React, { useState } from "react";
import styles from "./TicketModals.module.css";
import Spinner from "./Spinner";

interface AssignTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (adminId: string, notes: string) => void;
  isLoading: boolean;
}

export default function AssignTicketModal({ isOpen, onClose, onAssign, isLoading }: AssignTicketModalProps) {
  const [adminId, setAdminId] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Assign Ticket</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Assign to (Admin ID)</label>
            <input
              type="text"
              className={styles.textInput}
              placeholder="e.g. admin_123"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Notes (Optional)</label>
            <textarea
              className={styles.textarea}
              placeholder="Add internal notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={styles.submitBtn}
            disabled={!adminId.trim() || isLoading}
            onClick={() => {
              onAssign(adminId, notes);
              setAdminId("");
              setNotes("");
            }}
          >
            {isLoading ? <><Spinner /> Assigning...</> : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
