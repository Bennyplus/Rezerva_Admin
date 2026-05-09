"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./CustomDateTimePicker.module.css";

interface CustomDateTimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
}

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
];

const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THUR", "FRI", "SAT", "SUN"];

export default function CustomDateTimePicker({ value, onChange }: CustomDateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Use the value or default to current date
  const [currentDate, setCurrentDate] = useState<Date>(value || new Date());
  
  // Track the month and year being viewed in the calendar
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());

  // Time state
  const [hours, setHours] = useState(() => {
    let h = currentDate.getHours();
    return h % 12 === 0 ? 12 : h % 12;
  });
  const [minutes, setMinutes] = useState(currentDate.getMinutes());
  const [amPm, setAmPm] = useState<"AM" | "PM">(currentDate.getHours() >= 12 ? "PM" : "AM");

  // Dropdown states for month/year selectors
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsMonthDropdownOpen(false);
        setIsYearDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setCurrentDate(value);
      setViewMonth(value.getMonth());
      setViewYear(value.getFullYear());
      let h = value.getHours();
      setAmPm(h >= 12 ? "PM" : "AM");
      setHours(h % 12 === 0 ? 12 : h % 12);
      setMinutes(value.getMinutes());
    }
  }, [value]);

  const updateParent = (newDate: Date, h: number, m: number, ap: "AM" | "PM") => {
    const updated = new Date(newDate);
    let realHours = h;
    if (ap === "PM" && h < 12) realHours += 12;
    if (ap === "AM" && h === 12) realHours = 0;
    
    updated.setHours(realHours);
    updated.setMinutes(m);
    onChange(updated);
  };

  const handleDateClick = (day: number, isCurrentMonth: boolean, offsetMonth: number = 0) => {
    let targetMonth = viewMonth + offsetMonth;
    let targetYear = viewYear;

    if (targetMonth < 0) {
      targetMonth = 11;
      targetYear -= 1;
    } else if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }

    const newDate = new Date(targetYear, targetMonth, day);
    setCurrentDate(newDate);
    if (!isCurrentMonth) {
      setViewMonth(targetMonth);
      setViewYear(targetYear);
    }
    updateParent(newDate, hours, minutes, amPm);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeStr = e.target.value;
    const [hStr, mStr] = timeStr.split(":");
    let h = parseInt(hStr, 10);
    let m = parseInt(mStr, 10);
    
    if (isNaN(h)) h = 12;
    if (isNaN(m)) m = 0;
    
    // Validate bounds
    if (h > 12) h = 12;
    if (h < 1) h = 1;
    if (m > 59) m = 59;
    if (m < 0) m = 0;

    setHours(h);
    setMinutes(m);
  };

  const handleTimeBlur = () => {
    updateParent(currentDate, hours, minutes, amPm);
  };

  const handleAmPmToggle = (newAmPm: "AM" | "PM") => {
    setAmPm(newAmPm);
    updateParent(currentDate, hours, minutes, newAmPm);
  };

  // Generate calendar grid
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Monday start (0=Sun -> 6, 1=Mon -> 0, etc.)
  };

  const daysInCurrentMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
  const daysInPrevMonth = getDaysInMonth(viewMonth - 1 < 0 ? 11 : viewMonth - 1, viewMonth - 1 < 0 ? viewYear - 1 : viewYear);

  const gridDays = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    gridDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false, offset: -1 });
  }
  
  // Current month days
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    gridDays.push({ day: i, isCurrentMonth: true, offset: 0 });
  }
  
  // Next month days
  const remainingCells = 42 - gridDays.length; // 6 rows * 7 cols
  for (let i = 1; i <= remainingCells; i++) {
    gridDays.push({ day: i, isCurrentMonth: false, offset: 1 });
  }

  const formatDisplayDate = (d: Date) => {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div 
        className={styles.inputBox} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.inputText}>
          {formatDisplayDate(currentDate)}
        </span>
        <CalendarIcon />
      </div>

      {isOpen && (
        <div className={styles.popover}>
          {/* Header Selectors */}
          <div className={styles.header}>
            <div className={styles.dropdownWrapper}>
              <button 
                className={styles.selectorBtn} 
                onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              >
                {MONTHS[viewMonth]} <ChevronRightIcon />
              </button>
              {isMonthDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {MONTHS.map((m, i) => (
                    <div 
                      key={m} 
                      className={styles.dropdownItem}
                      onClick={() => {
                        setViewMonth(i);
                        setIsMonthDropdownOpen(false);
                      }}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.dropdownWrapper}>
              <button 
                className={styles.selectorBtn}
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              >
                {viewYear} <ChevronRightIcon />
              </button>
              {isYearDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {[viewYear - 2, viewYear - 1, viewYear, viewYear + 1, viewYear + 2, viewYear + 3].map((y) => (
                    <div 
                      key={y} 
                      className={styles.dropdownItem}
                      onClick={() => {
                        setViewYear(y);
                        setIsYearDropdownOpen(false);
                      }}
                    >
                      {y}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className={styles.calendar}>
            <div className={styles.weekDays}>
              {DAYS_OF_WEEK.map(d => <span key={d}>{d}</span>)}
            </div>
            <div className={styles.daysGrid}>
              {gridDays.map((item, idx) => {
                const isSelected = item.isCurrentMonth && 
                                   item.day === currentDate.getDate() && 
                                   viewMonth === currentDate.getMonth() && 
                                   viewYear === currentDate.getFullYear();
                
                return (
                  <button
                    key={idx}
                    className={`${styles.dayBtn} ${!item.isCurrentMonth ? styles.dayOut : ""} ${isSelected ? styles.daySelected : ""}`}
                    onClick={() => handleDateClick(item.day, item.isCurrentMonth, item.offset)}
                  >
                    {item.day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Section */}
          <div className={styles.timeSection}>
            <span className={styles.timeLabel}>Time</span>
            <div className={styles.timeControls}>
              <div className={styles.timeInputWrapper}>
                <input 
                  type="text" 
                  value={timeString}
                  onChange={handleTimeChange}
                  onBlur={handleTimeBlur}
                  className={styles.timeInput}
                  maxLength={5}
                />
              </div>
              <div className={styles.amPmToggle}>
                <button 
                  className={`${styles.amPmBtn} ${amPm === "AM" ? styles.amPmActive : ""}`}
                  onClick={() => handleAmPmToggle("AM")}
                >
                  AM
                </button>
                <button 
                  className={`${styles.amPmBtn} ${amPm === "PM" ? styles.amPmActive : ""}`}
                  onClick={() => handleAmPmToggle("PM")}
                >
                  PM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#868C98" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
