"use client";

import { useEffect, useState } from "react";
import { useToast, type ToastItem, type ToastType } from "@/lib/toast-context";
import styles from "./Toast.module.css";

/* ─── Container ─────────────────────────────────────────────────────────────── */

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}

/* ─── Single toast ───────────────────────────────────────────────────────────── */

interface ToastNotificationProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastNotification({ toast, onDismiss }: ToastNotificationProps) {
  const [exiting, setExiting] = useState(false);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 200);
  };

  // Trigger exit animation just before the context auto-removes it
  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), 4200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${styles.toast} ${styles[toast.type]} ${exiting ? styles.exiting : ""}`}
      role="alert"
      aria-label={`${toast.type} notification`}
    >
      <span className={styles.icon} aria-hidden="true">
        <ToastIcon type={toast.type} />
      </span>

      <div className={styles.body}>
        <p className={styles.message}>{toast.message}</p>
      </div>

      <button
        className={styles.dismiss}
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        type="button"
      >
        <XIcon />
      </button>

      <div className={styles.progressBar} aria-hidden="true" />
    </div>
  );
}

/* ─── Icons — all white to match dark pill ───────────────────────────────────── */

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") {
    return (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>

    );
  }
  if (type === "error") {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  // info
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13">
      <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
    </svg>
  );
}
