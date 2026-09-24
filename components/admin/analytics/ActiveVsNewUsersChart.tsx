"use client";

import styles from "./AnalyticsCharts.module.css";

interface DayData {
  day: string;
  active: number;
  newUsers: number;
}

const DAYS_DATA: DayData[] = [
  { day: "Mon", active: 45, newUsers: 22 },
  { day: "Tue", active: 25, newUsers: 32 },
  { day: "Wed", active: 36, newUsers: 23 },
  { day: "Thur", active: 45, newUsers: 42 },
  { day: "Fri", active: 14, newUsers: 23 },
  { day: "Sat", active: 34, newUsers: 23 },
  { day: "Sun", active: 45, newUsers: 36 },
];

const Y_TICKS = ["60", "50", "40", "30", "20", "10", "0"];
const MAX_VAL = 60;

export default function ActiveVsNewUsersChart() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Active Users vs New Users</h3>
          <p className={styles.subtitle}>Compare active users with new sign-ups</p>
        </div>

        <button type="button" className={styles.selectBtn}>
          <span>By Week</span>
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

        {/* Bars Container */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              height: "200px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              padding: "0 10px",
              position: "relative",
              borderBottom: "1px solid #F3F4F6",
            }}
          >
            {DAYS_DATA.map((item) => {
              const activeHeight = (item.active / MAX_VAL) * 100;
              const newHeight = (item.newUsers / MAX_VAL) * 100;

              return (
                <div
                  key={item.day}
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "4px",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  {/* Active User Bar (Light Blue) */}
                  <div
                    style={{
                      width: "8px",
                      height: `${activeHeight}%`,
                      background: "#D4E4FC",
                      borderRadius: "4px 4px 0 0",
                    }}
                  />

                  {/* New User Bar (Dark Blue) */}
                  <div
                    style={{
                      width: "8px",
                      height: `${newHeight}%`,
                      background: "#2F68FE",
                      borderRadius: "4px 4px 0 0",
                      position: "relative",
                    }}
                  >
                    {/* Tooltip on Saturday */}
                    {item.day === "Sat" && (
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
                        }}
                      >
                        23
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-Axis */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "12px",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            {DAYS_DATA.map((d) => (
              <span
                key={d.day}
                style={{
                  fontSize: "12px",
                  color: "#868C98",
                  fontWeight: 400,
                  textAlign: "center",
                  width: "20px",
                }}
              >
                {d.day}
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
