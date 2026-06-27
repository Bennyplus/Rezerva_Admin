"use client";

import React, { useRef, useEffect, useState } from 'react';
import styles from './FilterDropdown.module.css';

export interface FilterTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  options?: string[]; // for simple checkbox lists
  renderContent?: (
    selectedValues: string[],
    toggleValue: (val: string) => void
  ) => React.ReactNode; // for custom content like date pickers
}

interface FilterDropdownProps {
  tabs: FilterTab[];
  onClose?: () => void;
  onApply: (filters: Record<string, string[]>) => void;
  initialFilters?: Record<string, string[]>;
}

const StatusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.03906 12.4751C2.93073 15.3418 5.33073 17.5501 8.31407 18.1584L2.03906 12.4751Z" fill="#0A0D14" />
    <path d="M2.03906 12.4751C2.93073 15.3418 5.33073 17.5501 8.31407 18.1584" stroke="#0A0D14" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.71094 9.15008C2.13594 4.94175 5.68594 1.66675 10.0026 1.66675C14.3193 1.66675 17.8693 4.95008 18.2943 9.15008" stroke="#0A0D14" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.6719 18.1666C14.6469 17.5583 17.0385 15.3749 17.9469 12.5166" stroke="#0A0D14" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CategoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.1641 8.33341H15.8307C17.4974 8.33341 18.3307 7.50008 18.3307 5.83341V4.16675C18.3307 2.50008 17.4974 1.66675 15.8307 1.66675H14.1641C12.4974 1.66675 11.6641 2.50008 11.6641 4.16675V5.83341C11.6641 7.50008 12.4974 8.33341 14.1641 8.33341Z" stroke="#868C98" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.16406 18.3334H5.83073C7.4974 18.3334 8.33073 17.5001 8.33073 15.8334V14.1667C8.33073 12.5001 7.4974 11.6667 5.83073 11.6667H4.16406C2.4974 11.6667 1.66406 12.5001 1.66406 14.1667V15.8334C1.66406 17.5001 2.4974 18.3334 4.16406 18.3334Z" stroke="#868C98" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.9974 8.33341C6.83835 8.33341 8.33073 6.84103 8.33073 5.00008C8.33073 3.15913 6.83835 1.66675 4.9974 1.66675C3.15645 1.66675 1.66406 3.15913 1.66406 5.00008C1.66406 6.84103 3.15645 8.33341 4.9974 8.33341Z" stroke="#868C98" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.9974 18.3334C16.8383 18.3334 18.3307 16.841 18.3307 15.0001C18.3307 13.1591 16.8383 11.6667 14.9974 11.6667C13.1564 11.6667 11.6641 13.1591 11.6641 15.0001C11.6641 16.841 13.1564 18.3334 14.9974 18.3334Z" stroke="#868C98" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.99844 11.1917C11.4344 11.1917 12.5984 10.0276 12.5984 8.5917C12.5984 7.15576 11.4344 5.9917 9.99844 5.9917C8.5625 5.9917 7.39844 7.15576 7.39844 8.5917C7.39844 10.0276 8.5625 11.1917 9.99844 11.1917Z" stroke="#868C98" strokeWidth="1.5"/>
    <path d="M3.0148 7.07508C4.65646 -0.141583 15.3481 -0.13325 16.9815 7.08342C17.9398 11.3167 15.3065 14.9001 12.9981 17.1168C11.3231 18.7334 8.67313 18.7334 6.9898 17.1168C4.6898 14.9001 2.05646 11.3084 3.0148 7.07508Z" stroke="#868C98" strokeWidth="1.5"/>
  </svg>
);

const PriceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66406 9.5C6.66406 10.1417 7.16406 10.6667 7.7724 10.6667H9.0224C9.55573 10.6667 9.98906 10.2083 9.98906 9.65C9.98906 9.04167 9.7224 8.825 9.33073 8.68333L7.33073 7.98333C6.93073 7.84167 6.66406 7.625 6.66406 7.01667C6.66406 6.45833 7.0974 6 7.63073 6H8.88073C9.4974 6.00833 9.9974 6.525 9.9974 7.16667" fill="#868C98"/>
    <path d="M6.66406 9.5C6.66406 10.1417 7.16406 10.6667 7.7724 10.6667H9.0224C9.55573 10.6667 9.98906 10.2083 9.98906 9.65C9.98906 9.04167 9.7224 8.825 9.33073 8.68333L7.33073 7.98333C6.93073 7.84167 6.66406 7.625 6.66406 7.01667C6.66406 6.45833 7.0974 6 7.63073 6H8.88073C9.4974 6.00833 9.9974 6.525 9.9974 7.16667" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.33594 10.7083V11.3249" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.33594 5.34155V5.99155" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.3224 14.9834C11.9997 14.9834 14.9807 12.0024 14.9807 8.32508C14.9807 4.64779 11.9997 1.66675 8.3224 1.66675C4.6451 1.66675 1.66406 4.64779 1.66406 8.32508C1.66406 12.0024 4.6451 14.9834 8.3224 14.9834Z" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.8203 16.5666C11.5703 17.6249 12.7953 18.3166 14.1953 18.3166C16.4703 18.3166 18.3203 16.4666 18.3203 14.1916C18.3203 12.8083 17.637 11.5833 16.5953 10.8333" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CapacityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.63021 9.05841C7.54687 9.05008 7.44687 9.05008 7.35521 9.05841C5.37187 8.99175 3.79688 7.36675 3.79688 5.36675C3.79687 3.32508 5.44687 1.66675 7.49687 1.66675C9.53854 1.66675 11.1969 3.32508 11.1969 5.36675C11.1885 7.36675 9.61354 8.99175 7.63021 9.05841Z" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.6786 3.33325C15.2953 3.33325 16.5953 4.64159 16.5953 6.24992C16.5953 7.82492 15.3453 9.10825 13.787 9.16659C13.7203 9.15825 13.6453 9.15825 13.5703 9.16659" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.46563 12.1333C1.44896 13.4833 1.44896 15.6833 3.46563 17.0249C5.75729 18.5583 9.51563 18.5583 11.8073 17.0249C13.824 15.6749 13.824 13.4749 11.8073 12.1333C9.52396 10.6083 5.76562 10.6083 3.46563 12.1333Z" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.2812 16.6667C15.8813 16.5417 16.4479 16.3001 16.9146 15.9417C18.2146 14.9667 18.2146 13.3584 16.9146 12.3834C16.4562 12.0334 15.8979 11.8001 15.3063 11.6667" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChannelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.4974 18.3334H12.4974C16.6641 18.3334 18.3307 16.6667 18.3307 12.5V7.50002C18.3307 3.33335 16.6641 1.66669 12.4974 1.66669H7.4974C3.33073 1.66669 1.66406 3.33335 1.66406 7.50002V12.5C1.66406 16.6667 3.33073 18.3334 7.4974 18.3334Z" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 1.66669V18.3334" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.66406 10H18.3307" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RecipientsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.1302 9.05829C10.0469 9.04996 9.94688 9.04996 9.85521 9.05829C7.87187 8.99163 6.29688 7.36663 6.29688 5.36663C6.29687 3.32496 7.94688 1.66663 9.99688 1.66663C12.0385 1.66663 13.6969 3.32496 13.6969 5.36663C13.6885 7.36663 12.1135 8.99163 10.1302 9.05829Z" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.96563 12.1334C3.94896 13.4834 3.94896 15.6834 5.96563 17.025C8.25729 18.5584 12.0156 18.5584 14.3073 17.025C16.324 15.675 16.324 13.475 14.3073 12.1334C12.024 10.6084 8.26562 10.6084 5.96563 12.1334Z" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66406 1.66663V4.16663" stroke="#868C98" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.3359 1.66663V4.16663" stroke="#868C98" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.91406 7.57495H17.0807" stroke="#868C98" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5 7.08329V14.1666C17.5 16.6666 16.25 18.3333 13.3333 18.3333H6.66667C3.75 18.3333 2.5 16.6666 2.5 14.1666V7.08329C2.5 4.58329 3.75 2.91663 6.66667 2.91663H13.3333C16.25 2.91663 17.5 4.58329 17.5 7.08329Z" stroke="#868C98" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.99803 11.4167H10.0055" stroke="#868C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.91209 11.4167H6.91957" stroke="#868C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.91209 13.9167H6.91957" stroke="#868C98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const VehicleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.9276 2.35742H7.0776C5.0026 2.35742 4.54427 3.39076 4.2776 4.65742L3.33594 9.16576H16.6693L15.7276 4.65742C15.4609 3.39076 15.0026 2.35742 12.9276 2.35742Z" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.3214 16.516C18.413 17.491 17.6297 18.3327 16.6297 18.3327H15.063C14.163 18.3327 14.038 17.9493 13.8797 17.4743L13.713 16.9744C13.4797 16.291 13.3297 15.8327 12.1297 15.8327H7.86303C6.66303 15.8327 6.48803 16.3494 6.2797 16.9744L6.11303 17.4743C5.9547 17.9493 5.8297 18.3327 4.9297 18.3327H3.36303C2.36303 18.3327 1.5797 17.491 1.67136 16.516L2.13803 11.441C2.2547 10.191 2.49636 9.16602 4.6797 9.16602H15.313C17.4964 9.16602 17.738 10.191 17.8547 11.441L18.3214 16.516Z" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.33333 6.66602H2.5" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.4974 6.66602H16.6641" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 2.5V4.16667" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.75 4.16602H11.25" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12.5H7.5" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.5 12.5H15" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ActionsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66667 5.83334H17.5" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66667 10H17.5" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66667 14.1667H17.5" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 5.83334H3.33333" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 10H3.33333" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 14.1667H3.33333" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const getTabIcon = (id: string) => {
  const normalized = id.toLowerCase();
  if (normalized.includes('status')) return <StatusIcon />;
  if (normalized.includes('categor') || normalized.includes('bookingtype')) return <CategoryIcon />;
  if (normalized.includes('location')) return <LocationIcon />;
  if (normalized.includes('price')) return <PriceIcon />;
  if (normalized.includes('capacity')) return <CapacityIcon />;
  if (normalized.includes('channel')) return <ChannelIcon />;
  if (normalized.includes('recipient') || normalized.includes('customer')) return <RecipientsIcon />;
  if (normalized.includes('date') || normalized.includes('time')) return <DateIcon />;
  if (normalized.includes('vehicle')) return <VehicleIcon />;
  if (normalized.includes('action')) return <ActionsIcon />;
  
  // Default fallback dot icon
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="7" stroke="#868C98" strokeWidth="1.5"/>
    </svg>
  );
};

export default function FilterDropdown({ tabs, onClose = () => { }, onApply, initialFilters = {} }: FilterDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Default active tab is the first one
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  // Store selected values for all tabs
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>(initialFilters);

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

  const toggleValue = (tabId: string, value: string) => {
    setSelectedValues(prev => {
      const current = prev[tabId] || [];
      return {
        ...prev,
        [tabId]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value]
      };
    });
  };

  const handleClear = () => {
    setSelectedValues(prev => ({
      ...prev,
      [activeTab]: []
    }));
  };

  const handleApply = () => {
    onApply(selectedValues);
    onClose();
  };

  const activeTabObj = tabs.find(t => t.id === activeTab);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.sidebar}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className={styles.tabIcon}>
              {tab.icon || getTabIcon(tab.id)}
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
            {activeTabObj?.icon || (activeTabObj ? getTabIcon(activeTabObj.id) : null)}
          </div>
          {activeTabObj?.label}
        </div>
        <div className={styles.body}>
          {activeTabObj?.renderContent ? (
            activeTabObj.renderContent(selectedValues[activeTab] || [], (val) => toggleValue(activeTab, val))
          ) : activeTabObj?.options ? (
            <div className={styles.grid}>
              {activeTabObj.options.map(option => (
                <label key={option} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={(selectedValues[activeTab] || []).includes(option)}
                    onChange={() => toggleValue(activeTab, option)}
                  />
                  {option}
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
