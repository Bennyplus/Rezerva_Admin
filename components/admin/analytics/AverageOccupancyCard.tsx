"use client";

import styles from "./AnalyticsCharts.module.css";

interface AverageOccupancyCardProps {
  value?: number;
  totalSeats?: number;
  growthPercent?: string;
}

export default function AverageOccupancyCard({
  value = 3.8,
  totalSeats = 4,
  growthPercent = "5.6%",
}: AverageOccupancyCardProps) {
  // Semi-circle gauge using SVG
  const radius = 90;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const progressPercent = Math.min(1, Math.max(0, value / totalSeats));
  const strokeDashoffset = circumference * (1 - progressPercent);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Average Occupancy</h3>
          <p className={styles.subtitle}>Top destination locations by trip count</p>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          marginTop: "10px",
        }}
      >
        {/* Gauge SVG */}
        <div style={{ position: "relative", width: "240px", height: "135px" }}>
          <svg
            viewBox="0 0 220 125"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            {/* Background Arc */}
            <path
              d="M 20,110 A 90,90 0 0,1 200,110"
              fill="none"
              stroke="#E8F1FD"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Progress Arc */}
            <path
              d="M 20,110 A 90,90 0 0,1 200,110"
              fill="none"
              stroke="#68A5FF"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>

          {/* Centered Value */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1,
              }}
            >
              {value}
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "#868C98",
                marginTop: "4px",
                fontWeight: 500,
              }}
            >
              of {totalSeats} Seats
            </span>
          </div>

          {/* Range Labels: 0 and 4 */}
          <div
            style={{
              position: "absolute",
              bottom: "-4px",
              left: "14px",
              fontSize: "12px",
              color: "#868C98",
            }}
          >
            0
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "-4px",
              right: "14px",
              fontSize: "12px",
              color: "#868C98",
            }}
          >
            {totalSeats}
          </div>
        </div>

        {/* Growth badge below gauge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "#F8F9FA",
            padding: "6px 14px",
            borderRadius: "8px",
            marginTop: "24px",
            fontSize: "12px",
            color: "#525866",
            border: "1px solid #EFEFEF",
          }}
        >
          <span style={{ color: "#027A48", fontWeight: 600 }}>
            ↑ {growthPercent}
          </span>
          <span>vs Last month</span>
        </div>
      </div>
    </div>
  );
}
