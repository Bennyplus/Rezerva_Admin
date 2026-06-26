"use client";

import React, { useRef, useEffect, useState } from 'react';
import styles from './NotificationsFilterDropdown.module.css';

interface NotificationsFilterDropdownProps {
  onClose?: () => void;
  onApply: (filters: { statuses: string[], channels: string[], recipients: string[] }) => void;
}

const TABS = [
  { id: 'status', label: 'Status' },
  { id: 'channel', label: 'Channel' },
  { id: 'recipients', label: 'Recipients' },
  { id: 'date', label: 'Date' }
];

export default function NotificationsFilterDropdown({ onClose = () => {}, onApply }: NotificationsFilterDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('status');
  
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

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

  const toggleChannel = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    );
  };

  const toggleRecipient = (recipient: string) => {
    setSelectedRecipients(prev => 
      prev.includes(recipient) ? prev.filter(r => r !== recipient) : [...prev, recipient]
    );
  };

  const handleClear = () => {
    if (activeTab === 'status') setSelectedStatuses([]);
    if (activeTab === 'channel') setSelectedChannels([]);
    if (activeTab === 'recipients') setSelectedRecipients([]);
  };

  const handleApply = () => {
    onApply({
      statuses: selectedStatuses,
      channels: selectedChannels,
      recipients: selectedRecipients
    });
    onClose();
  };

  const renderIcon = (tabId: string) => {
    switch (tabId) {
      case 'status':
        return (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.03906 12.475C2.93073 15.3416 5.33073 17.55 8.31407 18.1583L2.03906 12.475Z" fill="currentColor"/>
            <path d="M2.03906 12.475C2.93073 15.3416 5.33073 17.55 8.31407 18.1583" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.71094 9.15002C2.13594 4.94169 5.68594 1.66669 10.0026 1.66669C14.3193 1.66669 17.8693 4.95002 18.2943 9.15002" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.6719 18.1667C14.6469 17.5583 17.0385 15.375 17.9469 12.5167" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'channel':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
        );
      case 'recipients':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
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
            {activeTab === 'status' && ['Active', 'Inactive'].map(status => (
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
            {activeTab === 'channel' && ['Push', 'Email', 'In-App'].map(channel => (
              <label key={channel} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={selectedChannels.includes(channel)}
                  onChange={() => toggleChannel(channel)}
                />
                {channel}
              </label>
            ))}
            {activeTab === 'recipients' && ['All', 'Drivers', 'Customers'].map(rec => (
              <label key={rec} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={selectedRecipients.includes(rec)}
                  onChange={() => toggleRecipient(rec)}
                />
                {rec}
              </label>
            ))}
            {activeTab === 'date' && (
              <div style={{ fontSize: '13px', color: '#868C98' }}>Date picker not implemented.</div>
            )}
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
