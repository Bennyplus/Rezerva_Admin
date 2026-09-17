"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/admin/Spinner";
import styles from "./DriverVerificationHistory.module.css";
import {
  driverVerificationService,
  DriverVerificationHistoryItem,
} from "@/services/driver-verification-service";

interface DriverVerificationHistoryProps {
  onNavigateToConfig: () => void;
}

/**
 * Format ISO timestamp to "DD MMM YYYY  HH:MM AM/PM"
 */
function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const date = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${date}  ${time}`;
  } catch {
    return iso;
  }
}

export default function DriverVerificationHistory({
  onNavigateToConfig,
}: DriverVerificationHistoryProps) {
  const [history, setHistory] = useState<DriverVerificationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await driverVerificationService.getHistory();
        if (isMounted) {
          setHistory(data);
        }
      } catch (err) {
        console.error("Failed to load driver verification history:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* ─── Top Actions: Back to Document Configuration ─── */}
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onNavigateToConfig}
          id="driver-verif-back-to-config-btn"
        >
          <ArrowLeftIcon />
          <span>Document Configuration</span>
        </button>
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>Driver Verification History</h2>
        <p className={styles.subtitle}>
          Track modifications to driver verification requirements and document configuration.
        </p>
      </div>

      {/* ─── History Table / Loading ─── */}
      {loading ? (
        <div className={styles.loadingWrapper} id="driver-verification-history-loading">
          <Spinner size={36} color="#375DFB" />
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Setting</th>
                  <th className={styles.th}>Previous Value</th>
                  <th className={styles.th}>New Value</th>
                  <th className={styles.th}>Updated By</th>
                  <th className={styles.th}>Date &amp; Time</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>
                      No verification changes recorded yet
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className={styles.tr}>
                      <td className={styles.td}>{item.category}</td>
                      <td className={styles.td}>{item.setting}</td>
                      <td className={styles.td}>{item.previous_value}</td>
                      <td className={styles.td}>{item.new_value}</td>
                      <td className={styles.td}>
                        <span className={styles.user}>{item.updated_by}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.timestamp}>
                          {formatDateTime(item.created_at || item.updated_at || "")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Inline Icon ─── */
function ArrowLeftIcon() {
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
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
