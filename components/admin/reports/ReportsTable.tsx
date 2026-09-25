"use client";

import { useState, useEffect, useMemo } from "react";
import Pagination from "@/components/admin/Pagination";
import { ReportTicket, ReportPriority } from "@/services/reports-service";
import styles from "./ReportsTable.module.css";

interface ReportsTableProps {
  reports: ReportTicket[];
  onSelectReport: (report: ReportTicket) => void;
  onUpdateStatus?: (report: ReportTicket, status: string) => void;
  onEscalate?: (report: ReportTicket) => void;
}

export default function ReportsTable({
  reports = [],
  onSelectReport,
  onUpdateStatus,
  onEscalate,
}: ReportsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleGlobalClick = () => {
      setOpenMenuId(null);
      setIsFilterOpen(false);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const filteredReports = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return reports.filter((item) => {
      const matchQuery =
        !query ||
        item.reportId?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.reportedUser?.toLowerCase().includes(query) ||
        item.userType?.toLowerCase().includes(query) ||
        item.date?.toLowerCase().includes(query);

      const matchPriority = priorityFilter === "All" || item.priority === priorityFilter;
      return matchQuery && matchPriority;
    });
  }, [reports, searchQuery, priorityFilter]);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage) || 1;
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("review")) return styles.statusUnderReview;
    if (s.includes("closed")) return styles.statusClosed;
    return styles.statusResolved;
  };

  const getPriorityStyle = (priority: ReportPriority) => {
    if (priority === "High") return { class: styles.priorityHigh, color: "#DC2626" };
    if (priority === "Medium") return { class: styles.priorityMedium, color: "#EA580C" };
    return { class: styles.priorityLow, color: "#2563EB" };
  };

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

        <div className={styles.toolBtnWrap} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`${styles.toolBtn} ${priorityFilter !== "All" ? styles.toolBtnActive : ""}`}
            onClick={() => setIsFilterOpen((v) => !v)}
          >
            <FilterIcon />
            {priorityFilter === "All" ? "Filter" : priorityFilter}
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
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Report ID</th>
              <th>Category</th>
              <th>User Type</th>
              <th>Priority</th>
              <th>Reported User</th>
              <th>Status</th>
              <th className={styles.actionsCol}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedReports.map((row) => {
              const priorityData = getPriorityStyle(row.priority);

              return (
                <tr key={row.id} onClick={() => onSelectReport(row)}>
                  <td>{row.date || "—"}</td>
                  <td className={styles.reportId}>{row.reportId || "—"}</td>
                  <td>{row.category || "—"}</td>
                  <td>{row.userType || "—"}</td>
                  <td>
                    <span className={priorityData.class}>
                      <FlagIcon fill={priorityData.color} />
                      {row.priority || "Low"}
                    </span>
                  </td>
                  <td>{row.reportedUser || "—"}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(row.status)}`}>
                      <span className={styles.statusDot} />
                      {row.status || "Under Review"}
                    </span>
                  </td>
                  <td
                    className={styles.actionsCol}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.kebabWrapper}>
                      <button
                        type="button"
                        className={styles.moreBtn}
                        aria-label="Actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId((prev) => (prev === row.id ? null : row.id));
                        }}
                      >
                        <MoreVerticalIcon />
                      </button>

                      {openMenuId === row.id && (
                        <div
                          className={styles.kebabMenu}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className={styles.kebabMenuItem}
                            onClick={() => {
                              setOpenMenuId(null);
                              onSelectReport(row);
                            }}
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            className={styles.kebabMenuItem}
                            onClick={() => {
                              setOpenMenuId(null);
                              onUpdateStatus?.(row, "Resolved");
                            }}
                          >
                            Resolve Ticket
                          </button>
                          <button
                            type="button"
                            className={styles.kebabMenuItem}
                            onClick={() => {
                              setOpenMenuId(null);
                              onUpdateStatus?.(row, "Closed");
                            }}
                          >
                            Close Ticket
                          </button>
                          <button
                            type="button"
                            className={styles.kebabMenuItem}
                            onClick={() => {
                              setOpenMenuId(null);
                              onEscalate?.(row);
                            }}
                          >
                            Escalate
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredReports.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.emptyRow}>
                  No reports found matching your search.
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
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#868C98" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={11} cy={11} r={8} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1={4} y1={6} x2={20} y2={6} />
      <line x1={7} y1={12} x2={17} y2={12} />
      <line x1={10} y1={18} x2={14} y2={18} />
    </svg>
  );
}

function FlagIcon({ fill = "#2563EB" }: { fill?: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth={1}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

function MoreVerticalIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx={12} cy={5} r={1} />
      <circle cx={12} cy={12} r={1} />
      <circle cx={12} cy={19} r={1} />
    </svg>
  );
}
