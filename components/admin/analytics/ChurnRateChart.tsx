"use client";

import { ChurnResponse } from "@/services/analytics-services";
import styles from "./AnalyticsCharts.module.css";

interface ChurnRateChartProps {
  churnData?: ChurnResponse | null;
}

const DEFAULT_Y_TICKS = ["100%", "80%", "60%", "40%", "20%", "0%"];
const ZERO_Y_TICKS = ["0%", "0%", "0%", "0%", "0%", "0%"];
const DEFAULT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function ChurnRateChart({ churnData }: ChurnRateChartProps) {
  const points = churnData?.points || [];
  const hasDynamicPoints = points.length > 0;

  let yTicks = ZERO_Y_TICKS;
  let xLabels = DEFAULT_MONTHS;
  let maxRate = 0;
  let maxY = 100;
  let peakDate = "";

  if (hasDynamicPoints) {
    maxRate = Math.max(...points.map((p) => p.churn_rate ?? 0), 0);
    maxY = maxRate > 0 ? (maxRate > 80 ? 100 : Math.ceil(maxRate * 1.25)) : 10;

    if (maxRate > 0) {
      const step = maxY / 5;
      yTicks = [5, 4, 3, 2, 1, 0].map(
        (multiplier) => `${Math.round(multiplier * step)}%`,
      );

      // Find peak point for highlight and badge
      let highestRate = 0;
      points.forEach((p) => {
        const rate = p.churn_rate ?? 0;
        if (rate >= highestRate && rate > 0) {
          highestRate = rate;
          peakDate = p.date;
        }
      });
    }

    xLabels = points.map((p) => p.label);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Churn Rate</h3>
          <p className={styles.subtitle}>
            Percentage of users who stopped using Reserva
          </p>
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
          {yTicks.map((tick, idx) => (
            <span
              key={idx}
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
            {hasDynamicPoints ? (
              points.map((item) => {
                const rate = item.churn_rate ?? 0;
                const heightPercent =
                  maxRate > 0 ? (rate / maxY) * 100 : 0;
                const isHighlight = item.date === peakDate && rate > 0;

                return (
                  <div
                    key={item.date}
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
                        width: "8px",
                        height: `${Math.max(heightPercent, rate > 0 ? 5 : 0)}%`,
                        background: isHighlight
                          ? "#2F68FE"
                          : rate > 0
                          ? "#9BBDFB"
                          : "#F3F4F6",
                        borderRadius: "4px 4px 0 0",
                        position: "relative",
                        transition: "height 0.3s ease",
                      }}
                    >
                      {isHighlight && (
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
                            zIndex: 10,
                          }}
                        >
                          {rate}%
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              /* Flat baseline when no data */
              <div
                style={{
                  width: "100%",
                  height: "2px",
                  background: "#E2E4E9",
                }}
              />
            )}
          </div>

          {/* X-Axis Months */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "12px",
            }}
          >
            {xLabels.map((m, idx) => (
              <span
                key={idx}
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
