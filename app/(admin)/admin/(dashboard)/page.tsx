"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import StatCard from "@/components/admin/StatCard";
import {
  DASHBOARD_STATS,
  MONTHLY_REVENUE,
  BOOKING_TRENDS,
  RECENT_BOOKINGS,
} from "@/data/admin-mock";
import styles from "./page.module.css";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

/* ─── Revenue bar chart options ─── */
const revenueChartOptions: ApexOptions = {
  chart: {
    type: "bar",
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: "inherit",
  },
  plotOptions: {
    bar: {
      columnWidth: "45%",
      borderRadius: 3,
    },
  },
  colors: ["#CCCED2"],
  dataLabels: { enabled: false },
  grid: {
    borderColor: "#E2E4E9",
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  legend: { show: false },
  xaxis: {
    categories: MONTHLY_REVENUE.categories,
    labels: { style: { colors: "#868C98", fontSize: "12px" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    tickAmount: 4,
    labels: {
      style: { colors: "#868C98", fontSize: "12px" },
      formatter: (val: number) => `$${val}K`,
    },
  },
};

/* ─── Booking trends donut options ─── */
const total = BOOKING_TRENDS.cancelled + BOOKING_TRENDS.ongoing + BOOKING_TRENDS.scheduled;
const pct = (n: number) => `${Math.round((n / total) * 100)}%`;

const trendsChartOptions: ApexOptions = {
  chart: {
    type: "donut",
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  colors: ["#BEBFC2", "#1a1d1f", "#D8D9DC"],
  labels: ["Cancelled Bookings", "Ongoing Trips", "Scheduled Trips"],
  dataLabels: {
    enabled: true,
    formatter: (_val: string | number | number[], opts?: { seriesIndex?: number }) => {
      const counts = [BOOKING_TRENDS.cancelled, BOOKING_TRENDS.ongoing, BOOKING_TRENDS.scheduled];
      const idx = opts?.seriesIndex ?? 0;
      return pct(counts[idx]);
    },
    style: { fontSize: "12px", fontWeight: "500", colors: ["#fff"] },
    dropShadow: { enabled: false },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "62%",
      },
    },
  },
  legend: { show: false },
  stroke: { width: 0 },
  tooltip: { enabled: false },
};

const trendsSeries = [BOOKING_TRENDS.cancelled, BOOKING_TRENDS.ongoing, BOOKING_TRENDS.scheduled];

/* ─── Status badge helper ─── */
function statusClass(status: string): string {
  switch (status) {
    case "completed":  return styles.statusCompleted;
    case "upcoming":   return styles.statusUpcoming;
    case "ongoing":    return styles.statusOngoing;
    case "cancelled":  return styles.statusCancelled;
    default:           return "";
  }
}

export default function AdminDashboard() {
  const [_openMenu, setOpenMenu] = useState<number | null>(null);

  return (
    <div className={styles.page}>

      {/* ─── Stat Cards ─── */}
      <div className={styles.statsGrid} id="admin-stats">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            id={`stat-${stat.id}`}
            growth={stat.growth}
            isPositive={stat.isPositive}
          />
        ))}
      </div>

      {/* ─── Charts Row ─── */}
      <div className={styles.chartsRow}>

        {/* Total Revenue bar chart */}
        <div className={styles.card} id="admin-revenue-chart">
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Total Revenue</h2>
          </div>
          <div className={styles.revenueChart}>
            <ReactApexChart
              options={revenueChartOptions}
              series={MONTHLY_REVENUE.series}
              type="bar"
              height={260}
            />
          </div>
        </div>

        {/* Booking Trends donut */}
        <div className={styles.card} id="admin-trends-chart">
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Booking Trends</h2>
          </div>
          <div className={styles.trendsBody}>
            <div className={styles.trendsChart}>
              <ReactApexChart
                options={trendsChartOptions}
                series={trendsSeries}
                type="donut"
                width={200}
                height={200}
              />
            </div>
            <div className={styles.trendsLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendLabel}>
                  <span className={`${styles.legendDot} ${styles.dotCancelled}`} />
                  Cancelled Bookings
                </span>
                <span className={styles.legendCount}>{BOOKING_TRENDS.cancelled}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendLabel}>
                  <span className={`${styles.legendDot} ${styles.dotOngoing}`} />
                  Ongoing Trips
                </span>
                <span className={styles.legendCount}>{BOOKING_TRENDS.ongoing}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendLabel}>
                  <span className={`${styles.legendDot} ${styles.dotScheduled}`} />
                  Scheduled Trips
                </span>
                <span className={styles.legendCount}>{BOOKING_TRENDS.scheduled}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Recent Bookings ─── */}
      <div id="admin-recent-bookings">
        <h2 className={styles.sectionTitle}>Recent Bookings</h2>
        <div className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer Name</th>
                  <th>Vehicle</th>
                  <th>Booking Type</th>
                  <th>Booking Status</th>
                  <th className={styles.actionsCol} />
                </tr>
              </thead>
              <tbody>
                {RECENT_BOOKINGS.map((booking, idx) => (
                  <tr key={idx}>
                    <td>{booking.id}</td>
                    <td>{booking.customer}</td>
                    <td>{booking.vehicle}</td>
                    <td>{booking.bookingType}</td>
                    <td>
                      <span className={`${styles.badge} ${statusClass(booking.status)}`}>
                        <span className={styles.badgeDot} />
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className={styles.actionsCol}>
                      <button
                        className={styles.moreBtn}
                        aria-label="More actions"
                        onClick={() => setOpenMenu(idx)}
                      >
                        <MoreIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ─── Inline Icons ─── */
function MoreIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
