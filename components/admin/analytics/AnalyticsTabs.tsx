"use client";

import styles from "./AnalyticsTabs.module.css";

export type AnalyticsTabType =
  | "Overview"
  | "Finance"
  | "Users"
  | "Trips"
  | "Drivers"
  | "Passengers";

const TABS: AnalyticsTabType[] = [
  "Overview",
  "Finance",
  "Users",
  "Trips",
  "Drivers",
  "Passengers",
];

interface AnalyticsTabsProps {
  activeTab: AnalyticsTabType;
  onTabChange: (tab: AnalyticsTabType) => void;
  showToolbar?: boolean;
  selectedTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
  onExport?: () => void;
}

export default function AnalyticsTabs({
  activeTab,
  onTabChange,
  showToolbar = true,
  selectedTimeframe = "Today",
  onTimeframeChange,
  onExport,
}: AnalyticsTabsProps) {
  return (
    <div className={styles.container}>
      <ul className={styles.tabsList} role="tablist">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <li key={tab} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.tabBtn} ${
                  isActive ? styles.tabBtnActive : ""
                }`}
                onClick={() => onTabChange(tab)}
              >
                {tab}
              </button>
            </li>
          );
        })}
      </ul>

      {showToolbar && (
        <div className={styles.toolbarRight}>
          <button
            type="button"
            className={styles.dateSelect}
            onClick={() => onTimeframeChange?.("Today")}
          >
            <span>{selectedTimeframe}</span>
            <ChevronDownIcon />
          </button>

          <button
            type="button"
            className={styles.exportBtn}
            onClick={onExport}
          >
            Export
          </button>
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
