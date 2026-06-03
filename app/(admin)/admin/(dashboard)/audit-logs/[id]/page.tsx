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

  const statusClass = (status: string) => {
    switch (status) {
      case "Success": return styles.statusSuccess;
      case "Denied": return styles.statusDenied;
      case "Pending": return styles.statusPending;
      default: return "";
    }
  };

  const isStatusSuccess = (statusStr: string) => statusStr === "Success";

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
              <span className={styles.actionTitle}>Action: {log.action}</span>
              <span className={`${styles.badge} ${statusClass(log.status)}`}>
                <span className={styles.badgeDot}></span>
                {log.status}
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
            } catch(e) {
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
              {log.user?.avatar ? (
                <Image 
                  src={log.user.avatar} 
                  alt={log.user.name || 'User'} 
                  width={64} 
                  height={64} 
                  className={styles.avatar} 
                />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ccc' }} className={styles.avatar} />
              )}
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Admin Name</span>
                <span className={styles.infoValue}>{log.user?.name || log.user_name || log.user || 'System'}</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Role</span>
                <span className={styles.infoValue}>{log.user?.role || log.role || 'N/A'}</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{log.user?.email || log.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Affected Record */}
          {log.affectedRecord && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Affected Record</h2>
              <div className={styles.recordGrid}>
                {log.affectedRecord.bookingId && (
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Booking ID</span>
                    <div className={styles.copyable}>
                      <span className={styles.infoValue}>{log.affectedRecord.bookingId}</span>
                      <button className={styles.copyBtn} aria-label="Copy booking ID"><CopyIcon /></button>
                    </div>
                  </div>
                )}
                {log.affectedRecord.transactionId && (
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Transaction ID</span>
                    <div className={styles.copyable}>
                      <span className={styles.infoValue}>{log.affectedRecord.transactionId}</span>
                      <button className={styles.copyBtn} aria-label="Copy transaction ID"><CopyIcon /></button>
                    </div>
                  </div>
                )}
                {log.affectedRecord.customerName && (
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Customer Name</span>
                    <span className={styles.infoValue}>{log.affectedRecord.customerName}</span>
                  </div>
                )}
                {log.affectedRecord.vehicleId && (
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Vehicle ID</span>
                    <div className={styles.copyable}>
                      <span className={styles.infoValue}>{log.affectedRecord.vehicleId}</span>
                      <button className={styles.copyBtn} aria-label="Copy vehicle ID"><CopyIcon /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Change Details */}
          {log.changeDetails && log.changeDetails.length > 0 && (
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
                  {log.changeDetails.map((change: any, idx: number) => (
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

          {/* Admin Notes */}
          {log.adminNotes && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Admin Notes</h2>
              <div className={styles.notesArea}>
                {log.adminNotes}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* Activity Timeline */}
          {log.activityTimeline && log.activityTimeline.length > 0 && (
            <div className={styles.sidebarCard}>
              <h3 className={styles.timelineTitle}>Activity Timeline</h3>
              <div className={styles.timelineList}>
                {log.activityTimeline.map((step: any, idx: number) => (
                  <div key={idx} className={styles.timelineItem}>
                    <div className={styles.timelineLine}></div>
                    <div className={`${styles.timelineCheckbox} ${step.completed ? styles.checked : ''}`}>
                      {step.completed && <CheckIcon />}
                    </div>
                    <div className={styles.timelineTitleText}>{step.title}</div>
                    <div className={styles.timelineTime}>{step.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Network Info */}
          {log.networkInfo && (
            <>
              <div className={styles.networkCard}>
                <div className={styles.networkLabel}>I.P Address</div>
                <div className={styles.networkValue}>{log.networkInfo.ipAddress}</div>
              </div>
              <div className={styles.networkCard}>
                <div className={styles.networkLabel}>Device/Browser</div>
                <div className={styles.networkValue}>{log.networkInfo.deviceBrowser}</div>
              </div>
              <div className={styles.networkCard}>
                <div className={styles.networkLabel}>Location</div>
                <div className={styles.networkValue}>{log.networkInfo.location}</div>
              </div>
            </>
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
