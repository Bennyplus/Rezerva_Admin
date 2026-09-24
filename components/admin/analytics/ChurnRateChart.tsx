"use client";

import styles from "./AnalyticsCharts.module.css";

interface MonthChurn {
  month: string;
  rate: number;
  isHighlight?: boolean;
}

const CHURN_DATA: MonthChurn[] = [
  { month: "Jan", rate: 5 },
  { month: "Feb", rate: 26 },
  { month: "Mar", rate: 33 },
  { month: "Apr", rate: 48 },
  { month: "May", rate: 21 },
  { month: "Jun", rate: 42, isHighlight: true },
  { month: "Jul", rate: 8 },
  { month: "Aug", rate: 12 },
  { month: "Sep", rate: 31 },
  { month: "Oct", rate: 50 },
  { month: "Nov", rate: 7 },
  { month: "Dec", rate: 43 },
];

const Y_TICKS = ["60%", "50%", "40%", "30%", "20%", "10%", "0"];
const MAX_VAL = 60;

export default function ChurnRateChart() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Churn Rate</h3>
          <p className={styles.subtitle}>Percentage of users who stopped using Reserva</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", flex: 1, marginTop: "10px" }}>
        {/* Y-Axis */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "220px",
            paddingRight: "6px",
          }}
        >
          {Y_TICKS.map((tick) => (
            <span
              key={tick}
              style={{
                fontSize: "11px",
                color: "#868C98",
                textAlign: "right",
              }}
            >
              {tick}
            </span>
          ))}
        </div>

        {/* Bars Container */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              height: "220px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "4px",
              borderBottom: "1px solid #F3F4F6",
              paddingBottom: "1px",
            }}
          >
            {CHURN_DATA.map((item) => {
              const heightPercent = (item.rate / MAX_VAL) * 100;
              return (
                <div
                  key={item.month}
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: `${heightPercent}%`,
                      background: item.isHighlight ? "#2F68FE" : "#E5E7EB",
                      borderRadius: "3px 3px 0 0",
                      position: "relative",
                      transition: "height 0.3s ease",
                    }}
                  >
                    {item.isHighlight && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-26px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "#ffffff",
                          border: "1px solid #E2E4E9",
                          borderRadius: "4px",
                          padding: "1px 6px",
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "#2F68FE",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        42%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-Axis Months */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "12px",
            }}
          >
            {CHURN_DATA.map((m) => (
              <span
                key={m.month}
                style={{
                  fontSize: "11px",
                  color: "#868C98",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                {m.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
