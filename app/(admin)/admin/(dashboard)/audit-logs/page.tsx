"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/admin/Pagination";
import Spinner from "@/components/admin/Spinner";
import FilterBar from "@/components/admin/FilterBar";
import AuditLogsFilterDropdown from "@/components/admin/audit-logs/AuditLogsFilterDropdown";
import { auditLogsService } from "@/services/audit-logs-service";
import styles from "./audit-logs.module.css";

const PAGE_SIZE = 10;

export default function AuditLogsPage() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Search / filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterActions, setFilterActions] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await auditLogsService.getAuditLogs({ page: currentPage });
        setAllLogs(Array.isArray(data) ? data : data.results || data.data || []);
        if (data && data.count !== undefined) {
          setTotalCount(data.count);
        } else {
          setTotalCount(Array.isArray(data) ? data.length : (data.results?.length || 0));
        }
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

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

      const matchesCategory = filterCategories.length === 0 || filterCategories.includes(log.category);
      const matchesAction = filterActions.length === 0 || filterActions.includes(log.action);
      const matchesStatus = filterStatuses.length === 0 || filterStatuses.includes(normalizeStatus(log.status));

      return matchesSearch && matchesCategory && matchesAction && matchesStatus;
    });
  }, [allLogs, searchQuery, filterCategories, filterActions, filterStatuses]);

  // Reset to page 1 whenever filters change
  const handleSearch = (v: string) => { setSearchQuery(v); setCurrentPage(1); };

  const handleApplyFilters = (filters: { categories: string[], actions: string[], statuses: string[] }) => {
    setFilterCategories(filters.categories);
    setFilterActions(filters.actions);
    setFilterStatuses(filters.statuses);
    setCurrentPage(1);
  };

  // Client-side pagination logic updated for server-side count
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const paginatedLogs = filteredLogs;

  const handleDropdownToggle = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleExport = async (format: "csv" | "pdf" | "xlsx") => {
    try {
      setExportingFormat(format);
      const response = await auditLogsService.exportAuditLogs(format);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `audit_logs.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to export logs:", error);
    } finally {
      setExportingFormat(null);
      setExportDropdownOpen(false);
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
          <FilterBar
            searchValue={searchQuery}
            onSearchChange={handleSearch}
            hideSort={true}
            filterDropdown={
              <AuditLogsFilterDropdown
                categories={categories}
                actions={actions}
                statuses={statuses}
                onApply={handleApplyFilters}
              />
            }
          />
        </div>

        <div className={styles.headerRight}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              style={{ padding: "8px 16px", background: "#111", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}
              disabled={!!exportingFormat}
            >
              {exportingFormat ? `Exporting ${exportingFormat.toUpperCase()}...` : "Export Logs"}
              <ChevronDownIcon />
            </button>
            {exportDropdownOpen && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: "8px", background: "#fff", border: "1px solid #eee", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "120px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <button onClick={() => handleExport("csv")} style={{ padding: "10px 16px", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", fontSize: "13px", color: "#333", borderBottom: "1px solid #eee" }}>Export as CSV</button>
                <button onClick={() => handleExport("pdf")} style={{ padding: "10px 16px", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", fontSize: "13px", color: "#333", borderBottom: "1px solid #eee" }}>Export as PDF</button>
                <button onClick={() => handleExport("xlsx")} style={{ padding: "10px 16px", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", fontSize: "13px", color: "#333" }}>Export as XLSX</button>
              </div>
            )}
          </div>
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

function ChevronDownIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
