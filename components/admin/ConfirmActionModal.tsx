"use client";

import styles from "./ConfirmActionModal.module.css";

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  isDanger?: boolean;
  variant?: "danger" | "primary" | "blue";
  isLoading?: boolean;
}

export default function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = "Dismiss",
  isDanger = true,
  variant,
  isLoading = false,
}: ConfirmActionModalProps) {
  if (!isOpen) return null;

  // Determine actual variant
  const effectiveVariant: "danger" | "primary" | "blue" =
    variant || (isDanger ? "danger" : "primary");

  const iconColor =
    effectiveVariant === "blue"
      ? "#2F68FE"
      : effectiveVariant === "danger"
      ? "#D92D20"
      : "#E04F16";

  const iconBgClass =
    effectiveVariant === "blue"
      ? styles.iconWrapperBlue
      : effectiveVariant === "danger"
      ? styles.iconWrapperDanger
      : styles.iconWrapper;

  const confirmBtnClass =
    effectiveVariant === "blue"
      ? styles.blueBtn
      : effectiveVariant === "danger"
      ? styles.dangerBtn
      : styles.primaryBtn;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.contentWrapper}>
          <div className={`${styles.iconWrapper} ${iconBgClass}`}>
            <CircleExclamationIcon color={iconColor} />
          </div>
          <div className={styles.textContent}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.message}>{message}</p>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={isLoading}>
            {cancelText}
          </button>
          <button
            className={`${styles.confirmBtn} ${confirmBtnClass}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function CircleExclamationIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
