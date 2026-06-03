"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import FilterBar from "@/components/admin/FilterBar";
import Pagination from "@/components/admin/Pagination";
import Spinner from "@/components/admin/Spinner";
import { auditLogsService } from "@/services/audit-logs-service";
import styles from "./audit-logs.module.css";

export default function AuditLogsPage() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(9);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await auditLogsService.getAuditLogs();
        setLogs(Array.isArray(data) ? data : data.results || data.data || []);
        // setTotalPages(data.total_pages || data.totalPages || 1);
        // setResultsPerPage(data.results_per_page || data.resultsPerPage || 9);        
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleDropdownToggle = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Status mapping
  const statusClass = (status: string) => {
    switch (status) {
      case "Success": return styles.statusSuccess;
      case "Denied": return styles.statusDenied;
      case "Pending": return styles.statusPending;
      default: return "";
    }
  };

  const hasLogs = !showEmptyState && logs.length > 0;

  const handleExport = async () => {
    try {
      const response = await auditLogsService.exportAuditLogs();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'audit_logs.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to export logs:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <FilterBar />
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={handleExport}
            style={{ padding: '8px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, marginRight: '8px' }}
          >
            Export Logs
          </button>
          {/* <button
            onClick={() => setShowEmptyState(!showEmptyState)}
            style={{ padding: '8px 16px', background: '#f4f5f6', border: '1px solid #e2e4e9', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
          >
            Toggle Empty State
          </button> */}
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
        /* Table View */
        <>
          <div className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th><input type="checkbox" className={styles.checkbox} /></th>
                    <th>Timestamp</th>
                    <th>User</th>
                    {/* <th>Role</th> */}
                    <th>Category</th>
                    <th>Action</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td><input type="checkbox" className={styles.checkbox} /></td>
                      <td>{new Date(log.timestamp).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) || 'N/A'}</td>
                      <td>
                        <div className={styles.userCell}>
                          {log.user?.name || log.user_name || log.user || 'System'}
                        </div>
                      </td>
                      {/* <td>{log.user?.role || log.role || 'N/A'}</td> */}
                      <td>{log.category || 'N/A'}</td>
                      <td>{log.action.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'N/A'}</td>
                      <td>
                        <span className={`${styles.badge} ${statusClass(log.status)}`}>
                          <span className={styles.badgeDot}></span>
                          {log.status}
                        </span>
                      </td>
                      <td className={styles.actionCell}>
                        <button
                          className={`${styles.actionBtn} ${openDropdownId === log.id ? styles.actionBtnActive : ''}`}
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              resultsPerPage={resultsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

function MoreIcon() { return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>; }
