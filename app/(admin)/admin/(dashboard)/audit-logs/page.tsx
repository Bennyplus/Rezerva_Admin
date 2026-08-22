"use client";

import { useState, useEffect, useMemo } from "react";
import Pagination from "@/components/admin/Pagination";
import Spinner from "@/components/admin/Spinner";
import FilterBar from "@/components/admin/FilterBar";
import FilterDropdown from "@/components/admin/FilterDropdown";
import SortDropdown from "@/components/admin/SortDropdown";
import MoreIcon from "@/components/admin/icons/MoreIcon";
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  // Search / filter state
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModules, setFilterModules] = useState<string[]>([]);
  const [filterActions, setFilterActions] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("Newest to Oldest");

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      if (isInitialLoad) {
        setLoading(true);
      }
      try {
        const data = await auditLogsService.getAuditLogs({ page: currentPage, search: searchQuery });
        const logsList = Array.isArray(data) ? data : data.results || data.data || [];
        setAllLogs(logsList);
        if (data && data.count !== undefined) {
          setTotalCount(data.count);
        } else {
          setTotalCount(Array.isArray(data) ? data.length : (data.results?.length || logsList.length));
        }
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
    fetchData();
  }, [currentPage, searchQuery, isInitialLoad]);

  // Normalize status capitalization (API returns lowercase "success")
  const normalizeStatus = (s: string) => {
    if (!s) return "Unknown";
    const lower = s.toLowerCase();
    if (lower === "success") return "Success";
    if (lower === "failed" || lower === "denied") return "Denied";
    if (lower === "pending") return "Pending";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const statusClass = (status: string) => {
    switch (normalizeStatus(status)) {
      case "Success":
        return styles.statusSuccess;
      case "Denied":
        return styles.statusDenied;
      case "Pending":
        return styles.statusPending;
      default:
        return "";
    }
  };

  // Unique filter options derived from current logs
  const modules = useMemo(
    () => [...new Set(allLogs.map((l) => l.module || l.category).filter(Boolean))],
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

  // Client-side filtering & sorting
  const filteredLogs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let result = allLogs.filter((log) => {
      const actor = (log.actor_name || log.user || "").toLowerCase();
      const actionStr = (log.action || "").toLowerCase();
      const moduleStr = (log.module || log.category || "").toLowerCase();
      const statusStr = normalizeStatus(log.status).toLowerCase();
      const summaryStr = (log.summary || "").toLowerCase();

      const matchesSearch =
        !q ||
        actor.includes(q) ||
        actionStr.includes(q) ||
        moduleStr.includes(q) ||
        statusStr.includes(q) ||
        summaryStr.includes(q);

      const matchesModule = filterModules.length === 0 || filterModules.includes(log.module || log.category);
      const matchesAction = filterActions.length === 0 || filterActions.includes(log.action);
      const matchesStatus = filterStatuses.length === 0 || filterStatuses.includes(normalizeStatus(log.status));

      return matchesSearch && matchesModule && matchesAction && matchesStatus;
    });

    if (sortOption === "Newest to Oldest") {
      result.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
    } else if (sortOption === "Oldest to Newest") {
      result.sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
    }

    return result;
  }, [allLogs, searchQuery, filterModules, filterActions, filterStatuses, sortOption]);

  const handleApplyFilters = (filters: Record<string, string[]>) => {
    setFilterModules(filters.modules || filters.categories || []);
    setFilterActions(filters.actions || []);
    setFilterStatuses(filters.statuses || []);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

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
            searchValue={localSearchQuery}
            onSearchChange={setLocalSearchQuery}
            hideSort={false}
            filterDropdown={
              <FilterDropdown
                tabs={[
                  { id: 'modules', label: 'Modules', options: modules },
                  { id: 'actions', label: 'Actions', options: actions },
                  { id: 'statuses', label: 'Statuses', options: statuses }
                ]}
                onApply={handleApplyFilters}
              />
            }
            sortDropdown={
              <SortDropdown
                options={[
                  { label: "Newest to Oldest", value: "Newest to Oldest" },
                  { label: "Oldest to Newest", value: "Oldest to Newest" }
                ]}
                onSortSelect={setSortOption}
              />
            }
          />
        </div>

        <div className={styles.headerRight}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              style={{
                padding: "8px 16px",
                background: "#111111",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              disabled={!!exportingFormat}
            >
              {exportingFormat ? `Exporting ${exportingFormat.toUpperCase()}...` : "Export Logs"}
              <ChevronDownIcon />
            </button>
            {exportDropdownOpen && (
              <div style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "8px",
                background: "#ffffff",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 10,
                minWidth: "140px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}>
                <button onClick={() => handleExport("csv")} style={{ padding: "10px 16px", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", fontSize: "13px", color: "#374151", borderBottom: "1px solid #F3F4F6" }}>Export as CSV</button>
                <button onClick={() => handleExport("pdf")} style={{ padding: "10px 16px", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", fontSize: "13px", color: "#374151", borderBottom: "1px solid #F3F4F6" }}>Export as PDF</button>
                <button onClick={() => handleExport("xlsx")} style={{ padding: "10px 16px", background: "transparent", border: "none", textAlign: "left", cursor: "pointer", fontSize: "13px", color: "#374151" }}>Export as XLSX</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!hasLogs ? (
        /* ─── Empty State ─── */
        <div className={styles.emptyCard} id="audit-logs-empty-state">
          <h2 className={styles.emptyTitle}>No Audit Logs Yet</h2>
          <p className={styles.emptySubtitle}>System and admin activities will appear here</p>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>
                    <input type="checkbox" className={styles.checkbox} aria-label="Select all logs" />
                  </th>
                  <th>Log ID</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>IP Address</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                  <th style={{ width: "40px" }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "40px", color: "#6B7280" }}>
                      No results match your search/filters
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <input type="checkbox" className={styles.checkbox} aria-label={`Select log ${log.id}`} />
                      </td>
                      <td style={{ fontWeight: 600, color: "#111827" }}>
                        #LOG-{String(log.id).padStart(3, "0")}
                      </td>
                      <td>
                        <div className={styles.userCell} style={{ fontWeight: 500 }}>
                          {log.actor_name || log.user || "System"}
                        </div>
                      </td>
                      <td>{log.action || "--"}</td>
                      <td style={{ textTransform: "capitalize" }}>{log.module || log.category || "--"}</td>
                      <td style={{ fontFamily: "monospace", fontSize: "13px", color: "#4B5563" }}>
                        {log.ip_address || "--"}
                      </td>
                      <td>
                        <span className={`${styles.badge} ${statusClass(log.status)}`}>
                          <span className={styles.badgeDot}></span>
                          {normalizeStatus(log.status)}
                        </span>
                      </td>
                      <td>{log.timestamp || "--"}</td>
                      <td className={styles.actionCell}>
                        <button
                          className={`${styles.actionBtn} ${openDropdownId === String(log.id) ? styles.actionBtnActive : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownToggle(String(log.id));
                          }}
                        >
                          <MoreIcon />
                        </button>
                        {openDropdownId === String(log.id) && (
                          <div className={styles.actionDropdown}>
                            <button
                              className={styles.actionItem}
                              onClick={() => {
                                setOpenDropdownId(null);
                                setSelectedLog(log);
                              }}
                            >
                              View Details
                            </button>
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
            variant="table"
          />
        </div>
      )}

      {/* Details Modal */}
      {selectedLog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "24px",
        }} onClick={() => setSelectedLog(null)}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "560px",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 24px",
              borderBottom: "1px solid #F1F2F4",
            }}>
              <h2 style={{ fontSize: "17px", fontWeight: 600, color: "#111827", margin: 0 }}>
                Audit Log Details (#LOG-{String(selectedLog.id).padStart(3, "0")})
              </h2>
              <button
                onClick={() => setSelectedLog(null)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#9CA3AF" }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#868C98" }}>Actor / User</span>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#111827", marginTop: "2px" }}>
                    {selectedLog.actor_name || selectedLog.user || "System"}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#868C98" }}>Action</span>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#111827", marginTop: "2px" }}>
                    {selectedLog.action || "--"}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#868C98" }}>Module</span>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#111827", marginTop: "2px", textTransform: "capitalize" }}>
                    {selectedLog.module || selectedLog.category || "--"}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#868C98" }}>IP Address</span>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#111827", marginTop: "2px", fontFamily: "monospace" }}>
                    {selectedLog.ip_address || "--"}
                  </div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: "12px", color: "#868C98" }}>Summary</span>
                <div style={{ fontSize: "13.5px", color: "#374151", background: "#F9FAFB", padding: "12px 14px", borderRadius: "8px", marginTop: "4px", lineHeight: "1.5" }}>
                  {selectedLog.summary || "No summary details available"}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "12px", color: "#868C98" }}>Timestamp</span>
                <div style={{ fontSize: "13.5px", color: "#111827", marginTop: "2px" }}>
                  {selectedLog.timestamp || "--"}
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 24px", background: "#F9FAFB", borderTop: "1px solid #F1F2F4", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setSelectedLog(null)}
                style={{ padding: "8px 20px", background: "#3B63F6", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "13.5px", fontWeight: 500, cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
