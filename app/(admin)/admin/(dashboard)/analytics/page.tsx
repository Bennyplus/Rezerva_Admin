"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { REPORTS_DATA } from "@/data/admin-analytics";
import Spinner from "@/components/admin/Spinner";
import { analyticsService } from "@/services/analytics-services";
import StatCard from "@/components/admin/StatCard";
import styles from "./analytics.module.css";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AnalyticsPage() {
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [bookingsTimeframe, setBookingsTimeframe] = useState<"Weekly" | "Monthly">("Weekly");
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Analytics page mounted, fetching data...");
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      console.log("Starting fetchAnalyticsData...");
      setLoading(true);
      setError(null);
      console.log("Calling analyticsService.fetchDashboardAnalytics()...");
      const data = await analyticsService.fetchDashboardAnalytics();
      console.log("Analytics data received:", data);
      setAnalyticsData(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to load analytics data";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (reportType: string) => {
    try {
      const blob = await analyticsService.exportReportanalytics() as Blob;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${reportType}-report-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting report:", err);
      setError("Failed to export report");
    }
  };

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
      categories: analyticsData?.bookings_over_time?.map((item: any) => item.label) || [],
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
      categories: analyticsData?.revenue_performance?.map((item: any) => item.label) || [],
      labels: { style: { colors: "#6f767e", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: analyticsData?.revenue_performance
        ? Math.ceil(Math.max(...analyticsData.revenue_performance.map((item: any) => Number(item.value)), 1) * 1.25)
        : 100000,
      tickAmount: 5,
      labels: {
        style: { colors: "#6f767e", fontSize: "12px" },
        formatter: (val: number) => val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`,
      },
    },
  };

  const userGrowthChartOptions = {
    ...commonOptions,
    stroke: { curve: "smooth" as const, width: 2 },
    colors: ["#d94625", "#4a6ee0"], // orange-red and blue
    xaxis: {
      categories: analyticsData?.user_growth?.map((item: any) => item.label) || [],
      labels: { style: { colors: "#6f767e", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      tickAmount: 5,
      labels: { style: { colors: "#6f767e", fontSize: "12px" } },
    },
  };
  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={40} />
      </div>
    );
  }

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
              <button
                className={styles.exportBtn}
                onClick={() => handleExportReport("analytics")}
              >
                Export
              </button>
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
      ) : error ? (
        /* ─── Error State ─── */
        <div className={styles.emptyCard}>
          <p className={styles.emptySubtitle}>{error}</p>
          <button
            className={styles.exportBtn}
            onClick={fetchAnalyticsData}
            style={{ marginTop: "16px" }}
          >
            Retry
          </button>
        </div>
      ) : (
        /* ─── Populated State ─── */
        <>
          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            {analyticsData && (
              <>
                <StatCard
                  label="Total Bookings"
                  value={analyticsData.total_bookings?.toString() || "0"}
                  id="stat-total-bookings"
                  isPositive={true}
                />
                <StatCard
                  label="Revenue"
                  value={`$${Number(analyticsData.revenue || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
                  id="stat-revenue"
                  isPositive={true}
                />
                <StatCard
                  label="Completed Trips"
                  value={analyticsData.completed_trips?.toString() || "0"}
                  id="stat-completed-trips"
                  isPositive={true}
                />
                <StatCard
                  label="Active Users"
                  value={analyticsData.active_users?.toString() || "0"}
                  id="stat-active-users"
                  isPositive={true}
                />
              </>
            )}
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
                  series={[{
                    name: "Bookings",
                    data: analyticsData?.bookings_over_time?.map((item: any) => item.value) || []
                  }]}
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
                  series={[{
                    name: "Revenue",
                    data: analyticsData?.revenue_performance?.map((item: any) => Number(item.value)) || []
                  }]}
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
                  series={[
                    {
                      name: "New Users",
                      data: analyticsData?.user_growth?.map((item: any) => item.new_users) || []
                    },
                    {
                      name: "Returning Users",
                      data: analyticsData?.user_growth?.map((item: any) => item.returning_users) || []
                    }
                  ]}
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
                {analyticsData?.bookings_by_location && analyticsData.bookings_by_location.length > 0 ? (
                  analyticsData.bookings_by_location.map((loc: any, idx: number) => {
                    const maxCount = Math.max(...analyticsData.bookings_by_location.map((l: any) => l.count));
                    const percentage = (loc.count / maxCount) * 100;
                    const colors = ["#FFE8CC", "#F4F5F6", "#FFE2E5", "#D1FADF", "#E0EAFF"];
                    return (
                      <div key={idx} className={styles.locationItem}>
                        <span style={{ width: 60, fontSize: "13px", color: "#1a1d1f" }}>{loc.location}</span>
                        <div className={styles.locationBarWrap}>
                          <div
                            className={styles.locationBar}
                            style={{ width: `${percentage}%`, backgroundColor: colors[idx % colors.length] }}
                          ></div>
                        </div>
                        <span className={styles.locationCount}>{loc.count}</span>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: "#6f767e", fontSize: "13px", margin: "12px 0" }}>No location data available</p>
                )}
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
                  <button
                    className={styles.reportDownloadBtn}
                    onClick={() => handleExportReport(report.id.replace('-report', ''))}
                  >
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
