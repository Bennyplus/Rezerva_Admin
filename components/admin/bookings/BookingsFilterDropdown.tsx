"use client";

import React, { useRef, useEffect, useState } from 'react';
import styles from './BookingsFilterDropdown.module.css';

interface BookingsFilterDropdownProps {
  onClose: () => void;
  onApply: (filters: any) => void;
}

const TABS = [
  { id: 'status', label: 'Status' },
  { id: 'bookingType', label: 'Booking Type' },
  { id: 'date', label: 'Date' },
  { id: 'vehicle', label: 'Vehicle' },
  { id: 'customer', label: 'Customer' },
];

const STATUS_OPTIONS = [
  'Completed',
  'Scheduled',
  'Ongoing',
  'Cancelled'
];

export default function BookingsFilterDropdown({ onClose, onApply }: BookingsFilterDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('status');
  
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
    if (activeTab === 'status') {
      setSelectedStatuses([]);
    }
  };

  const handleApply = () => {
    onApply({
      status: selectedStatuses
    });
    onClose();
  };

  const renderIcon = (tabId: string) => {
    switch (tabId) {
      case 'status':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12A10 10 0 0 0 12 2M2 12A10 10 0 0 0 12 22M12 22a10 10 0 0 0 10-10M2 12A10 10 0 0 1 12 2"/>
          </svg>
        );
      case 'bookingType':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
        );
      case 'date':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        );
      case 'vehicle':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a2 2 0 00-1.6-.8H8.3a2 2 0 00-1.6.8L4 11l-5.16.86a1 1 0 00-.84.99V16h3m10 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0m-7 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0"/>
          </svg>
        );
      case 'customer':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const activeTabObj = TABS.find(t => t.id === activeTab);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.sidebar}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className={styles.tabIcon}>
              {renderIcon(tab.id)}
            </div>
            {tab.label}
            {activeTab === tab.id && (
              <div className={styles.tabArrow}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.tabIcon}>
            {activeTabObj ? renderIcon(activeTabObj.id) : null}
          </div>
          {activeTabObj?.label}
        </div>
        <div className={styles.body}>
          {activeTab === 'status' ? (
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
          ) : (
            <div style={{ color: '#868C98', fontSize: 13 }}>
              Select options for {activeTabObj?.label.toLowerCase()} here...
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
          <button className={styles.applyBtn} onClick={handleApply}>Apply</button>
        </div>
      </div>
    </div>
  );
}
