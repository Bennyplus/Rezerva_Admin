"use client";

import { RetentionResponse } from "@/services/analytics-services";
import styles from "./AnalyticsCharts.module.css";

interface RetentionRateChartProps {
  retentionData?: RetentionResponse | null;
}

const DEFAULT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DEFAULT_PERIODS = ["Wk 5", "Wk 4", "Wk 3", "Wk 2", "Wk 1", "Wk 0"];

function getCohortStyle(val: number | null) {
  if (val === null) {
    return { bg: "#F9FAFB", color: "transparent", label: "" };
  }
  if (val === 0) {
    return { bg: "#F3F4F6", color: "#9CA3AF", label: "0%" };
  }
  if (val <= 25) {
    return { bg: "#D4E4FC", color: "#2F68FE", label: `${val}%` };
  }
  if (val <= 50) {
    return { bg: "#9BBDFB", color: "#ffffff", label: `${val}%` };
  }
  if (val <= 75) {
    return { bg: "#699BFA", color: "#ffffff", label: `${val}%` };
  }
  if (val < 100) {
    return { bg: "#3D7CF9", color: "#ffffff", label: `${val}%` };
  }
  return { bg: "#164ECF", color: "#ffffff", label: `${val}%` };
}

export default function RetentionRateChart({
  retentionData,
}: RetentionRateChartProps) {
  const cohorts = retentionData?.cohorts || [];
  const hasCohorts = cohorts.length > 0;

  const yLabels = retentionData?.period_labels?.length
    ? [...retentionData.period_labels].reverse()
    : DEFAULT_PERIODS;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Retention Rate</h3>
          <p className={styles.subtitle}>User Retention Rate</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", flex: 1, marginTop: "10px" }}>
        {/* Y-Axis: Period Labels (Wk 5 down to Wk 0) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "220px",
            paddingRight: "6px",
            paddingBottom: "8px",
          }}
        >
          {yLabels.map((lbl) => (
            <span
              key={lbl}
              style={{ fontSize: "11px", color: "#868C98", whiteSpace: "nowrap" }}
            >
              {lbl}
            </span>
          ))}
        </div>

        {/* Stacked Bars for 12 months */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              height: "220px",
              display: "flex",
              justifyContent: "space-between",
              gap: "4px",
            }}
          >
            {hasCohorts
              ? cohorts.map((c) => {
                  const reversedPeriods = [...c.periods].reverse();
                  return (
                    <div
                      key={c.cohort}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        height: "100%",
                      }}
                    >
                      {reversedPeriods.map((val, idx) => {
                        const style = getCohortStyle(val);
                        return (
                          <div
                            key={idx}
                            style={{
                              flex: 1,
                              background: style.bg,
                              borderRadius:
                                idx === 0
                                  ? "4px 4px 0 0"
                                  : idx === reversedPeriods.length - 1
                                  ? "0 0 4px 4px"
                                  : "0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "9px",
                              fontWeight: 600,
                              color: style.color,
                            }}
                          >
                            {style.label}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              : DEFAULT_MONTHS.map((m) => (
                  <div
                    key={m}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      height: "100%",
                    }}
                  >
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <div
                        key={idx}
                        style={{
                          flex: 1,
                          background: "#F9FAFB",
                          borderRadius:
                            idx === 0
                              ? "4px 4px 0 0"
                              : idx === 5
                              ? "0 0 4px 4px"
                              : "0",
                        }}
                      />
                    ))}
                  </div>
                ))}
          </div>

          {/* X-Axis Months */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "12px",
            }}
          >
            {(hasCohorts ? cohorts.map((c) => c.cohort) : DEFAULT_MONTHS).map(
              (m) => (
                <span
                  key={m}
                  style={{
                    fontSize: "11px",
                    color: "#868C98",
                    textAlign: "center",
                    flex: 1,
                  }}
                >
                  {m}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
