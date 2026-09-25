"use client";

import { PayoutsResponse } from "@/services/analytics-services";
import styles from "./AnalyticsCharts.module.css";

interface PayoutDay {
  day: string;
  amount: number;
  label: string;
}

interface MonthlyPayoutsChartProps {
  payoutsData?: PayoutsResponse | null;
}

const ZERO_PAYOUTS: PayoutDay[] = [
  { day: "Mon", amount: 0, label: "$0" },
  { day: "Tue", amount: 0, label: "$0" },
  { day: "Wed", amount: 0, label: "$0" },
  { day: "Thur", amount: 0, label: "$0" },
  { day: "Fri", amount: 0, label: "$0" },
  { day: "Sat", amount: 0, label: "$0" },
  { day: "Sun", amount: 0, label: "$0" },
];

const ZERO_TICKS = ["$0", "$0", "$0", "$0", "$0", "$0", "$0"];

export default function MonthlyPayoutsChart({
  payoutsData,
}: MonthlyPayoutsChartProps) {
  const hasDynamicPoints = Boolean(
    payoutsData?.points && payoutsData.points.length > 0,
  );

  let payoutsList = ZERO_PAYOUTS;
  let maxVal = 10;
  let ticks = ZERO_TICKS;

  if (hasDynamicPoints && payoutsData) {
    const dayTotals: Record<string, number> = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thur: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    payoutsData.points.forEach((p) => {
      const d = new Date(p.date);
      if (!isNaN(d.getTime())) {
        const rawDay = [
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thur",
          "Fri",
          "Sat",
        ][d.getDay()];
        const key = rawDay === "Thu" ? "Thur" : rawDay;
        dayTotals[key] = (dayTotals[key] || 0) + (p.value || 0);
      }
    });

    const highest = Math.max(...Object.values(dayTotals), 0);
    maxVal = highest > 0 ? Math.ceil(highest * 1.25) : 10;

    payoutsList = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"].map(
      (day) => ({
        day,
        amount: dayTotals[day],
        label: `$${dayTotals[day].toLocaleString()}`,
      }),
    );

    if (highest > 0) {
      const step = maxVal / 6;
      ticks = [0, 1, 2, 3, 4, 5, 6].map((i) => `$${Math.round(i * step)}`);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Monthly Payouts</h3>
          <p className={styles.subtitle}>Track driver payouts by month.</p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          marginTop: "10px",
          flex: 1,
        }}
      >
        {payoutsList.map((item) => {
          const widthPercent =
            maxVal > 0 && item.amount > 0
              ? Math.min(100, Math.max(2, (item.amount / maxVal) * 100))
              : 0;

          return (
            <div
              key={item.day}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span
                style={{
                  width: "36px",
                  fontSize: "13px",
                  color: "#525866",
                  fontWeight: 500,
                }}
              >
                {item.day}
              </span>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    height: "12px",
                    width: item.amount > 0 ? `${widthPercent}%` : "4px",
                    background: item.amount > 0 ? "#2F68FE" : "#E5E7EB",
                    borderRadius: "9999px",
                    transition: "width 0.4s ease",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "#525866",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* X-Axis Labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "16px",
            borderTop: "1px solid #F3F4F6",
            paddingLeft: "52px",
          }}
        >
          {ticks.map((t, idx) => (
            <span
              key={idx}
              style={{
                fontSize: "12px",
                color: "#868C98",
                fontWeight: 400,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
