"use client";

import React from 'react';
import styles from './NotificationsSortDropdown.module.css';

interface NotificationsSortDropdownProps {
  onClose?: () => void;
  onSortSelect: (sort: string) => void;
}

export default function NotificationsSortDropdown({ onClose, onSortSelect }: NotificationsSortDropdownProps) {
  const options = [
    { label: "Newest to Oldest", value: "date_desc" },
    { label: "Oldest to Newest", value: "date_asc" },
    { label: "Title A to Z", value: "title_asc" },
    { label: "Title Z to A", value: "title_desc" }
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
