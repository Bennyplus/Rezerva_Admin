"use client";

import { RevenueTrendResponse } from "@/services/analytics-services";
import styles from "./AnalyticsCharts.module.css";

interface RevenueTrendChartProps {
  trendData?: RevenueTrendResponse | null;
}

const ZERO_Y_TICKS = ["$0", "$0", "$0", "$0", "$0", "$0", "$0"];
const ZERO_X_DAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

export default function RevenueTrendChart({ trendData }: RevenueTrendChartProps) {
  const width = 500;
  const height = 200;

  const points = trendData?.points || [];
  const hasDynamicPoints = points.length > 0;

  // Zero flat baseline when backend doesn't render data
  let pathD = `M 0,${height - 10} L ${width},${height - 10}`;
  let areaD = `M 0,${height - 10} L ${width},${height - 10} L ${width},${height} L 0,${height} Z`;
  let yTicks = ZERO_Y_TICKS;
  let xLabels = ZERO_X_DAYS;
  let tooltip = { show: false, text: "$0", leftPercent: 0, topPx: 0 };

  if (hasDynamicPoints) {
    const maxVal = Math.max(...points.map((p) => p.value), 0);
    const maxY = maxVal > 0 ? Math.ceil(maxVal * 1.25) : 10;

    // Build SVG coordinates
    const coords = points.map((p, i) => {
      const x = (i / Math.max(1, points.length - 1)) * width;
      const y =
        maxVal > 0
          ? height - (p.value / maxY) * (height - 20) - 10
          : height - 10;
      return { x, y, value: p.value, label: p.label };
    });

    pathD = coords.reduce(
      (acc, curr, i) =>
        i === 0 ? `M ${curr.x},${curr.y}` : `${acc} L ${curr.x},${curr.y}`,
      "",
    );
    areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

    if (maxVal > 0) {
      const step = maxY / 6;
      yTicks = [6, 5, 4, 3, 2, 1, 0].map(
        (multiplier) => `$${Math.round(multiplier * step)}`,
      );

      // Peak tooltip
      const peakPoint = coords.reduce(
        (max, c) => (c.value > max.value ? c : max),
        coords[0],
      );
      if (peakPoint && peakPoint.value > 0) {
        tooltip = {
          show: true,
          text: `$${peakPoint.value}`,
          leftPercent: (peakPoint.x / width) * 100,
          topPx: Math.max(20, peakPoint.y - 12),
        };
      }
    }

    // Dynamic X labels (pick ~7 evenly spaced labels)
    const stepSize = Math.max(1, Math.floor(points.length / 7));
    xLabels = points
      .filter((_, idx) => idx % stepSize === 0 || idx === points.length - 1)
      .slice(0, 7)
      .map((p) => p.label);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Revenue Trend</h3>
          <p className={styles.subtitle}>Track revenue over time.</p>
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
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2F68FE" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2F68FE" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Gradient */}
              <path d={areaD} fill="url(#revenueGrad)" />

              {/* Stroke line */}
              <path
                d={pathD}
                fill="none"
                stroke="#2F68FE"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Tooltip Badge */}
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
                  fontSize: "12px",
                  color: "#868C98",
                  fontWeight: 400,
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
