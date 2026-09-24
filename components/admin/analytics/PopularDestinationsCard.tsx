"use client";

import styles from "./AnalyticsCharts.module.css";

interface DestinationItem {
  rank: number;
  name: string;
  trips: string;
}

const DESTINATIONS: DestinationItem[] = [
  { rank: 1, name: "Victoria Island", trips: "1000 Trips" },
  { rank: 2, name: "Ikeja", trips: "734 Trips" },
  { rank: 3, name: "Ikoyi", trips: "240 Trips" },
  { rank: 4, name: "Yaba", trips: "240 Trips" },
  { rank: 5, name: "Idk places bruh", trips: "120 Trips" },
];

export default function PopularDestinationsCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Popular Destinations</h3>
          <p className={styles.subtitle}>Top destination locations by trip count</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: "16px",
          flex: 1,
          alignItems: "stretch",
        }}
      >
        {/* Left Column: Ranked List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.rank}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 10px",
                background: "#F9FAFB",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "#ffffff",
                  border: "1px solid #E2E4E9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#111827",
                  flexShrink: 0,
                }}
              >
                {dest.rank}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#111827",
                    lineHeight: 1.2,
                  }}
                >
                  {dest.name}
                </span>
                <span style={{ fontSize: "11px", color: "#868C98" }}>
                  {dest.trips}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Styled Map Preview matching Screenshot 5 */}
        <div
          style={{
            position: "relative",
            background: "#E8F0F8",
            borderRadius: "12px",
            overflow: "hidden",
            minHeight: "220px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #E2E4E9",
          }}
        >
          {/* Stylized vector map background representation */}
          <svg
            viewBox="0 0 300 240"
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          >
            {/* Water and land shapes */}
            <path
              d="M0,0 L300,0 L300,240 L0,240 Z"
              fill="#EBF4EE"
            />
            <path
              d="M 50,240 C 90,200 130,220 180,210 C 220,200 260,220 300,190 L 300,240 Z"
              fill="#D6EAF8"
            />
            <path
              d="M 120,180 C 160,170 200,185 240,175 C 270,165 300,180 300,180 L 300,200 L 120,200 Z"
              fill="#D6EAF8"
            />
            {/* Roads */}
            <path
              d="M 60,0 L 100,100 L 170,140 L 190,240"
              stroke="#ffffff"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M 10,130 L 100,100 L 250,70 L 300,80"
              stroke="#ffffff"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M 170,140 L 280,140"
              stroke="#ffffff"
              strokeWidth="3"
              fill="none"
            />

            {/* Labels in map */}
            <text x="110" y="55" fontSize="11" fill="#4B5563" fontWeight="600">Ijoko</text>
            <text x="200" y="45" fontSize="10" fill="#4B5563" fontWeight="600">Magboro</text>
            <text x="135" y="115" fontSize="16" fill="#111827" fontWeight="bold">Agege</text>
            <text x="175" y="125" fontSize="18" fill="#111827" fontWeight="800">Lagos</text>
            <text x="235" y="120" fontSize="12" fill="#4B5563" fontWeight="600">Ikorodu</text>
            <text x="140" y="165" fontSize="11" fill="#4B5563" fontWeight="600">Ikotun</text>
            <text x="80" y="210" fontSize="14" fill="#1F2937" fontWeight="700">Alasia</text>
          </svg>

          {/* Zoom controls */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "#ffffff",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              style={{
                border: "none",
                background: "transparent",
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#4B5563",
              }}
            >
              +
            </button>
            <button
              type="button"
              style={{
                border: "none",
                borderTop: "1px solid #E5E7EB",
                background: "transparent",
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#4B5563",
              }}
            >
              −
            </button>
          </div>

          {/* Marker 1: Ikeja */}
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "40%",
              transform: "translate(-50%, -100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#2F68FE",
                boxShadow: "0 0 0 3px rgba(47, 104, 254, 0.3)",
              }}
            />
            <span
              style={{
                background: "#ffffff",
                borderRadius: "4px",
                padding: "1px 5px",
                fontSize: "9px",
                fontWeight: 600,
                color: "#111827",
                marginTop: "2px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              Ikeja
            </span>
          </div>

          {/* Marker 2: Yaba */}
          <div
            style={{
              position: "absolute",
              top: "76%",
              left: "58%",
              transform: "translate(-50%, -100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                background: "#ffffff",
                borderRadius: "4px",
                padding: "1px 5px",
                fontSize: "9px",
                fontWeight: 600,
                color: "#111827",
                marginBottom: "2px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              Yaba
            </span>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#2F68FE",
                boxShadow: "0 0 0 3px rgba(47, 104, 254, 0.3)",
              }}
            />
          </div>

          {/* Marker 3: Victoria Island */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#2F68FE",
                boxShadow: "0 0 0 3px rgba(47, 104, 254, 0.3)",
              }}
            />
            <span
              style={{
                background: "#ffffff",
                borderRadius: "4px",
                padding: "1px 5px",
                fontSize: "9px",
                fontWeight: 600,
                color: "#111827",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              Victoria Island
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
