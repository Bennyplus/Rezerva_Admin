"use client";

import { CommissionTrendResponse } from "@/services/analytics-services";
import styles from "./AnalyticsCharts.module.css";

interface CommissionTrendChartProps {
  commissionData?: CommissionTrendResponse | null;
}

const ZERO_Y_TICKS = ["$0", "$0", "$0", "$0", "$0", "$0", "$0"];
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

export default function CommissionTrendChart({
  commissionData,
}: CommissionTrendChartProps) {
  // SVG coordinates: viewBox 0 0 460 200
  const width = 460;
  const height = 200;
  const paddingLeft = 10;
  const paddingRight = 10;
  const chartWidth = width - paddingLeft - paddingRight;

  const points = commissionData?.points || [];
  const hasDynamicPoints = points.length > 0;

  let yTicks = ZERO_Y_TICKS;
  let xLabels = ZERO_X_MONTHS;
  let coords: { x: number; y: number; label: string; value: number }[] = [];
  let pathD = `M ${paddingLeft} ${height - 10} L ${width - paddingRight} ${height - 10}`;

  if (hasDynamicPoints) {
    const maxVal = Math.max(...points.map((p) => p.value), 0);
    const maxY = maxVal > 0 ? Math.ceil(maxVal * 1.25) : 10;

    coords = points.map((p, i) => {
      const x = paddingLeft + (i / Math.max(1, points.length - 1)) * chartWidth;
      const y =
        maxVal > 0
          ? height - (p.value / maxY) * (height - 24) - 12
          : height - 12;
      return { x, y, label: p.label, value: p.value };
    });

    pathD = coords.reduce(
      (acc, curr, i) =>
        i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`,
      "",
    );

    if (maxVal > 0) {
      const step = maxY / 6;
      yTicks = [6, 5, 4, 3, 2, 1, 0].map(
        (multiplier) => `$${Math.round(multiplier * step)}`,
      );
    }

    xLabels = points.map((p) => p.label);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Commission Trend</h3>
          <p className={styles.subtitle}>Track commission earnings over time.</p>
        </div>
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

        {/* SVG Chart area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ height: "200px", width: "100%", position: "relative" }}>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              style={{ width: "100%", height: "100%", overflow: "visible" }}
            >
              {/* Horizontal grid lines */}
              {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
                const y = (idx / 6) * height;
                return (
                  <line
                    key={idx}
                    x1="0"
                    y1={y}
                    x2={width}
                    y2={y}
                    stroke="#F3F4F6"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Connecting line */}
              <path
                d={pathD}
                fill="none"
                stroke="#868C98"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data circles */}
              {coords.map((c, i) => (
                <circle
                  key={i}
                  cx={c.x}
                  cy={c.y}
                  r="4"
                  fill="#667085"
                />
              ))}
            </svg>
          </div>

          {/* X-Axis */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "12px",
              paddingLeft: `${paddingLeft}px`,
              paddingRight: `${paddingRight}px`,
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
        </div>
      </div>
    </div>
  );
}
