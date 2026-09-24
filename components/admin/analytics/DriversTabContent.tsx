"use client";

import { useState, useEffect } from "react";
import styles from "./TripsTabContent.module.css";

interface DriverMetricRow {
  id: string;
  driver: string;
  rating: number;
  acceptanceRate: string;
  cancellationRate: string;
  trips: number;
  earnings: string;
}

const DEFAULT_DRIVER_ROWS: DriverMetricRow[] = [
  {
    id: "1",
    driver: "Prosper Edward",
    rating: 3,
    acceptanceRate: "3.5%",
    cancellationRate: "11.2%",
    trips: 34,
    earnings: "$67",
  },
  {
    id: "2",
    driver: "Prosper Edward",
    rating: 1,
    acceptanceRate: "2%",
    cancellationRate: "17%",
    trips: 130,
    earnings: "$23",
  },
  {
    id: "3",
    driver: "Prosper Edward",
    rating: 5,
    acceptanceRate: "4%",
    cancellationRate: "2%",
    trips: 200,
    earnings: "$40",
  },
];

export default function DriversTabContent() {
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

  const filteredRows = DEFAULT_DRIVER_ROWS.filter((r) =>
    r.driver.toLowerCase().includes(searchQuery.toLowerCase()),
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
              <th>Driver</th>
              <th>Ratings</th>
              <th>Acceptance Rate</th>
              <th>Cancellation Rate</th>
              <th>Trips</th>
              <th>Earnings</th>
              <th className={styles.actionsCol}></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                {/* Driver */}
                <td style={{ fontWeight: 500, color: "#111827" }}>
                  {row.driver}
                </td>

                {/* Ratings with Solid Blue Star */}
                <td>
                  <div className={styles.starRating}>
                    <SolidBlueStarIcon />
                    <span>{row.rating}</span>
                  </div>
                </td>

                {/* Acceptance Rate */}
                <td style={{ color: "#111827" }}>{row.acceptanceRate}</td>

                {/* Cancellation Rate */}
                <td style={{ color: "#111827" }}>{row.cancellationRate}</td>

                {/* Trips */}
                <td style={{ color: "#111827" }}>{row.trips}</td>

                {/* Earnings */}
                <td style={{ color: "#111827", fontWeight: 500 }}>
                  {row.earnings}
                </td>

                {/* Actions */}
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
                          View Driver
                        </button>
                        <button
                          type="button"
                          className={styles.kebabMenuItem}
                          onClick={() => setOpenMenuId(null)}
                        >
                          Export History
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

function SolidBlueStarIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="#2F68FE"
      stroke="#2F68FE"
      strokeWidth={1}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
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
