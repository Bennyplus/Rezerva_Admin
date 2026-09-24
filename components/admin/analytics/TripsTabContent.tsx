"use client";

import { useState, useEffect } from "react";
import styles from "./TripsTabContent.module.css";

interface TripMetricRow {
  id: string;
  origin: string;
  destination: string;
  trips: number;
  avgOccupancy: number;
  avgDistance: string;
  completionRate: string;
}

const DEFAULT_TRIP_ROWS: TripMetricRow[] = [
  {
    id: "1",
    origin: "Yaba",
    destination: "Victoria Island",
    trips: 10,
    avgOccupancy: 3.5,
    avgDistance: "11.2 km",
    completionRate: "1.2%",
  },
  {
    id: "2",
    origin: "Frebson",
    destination: "Ikoyi",
    trips: 25,
    avgOccupancy: 2,
    avgDistance: "17 km",
    completionRate: "1.3%",
  },
  {
    id: "3",
    origin: "Yaba",
    destination: "Victoria Island",
    trips: 100,
    avgOccupancy: 4,
    avgDistance: "100 km",
    completionRate: "2%",
  },
];

export default function TripsTabContent() {
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

  const filteredRows = DEFAULT_TRIP_ROWS.filter((r) => {
    const fullRoute = `${r.origin} ${r.destination}`.toLowerCase();
    return fullRoute.includes(searchQuery.toLowerCase());
  });

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
              <th>Route</th>
              <th>Trips</th>
              <th>Average Occupancy</th>
              <th>Average Distance</th>
              <th>Completion Rate</th>
              <th className={styles.actionsCol}></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                {/* Route: Origin → Destination */}
                <td>
                  <div className={styles.routeCell}>
                    <span>{row.origin}</span>
                    <span className={styles.routeArrow}>
                      <ArrowRightIcon />
                    </span>
                    <span>{row.destination}</span>
                  </div>
                </td>

                {/* Trips */}
                <td style={{ color: "#111827" }}>{row.trips}</td>

                {/* Average Occupancy */}
                <td style={{ color: "#111827" }}>{row.avgOccupancy}</td>

                {/* Average Distance */}
                <td style={{ color: "#111827" }}>{row.avgDistance}</td>

                {/* Completion Rate */}
                <td style={{ color: "#111827" }}>{row.completionRate}</td>

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
                          View Details
                        </button>
                        <button
                          type="button"
                          className={styles.kebabMenuItem}
                          onClick={() => setOpenMenuId(null)}
                        >
                          Export Route
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

function ArrowRightIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
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
