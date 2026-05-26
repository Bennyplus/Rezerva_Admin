"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ANALYTICS_STATS,
  BOOKINGS_OVER_TIME_DATA,
  REVENUE_PERFORMANCE_DATA,
  USER_GROWTH_DATA,
  BOOKINGS_BY_LOCATION,
  REPORTS_DATA
} from "@/data/admin-analytics";
import StatCard from "@/components/admin/StatCard";
import styles from "./analytics.module.css";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AnalyticsPage() {
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [bookingsTimeframe, setBookingsTimeframe] = useState<"Weekly" | "Monthly">("Weekly");

  const commonOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#e2e4e9",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
  };

  const bookingsChartOptions = {
    ...commonOptions,
    stroke: { curve: "smooth" as const, width: 2, dashArray: 4 },
    colors: ["#9ea5ad"],
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColors: "#9ea5ad",
      strokeWidth: 2,
    },
    xaxis: {
      categories: BOOKINGS_OVER_TIME_DATA.categories,
      labels: { style: { colors: "#6f767e", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 60,
      tickAmount: 6,
      labels: { style: { colors: "#6f767e", fontSize: "12px" } },
    },
  };

  const revenueChartOptions = {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: "bar" as const },
    plotOptions: {
      bar: {
        columnWidth: "12%",
        borderRadius: 4,
      }
    },
    colors: ["#1a1d1f"],
    xaxis: {
      categories: REVENUE_PERFORMANCE_DATA.categories,
      labels: { style: { colors: "#6f767e", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 60,
      tickAmount: 6,
      labels: { style: { colors: "#6f767e", fontSize: "12px" } },
    },
  };

  const userGrowthChartOptions = {
    ...commonOptions,
    stroke: { curve: "smooth" as const, width: 2 },
    colors: ["#d94625", "#4a6ee0"], // orange-red and blue
    xaxis: {
      categories: USER_GROWTH_DATA.categories,
      labels: { style: { colors: "#6f767e", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 60,
      tickAmount: 6,
      labels: { style: { colors: "#6f767e", fontSize: "12px" } },
    },
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
        </div>
        <div className={styles.headerRight}>
          <button
            className={styles.toggleBtn}
            onClick={() => setShowEmptyState(!showEmptyState)}
          >
            Toggle Empty State
          </button>
          {!showEmptyState && (
            <>
              <button className={styles.todaySelect}>
                Today <ChevronDownIcon />
              </button>
              <button className={styles.exportBtn}>Export</button>
            </>
          )}
        </div>
      </div>

      {showEmptyState ? (
        /* ─── Empty State ─── */
        <div className={styles.emptyCard}>
          <div className={styles.illustration} aria-hidden="true">
            <Image
              src="/images/admin/Items.png"
              alt="No analytics illustration"
              width={460}
              height={380}
              className={styles.illustrationImg}
            />
          </div>
          <h2 className={styles.emptyTitle}>No analytics data available</h2>
          <p className={styles.emptySubtitle}>Platform activity and reports will appear here</p>
        </div>
      ) : (
        /* ─── Populated State ─── */
        <>
          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            {ANALYTICS_STATS.map((stat) => (
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

          {/* Top Charts */}
          <div className={styles.chartsGrid}>
            {/* Bookings Line Chart */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>Bookings Over Time</span>
                <div className={styles.chartControls}>
                  <button
                    className={`${styles.chartToggle} ${bookingsTimeframe === "Weekly" ? styles.active : ""}`}
                    onClick={() => setBookingsTimeframe("Weekly")}
                  >
                    Weekly
                  </button>
                  <button
                    className={`${styles.chartToggle} ${bookingsTimeframe === "Monthly" ? styles.active : ""}`}
                    onClick={() => setBookingsTimeframe("Monthly")}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div style={{ height: 280 }}>
                <ReactApexChart
                  options={bookingsChartOptions}
                  series={BOOKINGS_OVER_TIME_DATA.series}
                  type="line"
                  height="100%"
                />
              </div>
            </div>

            {/* Revenue Bar Chart */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>Revenue Performance</span>
                <button className={styles.chartSelect}>
                  By Week <ChevronDownIcon />
                </button>
              </div>
              <div style={{ height: 280 }}>
                <ReactApexChart
                  options={revenueChartOptions}
                  series={REVENUE_PERFORMANCE_DATA.series}
                  type="bar"
                  height="100%"
                />
              </div>
            </div>
          </div>

          {/* Bottom Charts */}
          <div className={styles.chartsGrid}>
            {/* User Growth */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>User Growth</span>
                <div className={styles.legend}>
                  <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.new}`}></span>
                    New Users
                  </div>
                  <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.returning}`}></span>
                    Returning Users
                  </div>
                </div>
              </div>
              <div style={{ height: 280 }}>
                <ReactApexChart
                  options={userGrowthChartOptions}
                  series={USER_GROWTH_DATA.series}
                  type="line"
                  height="100%"
                />
              </div>
            </div>

            {/* Bookings By Location */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>Bookings By Location</span>
              </div>
              <div className={styles.locationList}>
                {BOOKINGS_BY_LOCATION.map((loc, idx) => {
                  const maxCount = Math.max(...BOOKINGS_BY_LOCATION.map(l => l.count));
                  const percentage = (loc.count / maxCount) * 100;
                  return (
                    <div key={idx} className={styles.locationItem}>
                      <span style={{ width: 60, fontSize: "13px", color: "#1a1d1f" }}>{loc.location}</span>
                      <div className={styles.locationBarWrap}>
                        <div
                          className={styles.locationBar}
                          style={{ width: `${percentage}%`, backgroundColor: loc.color }}
                        ></div>
                      </div>
                      <span className={styles.locationCount}>{loc.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reports Section */}
          <div className={styles.reportsSection}>
            <div className={styles.reportsHeader}>
              <h2 className={styles.reportsTitle}>Reports</h2>
              <p className={styles.reportsSubtitle}>Generate detailed reports and export data</p>
            </div>
            <div className={styles.reportsGrid}>
              {REPORTS_DATA.map((report) => (
                <div key={report.id} className={styles.reportCard}>
                  <div className={`${styles.reportIcon} ${report.type.toLowerCase() === 'pdf' ? styles.pdf : ''}`}>
                    {report.type}
                  </div>
                  <div className={styles.reportInfo}>
                    <div className={styles.reportName}>{report.title}</div>
                    <div className={styles.reportDesc}>{report.description}</div>
                  </div>
                  <button className={styles.reportDownloadBtn}>
                    <DownloadIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Icons
function ChevronDownIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>;
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
