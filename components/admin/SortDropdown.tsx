"use client";

import React from 'react';
import styles from './SortDropdown.module.css';

export interface SortOption {
  label: string;
  value: string;
}

interface SortDropdownProps {
  options: SortOption[];
  onClose?: () => void;
  onSortSelect: (sort: string) => void;
  selectedOption?: string;
}

export default function SortDropdown({
  options,
  onClose,
  onSortSelect,
  selectedOption,
}: SortDropdownProps) {
  return (
    <div className={styles.container}>
      {options.map((option, idx) => {
        const isSelected =
          selectedOption &&
          selectedOption.toLowerCase() === option.value.toLowerCase();
        return (
          <button
            key={idx}
            className={`${styles.option} ${isSelected ? styles.optionActive : ""}`}
            onClick={() => {
              onSortSelect(option.value);
              if (onClose) onClose();
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

