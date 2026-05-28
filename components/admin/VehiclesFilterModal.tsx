import React, { useState, useEffect } from 'react';
import styles from './VehiclesFilterModal.module.css';

interface VehiclesFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, string>) => void;
  initialFilters: Record<string, string>;
  categoriesMap?: Record<string, string>; // e.g. { '1': 'Sedan', '2': 'SUV' }
}

type FilterCategory = 'status' | 'category' | 'location' | 'capacity' | 'fuel_type' | 'transmission';

export default function VehiclesFilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  categoriesMap = {}
}: VehiclesFilterModalProps) {
  const [activeTab, setActiveTab] = useState<FilterCategory>('status');
  
  // Local state for all filters
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [locationValue, setLocationValue] = useState('');
  const [capacityFilters, setCapacityFilters] = useState<string[]>([]);
  const [fuelFilters, setFuelFilters] = useState<string[]>([]);
  const [transmissionFilters, setTransmissionFilters] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Initialize state from initialFilters (comma separated values)
      setStatusFilters(initialFilters.status ? initialFilters.status.split(',') : []);
      setCategoryFilters(initialFilters.category ? initialFilters.category.split(',') : []);
      setLocationValue(initialFilters.location || '');
      setCapacityFilters(initialFilters.seats ? initialFilters.seats.split(',') : []);
      setFuelFilters(initialFilters.fuel_type ? initialFilters.fuel_type.split(',') : []);
      setTransmissionFilters(initialFilters.transmission ? initialFilters.transmission.split(',') : []);
      setActiveTab('status');
    }
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  const handleCheckboxToggle = (
    currentList: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (currentList.includes(value)) {
      setList(currentList.filter(item => item !== value));
    } else {
      setList([...currentList, value]);
    }
  };

  const handleClear = () => {
    setStatusFilters([]);
    setCategoryFilters([]);
    setLocationValue('');
    setCapacityFilters([]);
    setFuelFilters([]);
    setTransmissionFilters([]);
  };

  const handleApply = () => {
    const newFilters: Record<string, string> = {};
    if (statusFilters.length > 0) newFilters.status = statusFilters.join(',');
    if (categoryFilters.length > 0) newFilters.category = categoryFilters.join(',');
    if (locationValue.trim()) newFilters.location = locationValue.trim();
    if (capacityFilters.length > 0) newFilters.seats = capacityFilters.join(',');
    if (fuelFilters.length > 0) newFilters.fuel_type = fuelFilters.join(',');
    if (transmissionFilters.length > 0) newFilters.transmission = transmissionFilters.join(',');
    
    onApply(newFilters);
    onClose();
  };

  // Extract category names from map, or fallback
  const categoryOptions = Object.values(categoriesMap).length > 0 
    ? Array.from(new Set(Object.values(categoriesMap))) 
    : ['Sedan', 'SUV', 'Truck', 'Van', 'Coupe', 'Hatchback'];

  const TABS: { id: FilterCategory; label: string }[] = [
    { id: 'status', label: 'Status' },
    { id: 'category', label: 'Category' },
    { id: 'location', label: 'Location' },
    { id: 'capacity', label: 'Capacity' },
    { id: 'fuel_type', label: 'Fuel Type' },
    { id: 'transmission', label: 'Transmission' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'status':
        return (
          <div className={styles.optionsList}>
            {['available', 'booked', 'maintenance'].map(status => (
              <label key={status} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={statusFilters.includes(status)}
                  onChange={() => handleCheckboxToggle(statusFilters, setStatusFilters, status)}
                />
                <span style={{textTransform: 'capitalize'}}>{status}</span>
              </label>
            ))}
          </div>
        );
      case 'category':
        return (
          <div className={styles.optionsList}>
            {categoryOptions.map(cat => (
              <label key={cat} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={categoryFilters.includes(cat.toLowerCase())}
                  onChange={() => handleCheckboxToggle(categoryFilters, setCategoryFilters, cat.toLowerCase())}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        );
      case 'location':
        return (
          <div className={styles.optionsList}>
            <input
              type="text"
              placeholder="e.g. Lagos, Abuja"
              className={styles.textInput}
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
            />
          </div>
        );
      case 'capacity':
        return (
          <div className={styles.optionsList}>
            {['2', '4', '5', '7', '8+'].map(cap => (
              <label key={cap} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={capacityFilters.includes(cap)}
                  onChange={() => handleCheckboxToggle(capacityFilters, setCapacityFilters, cap)}
                />
                <span>{cap} Seats</span>
              </label>
            ))}
          </div>
        );
      case 'fuel_type':
        return (
          <div className={styles.optionsList}>
            {['petrol', 'diesel', 'electric', 'hybrid'].map(fuel => (
              <label key={fuel} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={fuelFilters.includes(fuel)}
                  onChange={() => handleCheckboxToggle(fuelFilters, setFuelFilters, fuel)}
                />
                <span style={{textTransform: 'capitalize'}}>{fuel}</span>
              </label>
            ))}
          </div>
        );
      case 'transmission':
        return (
          <div className={styles.optionsList}>
            {['automatic', 'manual'].map(trans => (
              <label key={trans} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={transmissionFilters.includes(trans)}
                  onChange={() => handleCheckboxToggle(transmissionFilters, setTransmissionFilters, trans)}
                />
                <span style={{textTransform: 'capitalize'}}>{trans}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderIcon = (tabId: string) => {
    switch (tabId) {
      case 'status':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9" strokeDasharray="13 5.84" /></svg>;
      case 'category':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
      case 'location':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
      case 'capacity':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
      case 'fuel_type':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22v-8c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v8"/><path d="M14 12V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v8"/><path d="M12 2v10"/><path d="M10 6h4"/></svg>;
      case 'transmission':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
      default:
        return null;
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.body}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`${styles.sidebarItem} ${activeTab === tab.id ? styles.sidebarItemActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className={styles.sidebarItemIcon}>
                  {renderIcon(tab.id)}
                  {tab.label}
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className={styles.content}>
            <div className={styles.contentHeader}>
              {renderIcon(activeTab)}
              {TABS.find(t => t.id === activeTab)?.label}
            </div>
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
          <button className={styles.applyBtn} onClick={handleApply}>Apply</button>
        </div>
      </div>
    </div>
  );
}
