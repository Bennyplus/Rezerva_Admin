"use client";

import React, { useRef, useEffect } from 'react';
import styles from './BookingsSortDropdown.module.css';

interface BookingsSortDropdownProps {
  onClose: () => void;
  onSortSelect: (sort: string) => void;
}

export default function BookingsSortDropdown({ onClose, onSortSelect }: BookingsSortDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const options = [
    "Newest to Oldest",
    "Oldest to Newest",
    "Amount Highest to Lowest",
    "Amount Lowest to Highest"
  ];

  return (
    <div className={styles.container} ref={containerRef}>
      {options.map((option, idx) => (
        <button
          key={idx}
          className={styles.option}
          onClick={() => {
            onSortSelect(option);
            onClose();
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
