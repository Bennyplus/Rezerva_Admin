"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/admin/Pagination";
import Spinner from "@/components/admin/Spinner";
import { auditLogsService } from "@/services/audit-logs-service";
import styles from "./audit-logs.module.css";

const PAGE_SIZE = 12;

export default function AuditLogsPage() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search / filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await auditLogsService.getAuditLogs();
        setAllLogs(Array.isArray(data) ? data : data.results || data.data || []);
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Normalize status capitalisation (API returns lowercase "success")
  const normalizeStatus = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

  const statusClass = (status: string) => {
    switch (normalizeStatus(status)) {
      case "Success": return styles.statusSuccess;
      case "Denied": return styles.statusDenied;
      case "Pending": return styles.statusPending;
      default: return "";
    }
  };

  // Derive unique filter options from the full dataset
  const categories = useMemo(
    () => [...new Set(allLogs.map((l) => l.category).filter(Boolean))],
    [allLogs]
  );
  const actions = useMemo(
    () => [...new Set(allLogs.map((l) => l.action).filter(Boolean))],
    [allLogs]
  );
  const statuses = useMemo(
    () => [...new Set(allLogs.map((l) => normalizeStatus(l.status)).filter(Boolean))],
    [allLogs]
  );

  // Client-side filtering
  const filteredLogs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allLogs.filter((log) => {
      const userName = (log.user || "").toLowerCase();
      const matchesSearch =
        !q ||
        userName.includes(q) ||
        (log.category || "").toLowerCase().includes(q) ||
        (log.action || "").toLowerCase().includes(q) ||
        normalizeStatus(log.status).toLowerCase().includes(q);

      const matchesCategory = !filterCategory || log.category === filterCategory;
      const matchesAction = !filterAction || log.action === filterAction;
      const matchesStatus = !filterStatus || normalizeStatus(log.status) === filterStatus;

      return matchesSearch && matchesCategory && matchesAction && matchesStatus;
    });
  }, [allLogs, searchQuery, filterCategory, filterAction, filterStatus]);

  // Reset to page 1 whenever filters change
  const handleSearch = (v: string) => { setSearchQuery(v); setCurrentPage(1); };
  const handleCategory = (v: string) => { setFilterCategory(v); setCurrentPage(1); };
  const handleAction = (v: string) => { setFilterAction(v); setCurrentPage(1); };
  const handleStatus = (v: string) => { setFilterStatus(v); setCurrentPage(1); };

  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleDropdownToggle = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleExport = async () => {
    try {
      const response = await auditLogsService.exportAuditLogs();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "audit_logs.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to export logs:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100%", width: "100%", minHeight: "60vh", alignItems: "center", justifyContent: "center" }}>
        <Spinner size={40} />
      </div>
    );
  }

  const hasLogs = allLogs.length > 0;

  return (
    <div className={styles.page}>
      {/* Header row: search/filters left, export right */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {/* Search input */}
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>
              <SearchIcon />
            </span>
            <input
              id="audit-search"
              type="text"
              className={styles.searchInput}
              placeholder="Search user, action, category…"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Category filter */}
          <select
            id="audit-filter-category"
            className={styles.filterSelect}
            value={filterCategory}
            onChange={(e) => handleCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Action filter */}
          <select
            id="audit-filter-action"
            className={styles.filterSelect}
            value={filterAction}
            onChange={(e) => handleAction(e.target.value)}
          >
            <option value="">All Actions</option>
            {actions.map((a) => (
              <option key={a} value={a}>
                {a.split("_").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            id="audit-filter-status"
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => handleStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className={styles.headerRight}>
          <button
            onClick={handleExport}
            style={{ padding: "8px 16px", background: "#111", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
          >
            Export Logs
          </button>
        </div>
      </div>

      {!hasLogs ? (
        /* ─── Empty State ─── */
        <div className={styles.emptyCard} id="audit-logs-empty-state">
          <div className={styles.illustration} aria-hidden="true">
            <Image
              src="/images/admin/Items.png"
              alt="No audit logs illustration"
              width={460}
              height={380}
              className={styles.illustrationImg}
            />
          </div>
          <h2 className={styles.emptyTitle}>No audit logs available</h2>
          <p className={styles.emptySubtitle}>System and admin activities will appear here</p>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th><input type="checkbox" className={styles.checkbox} /></th>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Category</th>
                  <th>Action</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#6f767e" }}>
                      No results match your filters
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log) => (
                    <tr key={log.id}>
                      <td><input type="checkbox" className={styles.checkbox} /></td>
                      <td>
                        {log.timestamp
                          ? new Date(log.timestamp).toLocaleString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })
                          : "N/A"}
                      </td>
                      <td>
                        <div className={styles.userCell}>
                          {log.user || "System"}
                        </div>
                      </td>
                      <td>{log.category || "N/A"}</td>
                      <td>
                        {log.action
                          ? log.action.split("_").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
                          : "N/A"}
                      </td>
                      <td>
                        <span className={`${styles.badge} ${statusClass(log.status)}`}>
                          <span className={styles.badgeDot}></span>
                          {normalizeStatus(log.status)}
                        </span>
                      </td>
                      <td className={styles.actionCell}>
                        <button
                          className={`${styles.actionBtn} ${openDropdownId === log.id ? styles.actionBtnActive : ""}`}
                          onClick={() => handleDropdownToggle(log.id)}
                        >
                          <MoreIcon />
                        </button>
                        {openDropdownId === log.id && (
                          <div className={styles.actionDropdown}>
                            <Link href={`/admin/audit-logs/${log.id}`} className={styles.actionItem}>
                              View Details
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            resultsPerPage={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  );
}
