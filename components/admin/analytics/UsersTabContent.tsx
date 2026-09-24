"use client";

import { useState, useEffect } from "react";
import styles from "./UsersTabContent.module.css";

interface UserMetricRow {
  id: string;
  period: string;
  newUsers: number | string;
  activeUsers: number | string;
  retention: string;
  churn: string;
}

const DEFAULT_ROWS: UserMetricRow[] = [
  {
    id: "1",
    period: "Today",
    newUsers: 10,
    activeUsers: 1000,
    retention: "92%",
    churn: "1.2%",
  },
  {
    id: "2",
    period: "This Week",
    newUsers: 25,
    activeUsers: 1100,
    retention: "17%",
    churn: "1.3%",
  },
  {
    id: "3",
    period: "July 2026",
    newUsers: 100,
    activeUsers: 1125,
    retention: "100%",
    churn: "2%",
  },
];

export default function UsersTabContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  const filteredRows = DEFAULT_ROWS.filter((r) =>
    r.period.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles.container}>
      {/* ── Toolbar (Screenshot) ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <button type="button" className={styles.toolBtn}>
          <FilterIcon />
          Filter
        </button>

        <button type="button" className={styles.toolBtn}>
          <SortIcon />
          Sort By
        </button>
      </div>

      {/* ── Table (Screenshot) ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Period</th>
              <th>New Users</th>
              <th>Active Users</th>
              <th>Retention</th>
              <th>Churn</th>
              <th className={styles.actionsCol}></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td style={{ fontWeight: 500, color: "#111827" }}>
                  {row.period}
                </td>
                <td style={{ color: "#111827" }}>{row.newUsers}</td>
                <td style={{ color: "#111827" }}>{row.activeUsers}</td>
                <td style={{ color: "#111827" }}>{row.retention}</td>
                <td style={{ color: "#111827" }}>{row.churn}</td>
                <td className={styles.actionsCol}>
                  <div
                    className={styles.kebabWrapper}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className={styles.moreBtn}
                      aria-label="Actions"
                      onClick={() =>
                        setOpenMenuId(openMenuId === row.id ? null : row.id)
                      }
                    >
                      <MoreVerticalIcon />
                    </button>

                    {openMenuId === row.id && (
                      <div className={styles.kebabMenu}>
                        <button
                          type="button"
                          className={styles.kebabMenuItem}
                          onClick={() => setOpenMenuId(null)}
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          className={styles.kebabMenuItem}
                          onClick={() => setOpenMenuId(null)}
                        >
                          Export Period
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#868C98"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
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
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  );
}

function SortIcon() {
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
    >
      <path d="M7 3v14" />
      <path d="M3 7l4-4 4 4" />
      <path d="M17 21V7" />
      <path d="M21 17l-4 4-4-4" />
    </svg>
  );
}

function MoreVerticalIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
