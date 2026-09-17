"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/admin/Spinner";
import styles from "./PaymentsWalletHistory.module.css";
import {
  paymentsWalletService,
  PaymentsWalletHistoryItem,
} from "@/services/payments-wallet-service";

interface PaymentsWalletHistoryProps {
  onNavigateToConfig: () => void;
}

/**
 * Format ISO timestamp to "DD MMM YYYY  HH:MM AM/PM"
 */
function formatDateTime(iso?: string): string {
  if (!iso) return "—";
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

export default function PaymentsWalletHistory({
  onNavigateToConfig,
}: PaymentsWalletHistoryProps) {
  const [history, setHistory] = useState<PaymentsWalletHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await paymentsWalletService.getHistory();
        if (isMounted) {
          setHistory(data);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
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
      {/* ─── Top Actions: Back to Payment Configuration ─── */}
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onNavigateToConfig}
          id="payments-wallet-back-to-config-btn"
        >
          <ArrowLeftIcon />
          <span>Payment Configuration</span>
        </button>
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>Payments &amp; Wallet History</h2>
        <p className={styles.subtitle}>
          Track modifications to currency, payment methods, and refund policies.
        </p>
      </div>

      {/* ─── History Table / Loading ─── */}
      {loading ? (
        <div className={styles.loadingWrapper} id="payments-wallet-history-loading">
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
                      No payments &amp; wallet changes recorded yet
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
                          {formatDateTime(item.created_at || item.updated_at)}
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
