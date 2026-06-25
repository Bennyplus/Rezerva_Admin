"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auditLogsService } from "@/services/audit-logs-service";
import Spinner from "@/components/admin/Spinner";
import styles from "./audit-log-details.module.css";

interface AuditLogDetailsProps {
  params: Promise<{ id: string }>;
}

export default function AuditLogDetails({ params }: AuditLogDetailsProps) {
  const router = useRouter();
  const { id } = use(params);
  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const data = await auditLogsService.getAuditLogDetail(id);
        setLog(data);
      } catch (err) {
        console.error("Failed to fetch log details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, [id]);

  // Normalize status: API returns lowercase "success", UI expects "Success"
  const normalizeStatus = (status: string) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "";

  const statusClass = (status: string) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case "Success": return styles.statusSuccess;
      case "Denied": return styles.statusDenied;
      case "Pending": return styles.statusPending;
      default: return "";
    }
  };

  const isStatusSuccess = (statusStr: string) =>
    normalizeStatus(statusStr) === "Success";

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (!log) {
    return <div style={{ padding: '24px' }}>Log not found</div>;
  }

  // Derived values from flat API response
  const displayStatus = normalizeStatus(log.status);
  const deviceBrowser = [log.device_type, log.device_os]
    .filter(Boolean)
    .join(" on ") || log.user_agent || "N/A";
  const location = log.location_label || (
    log.latitude && log.longitude ? `${log.latitude}, ${log.longitude}` : null
  );

  // Change details: build from previous_value / new_value if present
  const changeDetails: Array<{ field: string; before: string; after: string }> = [];
  if (log.previous_value != null || log.new_value != null) {
    changeDetails.push({
      field: log.object_type || "Value",
      before: log.previous_value != null ? String(log.previous_value) : "—",
      after: log.new_value != null ? String(log.new_value) : "—",
    });
  }

  // Affected record: show when object_type or object_id is present
  const hasAffectedRecord = log.object_type || log.object_id;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
            <BackIcon />
          </button>
          <div className={styles.headerInfo}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className={styles.actionTitle}>Action: {log.action.replace('_', ' ')}</span>
              <span className={`${styles.badge} ${statusClass(log.status)}`}>
                <span className={styles.badgeDot}></span>
                {displayStatus}
              </span>
            </div>
            <div className={styles.timestamp}>Timestamp: On {log.timestamp || log.created_at || 'N/A'}</div>
          </div>
        </div>
        <button
          className={styles.exportBtn}
          onClick={async () => {
            try {
              const response = await auditLogsService.exportAuditLogs();
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `audit_log_${log.id}.xlsx`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } catch (e) {
              console.error(e);
            }
          }}
        >Export Log</button>
      </div>

      <div className={styles.contentGrid}>
        {/* Left Column */}
        <div className={styles.leftCol}>

          {/* Action Performed By */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Action Performed By</h2>
            <div className={styles.performerGrid}>
              {log.profile_picture ? (
                <Image
                  src={log.profile_picture}
                  alt={log.user || 'User'}
                  width={64}
                  height={64}
                  className={styles.avatar}
                />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ccc' }} className={styles.avatar} />
              )}
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Name</span>
                <span className={styles.infoValue}>{log.user || 'System'}</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Role</span>
                <span className={styles.infoValue}>{log.actor_type || 'N/A'}</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Category</span>
                <span className={styles.infoValue}>{log.category || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Affected Record */}
          {hasAffectedRecord && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Affected Record</h2>
              <div className={styles.recordGrid}>
                {log.object_type && (
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Object Type</span>
                    <span className={styles.infoValue}>{log.object_type}</span>
                  </div>
                )}
                {log.object_id && (
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Object ID</span>
                    <div className={styles.copyable}>
                      <span className={styles.infoValue}>{log.object_id}</span>
                      <button
                        className={styles.copyBtn}
                        aria-label="Copy object ID"
                        onClick={() => navigator.clipboard.writeText(log.object_id)}
                      >
                        <CopyIcon />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Change Details */}
          {changeDetails.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Change Details</h2>
              <table className={styles.changesTable}>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Before</th>
                    <th>After</th>
                  </tr>
                </thead>
                <tbody>
                  {changeDetails.map((change, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 500 }}>{change.field}</td>
                      <td>
                        <span className={`${styles.changesBadge} ${isStatusSuccess(change.before) ? styles.success : ''}`}>
                          <span className={styles.badgeDot}></span>
                          {change.before}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.changesBadge} ${isStatusSuccess(change.after) ? styles.success : ''}`}>
                          <span className={styles.badgeDot}></span>
                          {change.after}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Admin Notes / Description */}
          {log.description && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Admin Notes</h2>
              <div className={styles.notesArea}>
                {log.description}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* Network Info — always rendered from flat fields */}
          <div className={styles.networkCard}>
            <div className={styles.networkLabel}>I.P Address</div>
            <div className={styles.networkValue}>{log.ip_address || 'N/A'}</div>
          </div>
          <div className={styles.networkCard}>
            <div className={styles.networkLabel}>Device / Browser</div>
            <div className={styles.networkValue}>{deviceBrowser}</div>
          </div>
          {log.app_version && (
            <div className={styles.networkCard}>
              <div className={styles.networkLabel}>App Version</div>
              <div className={styles.networkValue}>{log.app_version}</div>
            </div>
          )}
          <div className={styles.networkCard}>
            <div className={styles.networkLabel}>Location</div>
            <div className={styles.networkValue}>{location || 'N/A'}</div>
          </div>

          {/* Metadata (if present) */}
          {log.metadata && (
            <div className={styles.networkCard}>
              <div className={styles.networkLabel}>Metadata</div>
              <div className={styles.networkValue} style={{ fontSize: 12, wordBreak: 'break-all' }}>
                {typeof log.metadata === 'string'
                  ? log.metadata
                  : JSON.stringify(log.metadata, null, 2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Icons
function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
