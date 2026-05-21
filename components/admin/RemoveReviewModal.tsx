"use client";

import { useEffect } from "react";
import styles from "./RemoveReviewModal.module.css";

interface RemoveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RemoveReviewModal({ isOpen, onClose, onConfirm }: RemoveReviewModalProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.body}>
          <div className={styles.iconWrap}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className={styles.content}>
            <h2 className={styles.title}>Remove Review?</h2>
            <p className={styles.subtitle}>This review will be hidden from public view.</p>
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.btnDismiss} onClick={onClose}>
            Dismiss
          </button>
          <button className={styles.btnRemove} onClick={onConfirm}>
            Remove Review
          </button>
        </div>
      </div>
    </div>
  );
}
