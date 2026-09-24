"use client";

import styles from "./AnalyticsCharts.module.css";

const POINTS = [
  { day: "Mon", val: 1 },
  { day: "Tue", val: 9 },
  { day: "Wed", val: 6 },
  { day: "Thur", val: 45 },
  { day: "Fri", val: 9 },
  { day: "Sat", val: 34 },
  { day: "Sun", val: 40 },
];

const Y_TICKS = ["$60M", "$50M", "$40M", "$30M", "$20M", "$10M", "$0"];
const MAX_VAL = 60;

export default function CommissionTrendChart() {
  // SVG coordinates: viewBox 0 0 500 240
  const width = 460;
  const height = 200;
  const paddingLeft = 10;
  const paddingRight = 10;
  const chartWidth = width - paddingLeft - paddingRight;

  const coords = POINTS.map((p, i) => {
    const x = paddingLeft + (i / (POINTS.length - 1)) * chartWidth;
    const y = height - (p.val / MAX_VAL) * height;
    return { x, y, day: p.day, val: p.val };
  });

  const pathD = coords.reduce(
    (acc, curr, i) => (i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    "",
  );

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
          {Y_TICKS.map((tick) => (
            <span
              key={tick}
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
                  r="4.5"
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
            {POINTS.map((p) => (
              <span
                key={p.day}
                style={{
                  fontSize: "12px",
                  color: "#868C98",
                  fontWeight: 400,
                }}
              >
                {p.day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
