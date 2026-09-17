"use client";

import { useEffect } from "react";
import styles from "./PlatformRulesMenu.module.css";

interface PlatformRulesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (destination: "config" | "history") => void;
  activeDestination?: "config" | "history";
}

export default function PlatformRulesMenu({
  isOpen,
  onClose,
  onSelect,
  activeDestination,
}: PlatformRulesMenuProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Select Platform Rules Destination"
    >
      <div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={`${styles.menuOption} ${
            activeDestination === "config" ? styles.menuOptionActive : ""
          }`}
          onClick={() => {
            onSelect("config");
            onClose();
          }}
          id="select-rules-configuration-btn"
        >
          Rules Configuration
        </button>

        <button
          type="button"
          className={`${styles.menuOption} ${
            activeDestination === "history" ? styles.menuOptionActive : ""
          }`}
          onClick={() => {
            onSelect("history");
            onClose();
          }}
          id="select-rules-history-btn"
        >
          History
        </button>
      </div>
    </div>
  );
}
