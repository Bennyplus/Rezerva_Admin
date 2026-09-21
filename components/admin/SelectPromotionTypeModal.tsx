"use client";

import React, { useEffect, useState } from "react";
import {
  promotionsService,
  PromotionTypeChoice,
} from "@/services/promotions-services";
import styles from "./SelectPromotionTypeModal.module.css";

export type PromotionTypeOption = string;

interface SelectPromotionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: PromotionTypeOption) => void;
}

export default function SelectPromotionTypeModal({
  isOpen,
  onClose,
  onSelect,
}: SelectPromotionTypeModalProps) {
  const [types, setTypes] = useState<PromotionTypeChoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    promotionsService
      .getPromotionTypes()
      .then((fetchedTypes) => {
        if (isMounted) {
          setTypes(fetchedTypes || []);
        }
      })
      .catch((err) => {
        console.warn("Could not load promotion types:", err);
        if (isMounted) {
          setTypes([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

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
      aria-labelledby="select-promotion-type-title"
    >
      <div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 id="select-promotion-type-title" className={styles.modalTitle}>
            Select Promotion Type
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Options List */}
        <div className={styles.optionsList}>
          {isLoading ? (
            <p className={styles.helperText}>Loading promotion types…</p>
          ) : types.length === 0 ? (
            <p className={styles.helperText}>No promotion types available</p>
          ) : (
            types.map((typeItem) => (
              <button
                key={typeItem.value}
                type="button"
                className={styles.optionBtn}
                onClick={() => {
                  onSelect(typeItem.label);
                  onClose();
                }}
                id={`select-promo-type-${typeItem.value.toLowerCase().replace(/[_\s]+/g, "-")}`}
              >
                <span className={styles.optionLabel}>{typeItem.label}</span>
                <ChevronRightIcon className={styles.chevronIcon} />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
