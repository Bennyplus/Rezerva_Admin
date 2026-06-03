"use client";

import React from 'react';
import styles from './VehiclesSortDropdown.module.css';

interface VehiclesSortDropdownProps {
  onClose?: () => void;
  onSortSelect: (sort: string) => void;
}

export default function VehiclesSortDropdown({ onClose, onSortSelect }: VehiclesSortDropdownProps) {
  const options = [
    { label: "Model A to Z", value: "model_asc" },
    { label: "Model Z to A", value: "model_desc" },
    { label: "Price Low to High", value: "price_asc" },
    { label: "Price High to Low", value: "price_desc" }
  ];

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
