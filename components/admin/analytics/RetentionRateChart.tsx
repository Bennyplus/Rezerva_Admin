"use client";

import styles from "./AnalyticsCharts.module.css";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const COHORTS = [
  { label: "10%", bg: "#D4E4FC", color: "#2F68FE" },
  { label: "30%", bg: "#9BBDFB", color: "#ffffff" },
  { label: "52%", bg: "#699BFA", color: "#ffffff" },
  { label: "65%", bg: "#3D7CF9", color: "#ffffff" },
  { label: "80%", bg: "#2263F6", color: "#ffffff" },
  { label: "100%", bg: "#164ECF", color: "#ffffff" },
];

export default function RetentionRateChart() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Retention Rate</h3>
          <p className={styles.subtitle}>User Retention Rate</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", flex: 1, marginTop: "10px" }}>
        {/* Y-Axis: Wk 4, Wk 3, Wk 2, Wk 1 */}
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
          <span style={{ fontSize: "11px", color: "#868C98" }}>Wk 4</span>
          <span style={{ fontSize: "11px", color: "#868C98" }}>Wk 3</span>
          <span style={{ fontSize: "11px", color: "#868C98" }}>Wk 2</span>
          <span style={{ fontSize: "11px", color: "#868C98" }}>Wk 1</span>
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
            {MONTHS.map((month) => (
              <div
                key={month}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  height: "100%",
                }}
              >
                {COHORTS.map((c, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      background: c.bg,
                      borderRadius:
                        idx === 0
                          ? "4px 4px 0 0"
                          : idx === COHORTS.length - 1
                          ? "0 0 4px 4px"
                          : "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "9px",
                      fontWeight: 600,
                      color: c.color,
                    }}
                  >
                    {c.label}
                  </div>
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
            {MONTHS.map((m) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
