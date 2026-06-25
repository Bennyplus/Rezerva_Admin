"use client";

import React, { useRef, useEffect, useState } from 'react';
import styles from './AuditLogsFilterDropdown.module.css';

interface AuditLogsFilterDropdownProps {
  categories: string[];
  actions: string[];
  statuses: string[];
  onClose?: () => void;
  onApply: (filters: { categories: string[], actions: string[], statuses: string[] }) => void;
}

const TABS = [
  { id: 'category', label: 'Category' },
  { id: 'action', label: 'Action' },
  { id: 'status', label: 'Status' }
];

export default function AuditLogsFilterDropdown({ categories, actions, statuses, onClose = () => {}, onApply }: AuditLogsFilterDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('category');
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
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

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleAction = (action: string) => {
    setSelectedActions(prev => 
      prev.includes(action) ? prev.filter(a => a !== action) : [...prev, action]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleClear = () => {
    if (activeTab === 'category') setSelectedCategories([]);
    if (activeTab === 'action') setSelectedActions([]);
    if (activeTab === 'status') setSelectedStatuses([]);
  };

  const handleApply = () => {
    onApply({
      categories: selectedCategories,
      actions: selectedActions,
      statuses: selectedStatuses
    });
    onClose();
  };

  const renderIcon = (tabId: string) => {
    switch (tabId) {
      case 'category':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        );
      case 'action':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        );
      case 'status':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12A10 10 0 0 0 12 2M2 12A10 10 0 0 0 12 22M12 22a10 10 0 0 0 10-10M2 12A10 10 0 0 1 12 2"/>
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
          <div className={styles.grid}>
            {activeTab === 'category' && categories.map(category => (
              <label key={category} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                {category}
              </label>
            ))}
            {activeTab === 'action' && actions.map(action => (
              <label key={action} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={selectedActions.includes(action)}
                  onChange={() => toggleAction(action)}
                />
                {action.split("_").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </label>
            ))}
            {activeTab === 'status' && statuses.map(status => (
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
    </div>
  );
}
