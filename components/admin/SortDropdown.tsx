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
}

export default function SortDropdown({ options, onClose, onSortSelect }: SortDropdownProps) {
  return (
    <div className={styles.container}>
      {options.map((option, idx) => (
        <button
          key={idx}
          className={styles.option}
          onClick={() => {
            onSortSelect(option.value);
            if (onClose) onClose();
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
