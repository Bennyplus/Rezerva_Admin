"use client";

import styles from "./AnalyticsEmptyState.module.css";

interface AnalyticsEmptyStateProps {
  title?: string;
  subtitle?: string;
}

export default function AnalyticsEmptyState({
  title = "No Analytics Data",
  subtitle = "No analytics data is available for now",
}: AnalyticsEmptyStateProps) {
  return (
    <div className={styles.emptyCard}>
      <h2 className={styles.emptyTitle}>{title}</h2>
      <p className={styles.emptySubtitle}>{subtitle}</p>
    </div>
  );
}
