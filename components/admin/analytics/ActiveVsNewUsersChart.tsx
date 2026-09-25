"use client";

import { ActiveVsNewUsersResponse } from "@/services/analytics-services";
import styles from "./AnalyticsCharts.module.css";

interface ActiveVsNewUsersChartProps {
  activeVsNewData?: ActiveVsNewUsersResponse | null;
}

const ZERO_Y_TICKS = ["0", "0", "0", "0", "0", "0", "0"];
const ZERO_X_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function ActiveVsNewUsersChart({
  activeVsNewData,
}: ActiveVsNewUsersChartProps) {
  const points = activeVsNewData?.points || [];
  const hasDynamicPoints = points.length > 0;

  let yTicks = ZERO_Y_TICKS;
  let xLabels = ZERO_X_MONTHS;
  let maxY = 10;
  let maxVal = 0;
  let peakItem: { label: string; maxVal: number } | null = null;

  if (hasDynamicPoints) {
    maxVal = Math.max(
      ...points.flatMap((p) => [p.active_users, p.new_users]),
      0,
    );
    maxY = maxVal > 0 ? Math.ceil(maxVal * 1.25) : 10;

    if (maxVal > 0) {
      const step = maxY / 6;
      yTicks = [6, 5, 4, 3, 2, 1, 0].map(
        (multiplier) => `${Math.round(multiplier * step)}`,
      );

      // Find highest single bar point for peak badge
      let currentMax = 0;
      points.forEach((p) => {
        const higher = Math.max(p.active_users, p.new_users);
        if (higher > currentMax) {
          currentMax = higher;
          peakItem = { label: p.label, maxVal: currentMax };
        }
      });
    }

    xLabels = points.map((p) => p.label);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Active Users vs New Users</h3>
          <p className={styles.subtitle}>Compare active users with new sign-ups</p>
        </div>

        <button type="button" className={styles.selectBtn}>
          <span>This Year</span>
          <ChevronDownIcon />
        </button>
      </div>

      <div style={{ display: "flex", gap: "12px", flex: 1, marginTop: "10px" }}>
        {/* Y-Axis */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "200px",
            paddingRight: "8px",
          }}
        >
          {yTicks.map((tick, idx) => (
            <span
              key={idx}
              style={{
                fontSize: "12px",
                color: "#868C98",
                fontWeight: 400,
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
              height: "200px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              padding: "0 6px",
              position: "relative",
              borderBottom: "1px solid #F3F4F6",
            }}
          >
            {hasDynamicPoints ? (
              points.map((item) => {
                const activeHeight =
                  maxVal > 0 ? (item.active_users / maxY) * 100 : 0;
                const newHeight =
                  maxVal > 0 ? (item.new_users / maxY) * 100 : 0;
                const isPeak =
                  peakItem &&
                  peakItem.label === item.label &&
                  peakItem.maxVal > 0;

                return (
                  <div
                    key={item.date}
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "3px",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    {/* Active User Bar (Light Blue) */}
                    <div
                      style={{
                        width: "6px",
                        height: `${Math.max(activeHeight, item.active_users > 0 ? 4 : 0)}%`,
                        background: "#D4E4FC",
                        borderRadius: "3px 3px 0 0",
                      }}
                    />

                    {/* New User Bar (Dark Blue) */}
                    <div
                      style={{
                        width: "6px",
                        height: `${Math.max(newHeight, item.new_users > 0 ? 4 : 0)}%`,
                        background: "#2F68FE",
                        borderRadius: "3px 3px 0 0",
                        position: "relative",
                      }}
                    >
                      {/* Tooltip on peak bar */}
                      {isPeak && peakItem && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-24px",
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
                          {peakItem.maxVal}
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

          {/* X-Axis */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "12px",
              paddingLeft: "6px",
              paddingRight: "6px",
            }}
          >
            {xLabels.map((lbl, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "11px",
                  color: "#868C98",
                  fontWeight: 400,
                  textAlign: "center",
                }}
              >
                {lbl}
              </span>
            ))}
          </div>

          {/* Bottom Legend */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
              marginTop: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#D4E4FC",
                }}
              />
              <span style={{ fontSize: "12px", color: "#525866" }}>
                Active User
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#2F68FE",
                }}
              />
              <span style={{ fontSize: "12px", color: "#525866" }}>
                New User
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
