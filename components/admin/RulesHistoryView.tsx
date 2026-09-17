"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/admin/Spinner";
import styles from "./RulesHistoryView.module.css";
import {
  platformRulesService,
  RuleHistoryItem,
} from "@/services/platform-rules-service";

interface RulesHistoryViewProps {
  onNavigateToConfig: () => void;
}

export default function RulesHistoryView({ onNavigateToConfig }: RulesHistoryViewProps) {
  const [history, setHistory] = useState<RuleHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await platformRulesService.getHistory();
        if (isMounted) {
          setHistory(data);
        }
      } catch (err) {
        console.error("Failed to load rules history:", err);
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
      {/* ─── Top Actions: Back to Configuration ─── */}
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onNavigateToConfig}
          id="history-back-to-config-btn"
        >
          <ArrowLeftIcon />
          <span>Rules Configuration</span>
        </button>
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>Platform Rules History</h2>
        <p className={styles.subtitle}>
          Track modifications and configuration audit trails across all platform rules.
        </p>
      </div>

      {/* ─── History Table / Loading ─── */}
      {loading ? (
        <div className={styles.loadingWrapper} id="rules-history-loading">
          <Spinner size={36} color="#375DFB" />
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Date &amp; Time</th>
                  <th className={styles.th}>Rule Section</th>
                  <th className={styles.th}>Change Summary</th>
                  <th className={styles.th}>Modified By</th>
                  <th className={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyState}>
                      No rule modifications recorded yet
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className={styles.tr}>
                      <td className={styles.td}>
                        <span className={styles.timestamp}>{item.updatedAt}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.sectionBadge}>{item.section}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.description}>{item.changeDescription}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.user}>{item.updatedBy}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.statusBadge}>
                          <span className={styles.statusDot} />
                          Applied
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
