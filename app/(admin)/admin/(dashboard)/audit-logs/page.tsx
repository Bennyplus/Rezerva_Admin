"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ADMIN_AUDIT_LOGS, AuditLog } from "@/data/admin-audit-logs";
import styles from "./audit-logs.module.css";

export default function AuditLogsPage() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showEmptyState, setShowEmptyState] = useState(false);

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

  const hasLogs = !showEmptyState && ADMIN_AUDIT_LOGS.length > 0;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={() => setShowEmptyState(!showEmptyState)}
            style={{ padding: '8px 16px', background: '#f4f5f6', border: '1px solid #e2e4e9', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
          >
            Toggle Empty State
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
        /* Table View */
        <>
          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.searchWrap}>
              <SearchIcon className={styles.searchIcon} />
              <input type="text" placeholder="Search..." className={styles.searchInput} />
            </div>
            <button className={styles.btnControl}>
              <FilterIcon /> Filter
            </button>
            <button className={styles.btnControl}>
              <SortIcon /> Sort By
            </button>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th><input type="checkbox" className={styles.checkbox} /></th>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Category</th>
                    <th>Action</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {ADMIN_AUDIT_LOGS.slice(0, 9).map((log) => (
                    <tr key={log.id}>
                      <td><input type="checkbox" className={styles.checkbox} /></td>
                      <td>{log.timestamp}</td>
                      <td>
                        <div className={styles.userCell}>
                          {log.user.name}
                        </div>
                      </td>
                      <td>{log.user.role}</td>
                      <td>{log.category}</td>
                      <td>{log.action}</td>
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
                            <button className={styles.actionItem} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
                              Export Log
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={styles.footer}>
              <div className={styles.pageInfo}>Page 2 of 16</div>
              <div className={styles.pagination}>
                <button className={styles.pageBtn}><DoubleLeftIcon /></button>
                <button className={styles.pageBtn}><LeftIcon /></button>
                <button className={styles.pageBtn}>1</button>
                <button className={`${styles.pageBtn} ${styles.active}`}>2</button>
                <button className={styles.pageBtn}>3</button>
                <button className={styles.pageBtn}>4</button>
                <button className={styles.pageBtn}>5</button>
                <span className={styles.pageDots}>...</span>
                <button className={styles.pageBtn}>16</button>
                <button className={styles.pageBtn}><RightIcon /></button>
                <button className={styles.pageBtn}><DoubleRightIcon /></button>
              </div>
              <button className={styles.showingSelector}>
                Showing 9 results <ChevronDownIcon />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Icons
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function DoubleLeftIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>;
}

function LeftIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>;
}

function RightIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;
}

function DoubleRightIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>;
}

function ChevronDownIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>;
}
