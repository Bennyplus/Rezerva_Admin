"use client";

import { useState } from "react";
import styles from "./SuspendUserModal.module.css";

interface SuspendUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  userName: string;
  isLoading?: boolean;
}

export default function SuspendUserModal({
  isOpen,
  onClose,
  onSubmit,
  userName,
  isLoading = false
}: SuspendUserModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const isValid = reason.trim().length > 0;

  const handleSubmit = () => {
    if (isValid && !isLoading) {
      onSubmit(reason);
      setReason("");
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={isLoading ? undefined : handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Suspend {userName}?</h2>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close modal"
            disabled={isLoading}
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.description}>
            Are you sure you want to suspend {userName}? They will temporarily lose access to the admin platform and assigned permissions. Please provide a reason before proceeding.
          </p>

          <div className={styles.field}>
            <label className={styles.label}>
              Reason<span className={styles.asterisk}>*</span>
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Please provide reason for action"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleClose} disabled={isLoading}>
            Dismiss
          </button>
          <button
            className={`${styles.submitBtn} ${isValid ? styles.submitBtnActive : ""}`}
            disabled={!isValid || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Suspending..." : "Suspend"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
