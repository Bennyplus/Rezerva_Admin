"use client";

import { useState, useEffect, useMemo } from "react";
import Pagination from "@/components/admin/Pagination";
import { EmergencyIncident } from "@/services/emergency-incidents-service";
import styles from "./EmergencyIncidentsTable.module.css";

interface EmergencyIncidentsTableProps {
  incidents: EmergencyIncident[];
  onSelectIncident: (incident: EmergencyIncident) => void;
}

type SortOption =
  | "default"
  | "newest"
  | "oldest"
  | "priority"
  | "priority_low"
  | "status";

const SORT_OPTIONS: { label: string; val: SortOption }[] = [
  { label: "Default", val: "default" },
  { label: "Newest First", val: "newest" },
  { label: "Oldest First", val: "oldest" },
];

function parseTimestamp(val: any): number {
  if (!val) return 0;
  if (typeof val === "number") return val;
  if (typeof val !== "string") return 0;

  const trimmed = val.trim();
  if (!trimmed) return 0;

  // 1. Try standard Date.parse (works for ISO strings like "2026-09-22T16:59:32.624Z")
  let time = Date.parse(trimmed);
  if (!isNaN(time)) return time;

  // 2. Fix missing space before AM/PM: e.g. "11 May 2026 11:34AM" -> "11 May 2026 11:34 AM"
  const withAmPmSpace = trimmed.replace(
    /(\d{1,2}:\d{2}(?::\d{2})?)\s*([ap]m)/i,
    "$1 $2",
  );
  time = Date.parse(withAmPmSpace);
  if (!isNaN(time)) return time;

  // 3. Handle "DD/MM/YYYY" or "DD-MM-YYYY" formats
  const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(.*)$/);
  if (dmyMatch) {
    const [, day, month, year, rest] = dmyMatch;
    const isoLike = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}${rest || ""}`;
    time = Date.parse(isoLike);
    if (!isNaN(time)) return time;
  }

  return 0;
}

function getPriorityWeight(priority?: string): number {
  if (!priority) return 0;
  const p = priority.toString().trim().toLowerCase();
  if (p === "critical" || p === "urgent") return 4;
  if (p === "high") return 3;
  if (p === "medium") return 2;
  if (p === "low") return 1;
  return 0;
}

export default function EmergencyIncidentsTable({
  incidents = [],
  onSelectIncident,
}: EmergencyIncidentsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Close menus when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setOpenMenuId(null);
      setIsFilterOpen(false);
      setIsSortOpen(false);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const filteredIncidents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const result = [...incidents].filter((item) => {
      const matchQuery =
        !query ||
        item.sosId?.toLowerCase().includes(query) ||
        item.triggeredBy?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.userType?.toLowerCase().includes(query) ||
        item.priority?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query);

      const matchPriority =
        priorityFilter === "All" ||
        (item.priority &&
          item.priority.toString().toLowerCase() ===
            priorityFilter.toLowerCase());

      return matchQuery && matchPriority;
    });

    if (sortBy === "priority") {
      result.sort((a, b) => {
        const diff =
          getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
        if (diff !== 0) return diff;
        return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
      });
    } else if (sortBy === "priority_low") {
      result.sort((a, b) => {
        const diff =
          getPriorityWeight(a.priority) - getPriorityWeight(b.priority);
        if (diff !== 0) return diff;
        return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
      });
    } else if (sortBy === "newest") {
      result.sort((a, b) => {
        const timeA = parseTimestamp(a.timestamp);
        const timeB = parseTimestamp(b.timestamp);
        if (timeA && timeB && timeA !== timeB) {
          return timeB - timeA;
        }
        const idA =
          typeof a.id === "number"
            ? a.id
            : parseInt(String(a.id).replace(/\D/g, ""), 10) || 0;
        const idB =
          typeof b.id === "number"
            ? b.id
            : parseInt(String(b.id).replace(/\D/g, ""), 10) || 0;
        return idB - idA;
      });
    } else if (sortBy === "oldest") {
      result.sort((a, b) => {
        const timeA = parseTimestamp(a.timestamp);
        const timeB = parseTimestamp(b.timestamp);
        if (timeA && timeB && timeA !== timeB) {
          return timeA - timeB;
        }
        const idA =
          typeof a.id === "number"
            ? a.id
            : parseInt(String(a.id).replace(/\D/g, ""), 10) || 0;
        const idB =
          typeof b.id === "number"
            ? b.id
            : parseInt(String(b.id).replace(/\D/g, ""), 10) || 0;
        return idA - idB;
      });
    } else if (sortBy === "status") {
      result.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
    }

    return result;
  }, [incidents, searchQuery, priorityFilter, sortBy]);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage) || 1;
  const paginatedIncidents = filteredIncidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const activeSortLabel =
    SORT_OPTIONS.find((opt) => opt.val === sortBy)?.label || "Sort by";

  return (
    <div className={styles.container}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />
        </div>

        {/* ── Filter Button ── */}
        <div
          className={styles.toolBtnWrap}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={`${styles.toolBtn} ${priorityFilter !== "All" ? styles.toolBtnActive : ""}`}
            onClick={() => {
              setIsFilterOpen((v) => !v);
              setIsSortOpen(false);
            }}
          >
            <FilterIcon />
            {priorityFilter === "All" ? "Filter" : `${priorityFilter} Priority`}
          </button>
          {isFilterOpen && (
            <div className={styles.popover}>
              {["All", "High", "Medium", "Low"].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`${styles.popoverItem} ${priorityFilter === p ? styles.popoverItemActive : ""}`}
                  onClick={() => {
                    setPriorityFilter(p);
                    setIsFilterOpen(false);
                    setCurrentPage(1);
                  }}
                >
                  {p === "All" ? "All Priorities" : `${p} Priority`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Sort Button ── */}
        <div
          className={styles.toolBtnWrap}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={`${styles.toolBtn} ${sortBy !== "default" ? styles.toolBtnActive : ""}`}
            onClick={() => {
              setIsSortOpen((v) => !v);
              setIsFilterOpen(false);
            }}
          >
            <SortIcon />
            {sortBy === "default" ? "Sort by" : activeSortLabel}
          </button>
          {isSortOpen && (
            <div className={styles.popover}>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  className={`${styles.popoverItem} ${sortBy === opt.val ? styles.popoverItemActive : ""}`}
                  onClick={() => {
                    setSortBy(opt.val);
                    setIsSortOpen(false);
                    setCurrentPage(1);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>SOS ID</th>
              <th>Triggered By</th>
              <th>User Type</th>
              <th>Priority</th>
              <th>Location</th>
              <th>Status</th>
              <th className={styles.actionsCol}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedIncidents.map((row) => {
              const pLower = (row.priority || "").toString().toLowerCase();
              const isHigh =
                pLower === "high" ||
                pLower === "critical" ||
                pLower === "urgent";
              const isMed = pLower === "medium";
              const priorityClass = isHigh
                ? styles.priorityHigh
                : isMed
                  ? styles.priorityMedium
                  : styles.priorityLow;
              const flagColor = isHigh
                ? "#DC2626"
                : isMed
                  ? "#EA580C"
                  : "#2563EB";

              return (
                <tr key={row.id} onClick={() => onSelectIncident(row)}>
                  <td>{row.timestamp || "—"}</td>
                  <td className={styles.sosId}>{row.sosId || "—"}</td>
                  <td>{row.triggeredBy || "—"}</td>
                  <td>{row.userType || "—"}</td>
                  <td>
                    <span className={priorityClass}>
                      <FlagIcon fill={flagColor} />
                      {row.priority || "Low"}
                    </span>
                  </td>
                  <td>{row.location || "—"}</td>
                  <td>
                    <span className={styles.statusActive}>
                      <span className={styles.statusDot} />
                      {row.status || "Active"}
                    </span>
                  </td>
                  <td
                    className={styles.actionsCol}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div className={styles.kebabWrapper}>
                      <button
                        type="button"
                        className={styles.moreBtn}
                        aria-label="Actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId((prev) =>
                            prev === row.id ? null : row.id,
                          );
                        }}
                      >
                        <MoreVerticalIcon />
                      </button>
                      {openMenuId === row.id && (
                        <div
                          className={styles.kebabMenu}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <button
                            type="button"
                            className={styles.kebabMenuItem}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              onSelectIncident(row);
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredIncidents.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.emptyRow}>
                  No emergency incidents found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          resultsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
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
      <circle cx={11} cy={11} r={8} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
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
      <line x1={4} y1={6} x2={20} y2={6} />
      <line x1={7} y1={12} x2={17} y2={12} />
      <line x1={10} y1={18} x2={14} y2={18} />
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
function FlagIcon({ fill = "#2563EB" }: { fill?: string }) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={fill}
      strokeWidth={1}
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
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
      <circle cx={12} cy={5} r={1} />
      <circle cx={12} cy={12} r={1} />
      <circle cx={12} cy={19} r={1} />
    </svg>
  );
}
