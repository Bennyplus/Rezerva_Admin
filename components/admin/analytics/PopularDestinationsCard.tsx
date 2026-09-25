"use client";

import { CSSProperties } from "react";
import { PopularDestinationsResponse } from "@/services/analytics-services";
import styles from "./AnalyticsCharts.module.css";

interface PopularDestinationsCardProps {
  destinationsData?: PopularDestinationsResponse | null;
}

function MapPin({
  name,
  position,
  isTop = true,
}: {
  name: string;
  position: CSSProperties;
  isTop?: boolean;
}) {
  const shortName = name.split(",")[0];
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: isTop ? "column" : "column-reverse",
        alignItems: "center",
        ...position,
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
          maxWidth: "95px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          margin: "2px 0",
        }}
      >
        {shortName}
      </span>
    </div>
  );
}

export default function PopularDestinationsCard({
  destinationsData,
}: PopularDestinationsCardProps) {
  const results = destinationsData?.results || [];
  const hasResults = results.length > 0;

  const marker1 = results[1] || results[0];
  const marker2 = results[2];
  const marker3 = results[0];

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
          {hasResults ? (
            results.map((dest) => (
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
                    {dest.trip_count} {dest.trip_count === 1 ? "Trip" : "Trips"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#868C98",
                fontSize: "13px",
              }}
            >
              No popular destinations recorded yet
            </div>
          )}
        </div>

        {/* Right Column: Styled Map Preview */}
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
          <svg
            viewBox="0 0 300 240"
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          >
            <path d="M0,0 L300,0 L300,240 L0,240 Z" fill="#EBF4EE" />
            <path
              d="M 50,240 C 90,200 130,220 180,210 C 220,200 260,220 300,190 L 300,240 Z"
              fill="#D6EAF8"
            />
            <path
              d="M 120,180 C 160,170 200,185 240,175 C 270,165 300,180 300,180 L 300,200 L 120,200 Z"
              fill="#D6EAF8"
            />
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
            <path d="M 170,140 L 280,140" stroke="#ffffff" strokeWidth="3" fill="none" />
            <text x="135" y="115" fontSize="15" fill="#111827" fontWeight="bold">Lagos</text>
            <text x="220" y="115" fontSize="11" fill="#4B5563" fontWeight="600">Ikeja</text>
            <text x="80" y="200" fontSize="12" fill="#1F2937" fontWeight="600">Oshodi</text>
          </svg>

          {/* Map Controls */}
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
            }}
          >
            <span style={{ padding: "3px 8px", fontSize: "12px", fontWeight: "bold", color: "#4B5563" }}>+</span>
            <span style={{ padding: "3px 8px", fontSize: "12px", fontWeight: "bold", color: "#4B5563", borderTop: "1px solid #E5E7EB" }}>−</span>
          </div>

          {/* Dynamic Pins */}
          {marker1 && (
            <MapPin
              name={marker1.name}
              position={{ top: "35%", left: "40%", transform: "translate(-50%, -100%)" }}
              isTop={true}
            />
          )}
          {marker2 && (
            <MapPin
              name={marker2.name}
              position={{ top: "76%", left: "58%", transform: "translate(-50%, -100%)" }}
              isTop={false}
            />
          )}
          {marker3 && (
            <MapPin
              name={marker3.name}
              position={{ bottom: "12px", right: "12px" }}
              isTop={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
