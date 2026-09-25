"use client";

import { UserGrowthResponse } from "@/services/analytics-services";
import styles from "./AnalyticsCharts.module.css";

interface UserGrowthChartProps {
  userGrowthData?: UserGrowthResponse | null;
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

export default function UserGrowthChart({
  userGrowthData,
}: UserGrowthChartProps) {
  const width = 500;
  const height = 200;

  const points = userGrowthData?.points || [];
  const hasDynamicPoints = points.length > 0;

  let yTicks = ZERO_Y_TICKS;
  let xLabels = ZERO_X_MONTHS;
  let pathD = `M 0,${height - 10} L ${width},${height - 10}`;
  let areaD = `M 0,${height - 10} L ${width},${height - 10} L ${width},${height} L 0,${height} Z`;
  let tooltip = { show: false, text: "0", leftPercent: 0, topPx: 0 };

  if (hasDynamicPoints) {
    const maxVal = Math.max(...points.map((p) => p.value), 0);
    const maxY = maxVal > 0 ? Math.ceil(maxVal * 1.25) : 10;

    const coords = points.map((p, i) => {
      const x = (i / Math.max(1, points.length - 1)) * width;
      const y =
        maxVal > 0
          ? height - (p.value / maxY) * (height - 24) - 10
          : height - 10;
      return { x, y, value: p.value, label: p.label };
    });

    pathD = coords.reduce((acc, curr, i, arr) => {
      if (i === 0) return `M ${curr.x},${curr.y}`;
      const prev = arr[i - 1];
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
    }, "");
    areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

    if (maxVal > 0) {
      const step = maxY / 6;
      yTicks = [6, 5, 4, 3, 2, 1, 0].map(
        (multiplier) => `${Math.round(multiplier * step)}`,
      );

      const peakPoint = coords.reduce(
        (max, c) => (c.value >= max.value ? c : max),
        coords[0],
      );
      if (peakPoint && peakPoint.value > 0) {
        tooltip = {
          show: true,
          text: `${peakPoint.value}`,
          leftPercent: (peakPoint.x / width) * 100,
          topPx: Math.max(16, peakPoint.y - 12),
        };
      }
    }

    xLabels = points.map((p) => p.label);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>User Growth</h3>
          <p className={styles.subtitle}>Total Users Over Time</p>
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
              preserveAspectRatio="none"
              style={{ width: "100%", height: "100%" }}
            >
              <defs>
                <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#868C98" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#868C98" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              <path d={areaD} fill="url(#userGrowthGrad)" />
              <path
                d={pathD}
                fill="none"
                stroke="#667085"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* Peak Tooltip Badge */}
            {tooltip.show && (
              <div
                style={{
                  position: "absolute",
                  top: `${tooltip.topPx}px`,
                  left: `${tooltip.leftPercent}%`,
                  transform: "translate(-50%, -100%)",
                  background: "#ffffff",
                  border: "1px solid #E2E4E9",
                  borderRadius: "6px",
                  padding: "2px 8px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#2F68FE",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {tooltip.text}
              </div>
            )}
          </div>

          {/* X-Axis */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "12px",
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
