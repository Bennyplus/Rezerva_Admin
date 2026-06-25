"use client";

import React, { useRef, useEffect, useState } from 'react';
import styles from './TicketsFilterDropdown.module.css';

interface TicketsFilterDropdownProps {
  onClose?: () => void;
  onApply: (filters: { status: string[] }) => void;
}

const STATUS_OPTIONS = [
  'Resolved',
  'Escalated',
  'Closed'
];

export default function TicketsFilterDropdown({ onClose = () => { }, onApply }: TicketsFilterDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

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

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleClear = () => {
    setSelectedStatuses([]);
  };

  const handleApply = () => {
    onApply({ status: selectedStatuses });
    onClose();
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.header}>
        <div className={styles.tabIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12A10 10 0 0 0 12 2M2 12A10 10 0 0 0 12 22M12 22a10 10 0 0 0 10-10M2 12A10 10 0 0 1 12 2" />
          </svg>
        </div>
        Status Filter
      </div>
      <div className={styles.body}>
        <div className={styles.grid}>
          {STATUS_OPTIONS.map(status => (
            <label key={status} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={selectedStatuses.includes(status)}
                onChange={() => toggleStatus(status)}
              />
              {status}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
        <button className={styles.applyBtn} onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
}
