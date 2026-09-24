"use client";

import styles from "./AnalyticsCharts.module.css";

const Y_TICKS = ["60", "50", "40", "30", "20", "10", "0"];
const X_DAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

export default function UserGrowthChart() {
  const width = 500;
  const height = 200;

  // Smooth gray curve matching Screenshot 3 & 4
  const pathD = `M 0,140 C 30,135 60,125 100,120 C 140,110 170,95 200,98 C 230,105 260,85 300,75 C 340,70 370,80 400,60 C 430,45 460,50 500,40`;
  const areaD = `${pathD} L 500,${height} L 0,${height} Z`;

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

            {/* Tooltip Badge at 42 */}
            <div
              style={{
                position: "absolute",
                top: "78px",
                left: "40%",
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
              }}
            >
              42
            </div>
          </div>

          {/* X-Axis */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "12px",
            }}
          >
            {X_DAYS.map((day) => (
              <span
                key={day}
                style={{
                  fontSize: "12px",
                  color: "#868C98",
                  fontWeight: 400,
                }}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
