"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./CustomSelect.module.css";

interface Option {
  value: string;
  label: string;
  icon?: string | React.ReactNode;
}

interface CustomSelectProps {
  name: string;
  value: string;
  placeholder: string;
  options: Option[];
  onChange: (name: string, value: string) => void;
  showSearch?: boolean;
  variant?: 'default' | 'minimal';
  multiple?: boolean;
}

export default function CustomSelect({
  name,
  value,
  placeholder,
  options,
  onChange,
  showSearch = false,
  variant = 'default',
  multiple = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(""); // Reset search on close
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedValues = multiple ? (value ? value.split(',').map((v) => v.trim()) : []) : [];
  const selectedOption = !multiple ? options.find((opt) => opt.value === value) : null;
  const selectedOptions = multiple ? options.filter((opt) => selectedValues.includes(opt.value)) : [];

  const filteredOptions = options.filter((opt) =>
    opt?.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container} ref={containerRef} style={{ zIndex: isOpen ? 50 : 1 }}>
      <div
        className={`${styles.trigger} ${isOpen ? styles.triggerActive : ""} ${variant === 'minimal' ? styles.triggerMinimal : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={(multiple ? selectedOptions.length > 0 : selectedOption) ? styles.value : styles.placeholder}>
          {multiple
            ? (selectedOptions.length > 0 ? selectedOptions.map(o => o.label).join(', ') : placeholder)
            : (selectedOption ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {selectedOption.icon && (typeof selectedOption.icon === 'string' ? <img src={selectedOption.icon as string} alt="" style={{ width: 20, height: 20, objectFit: 'cover', borderRadius: '50%' }} /> : selectedOption.icon)}
                {selectedOption.label}
              </div>
            ) : placeholder)}
        </span>
        <ChevronDownIcon isOpen={isOpen} />
      </div>

      {isOpen && (
        <ul className={styles.menu}>
          {/* Search Box */}
          {showSearch && (
            <div className={styles.searchWrapper}>
              <SearchIcon />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()} // Prevent closing menu
                autoFocus
              />
            </div>
          )}

          <div className={styles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = multiple ? selectedValues.includes(option.value) : value === option.value;
                return (
                  <li
                    key={option.value}
                    className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                    onClick={(e) => {
                      if (multiple) {
                        e.stopPropagation();
                        const newValues = isSelected
                          ? selectedValues.filter(v => v !== option.value)
                          : [...selectedValues, option.value];
                        onChange(name, newValues.join(','));
                      } else {
                        onChange(name, option.value);
                        setIsOpen(false);
                        setSearchTerm("");
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {option.icon && (typeof option.icon === 'string' ? <img src={option.icon as string} alt="" style={{ width: 20, height: 20, objectFit: 'cover', borderRadius: '50%' }} /> : option.icon)}
                      {option.label}
                    </div>
                    {isSelected && <CheckIcon />}
                  </li>
                );
              })
            ) : (
              <li className={styles.noResults}>No results found</li>
            )}
          </div>
        </ul>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: "#868C98" }}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
        color: "#868C98",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: "#111111" }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
