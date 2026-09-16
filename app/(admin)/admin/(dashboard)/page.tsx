"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/admin/Spinner";
import {
  dashboardService,
  AdminDashboardResponse,
  DashboardStatMetric,
} from "@/services/dashboard-service";
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter";
import styles from "./page.module.css";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

/* ─── Helpers ─── */
function formatGrowth(metric?: DashboardStatMetric): string | undefined {
  if (!metric || !metric.growth_percentage) return undefined;
  const num = parseFloat(metric.growth_percentage);
  if (num === 0 || metric.growth_direction === "flat") return undefined;
  const prefix = metric.growth_direction === "up" ? "+" : "-";
  return `${prefix}${num}%`;
}

function formatCompactCurrency(val: number): string {
  if (val >= 1000000000) {
    const b = val / 1000000000;
    return `$${Number.isInteger(b) ? b : b.toFixed(1)}B`;
  }
  if (val >= 1000000) {
    const m = val / 1000000;
    return `$${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  if (val >= 1000) {
    const k = val / 1000;
    return `$${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return `$${val}`;
}

export default function AdminDashboard() {
  const formatCurrency = useCurrencyFormatter();
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [userGrowthFilter, setUserGrowthFilter] = useState("By Week");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getMainDashboard();
        setData(res);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* ─── Determine if any active data exists ─── */
  const hasActiveData = useMemo(() => {
    if (!data) return false;
    const rev = parseFloat(data.total_revenue?.raw_value || "0");
    const pas = parseFloat(data.total_passengers?.raw_value || "0");
    const drv = parseFloat(data.total_drivers?.raw_value || "0");
    const trp = parseFloat(data.total_trips?.raw_value || "0");
    const userGrowthActive = data.user_growth?.some((d) => parseFloat(d.value) > 0);
    const revTrendActive = data.revenue_trend?.some((d) => parseFloat(d.value) > 0);

    return rev > 0 || pas > 0 || drv > 0 || trp > 0 || Boolean(userGrowthActive) || Boolean(revTrendActive);
  }, [data]);

  /* ─── User Growth Chart Options ─── */
  const userGrowthCategories = useMemo(() => {
    if (data?.user_growth && data.user_growth.length > 0) {
      return data.user_growth.map((d) => d.label);
    }
    return ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  }, [data]);

  const userGrowthValues = useMemo(() => {
    if (data?.user_growth && data.user_growth.length > 0) {
      return data.user_growth.map((d) => parseFloat(d.value) || 0);
    }
    return [];
  }, [data]);

  const hasUserGrowthData = useMemo(
    () => userGrowthValues.some((v) => v > 0),
    [userGrowthValues]
  );

  const maxUserVal = useMemo(
    () => (userGrowthValues.length > 0 ? Math.max(...userGrowthValues) : 0),
    [userGrowthValues]
  );

  const userGrowthChartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "inherit",
      },
      colors: ["#375DFB"],
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        width: 2.5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.25,
          opacityTo: 0.02,
          stops: [0, 95, 100],
        },
      },
      grid: {
        borderColor: "#E2E4E9",
        strokeDashArray: 0,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      markers: {
        size: hasUserGrowthData ? 3.5 : 0,
        colors: ["#375DFB"],
        strokeColors: "#ffffff",
        strokeWidth: 2,
        hover: { size: 5 },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} users`,
        },
      },
      xaxis: {
        categories: userGrowthCategories,
        labels: {
          style: { colors: "#868C98", fontSize: "12px", fontFamily: "inherit" },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: maxUserVal > 60 ? Math.ceil(maxUserVal * 1.2) : 60,
        tickAmount: 6,
        labels: {
          style: { colors: "#868C98", fontSize: "12px", fontFamily: "inherit" },
          formatter: (val: number) => Math.round(val).toString(),
        },
      },
    }),
    [userGrowthCategories, maxUserVal, hasUserGrowthData]
  );

  const userGrowthSeries = useMemo(
    () => [
      {
        name: "Users",
        data: hasUserGrowthData ? userGrowthValues : [],
      },
    ],
    [userGrowthValues, hasUserGrowthData]
  );

  /* ─── Revenue Trend Chart Options ─── */
  const revenueTrendCategories = useMemo(() => {
    if (data?.revenue_trend && data.revenue_trend.length > 0) {
      return data.revenue_trend.map((d) => d.label);
    }
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  }, [data]);

  const revenueTrendValues = useMemo(() => {
    if (data?.revenue_trend && data.revenue_trend.length > 0) {
      return data.revenue_trend.map((d) => parseFloat(d.value) || 0);
    }
    return [];
  }, [data]);

  const hasRevenueData = useMemo(
    () => revenueTrendValues.some((v) => v > 0),
    [revenueTrendValues]
  );

  const maxRevenueVal = useMemo(
    () => (revenueTrendValues.length > 0 ? Math.max(...revenueTrendValues) : 0),
    [revenueTrendValues]
  );

  const revenueTrendChartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "inherit",
      },
      colors: ["#375DFB"],
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        width: 2.5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.25,
          opacityTo: 0.02,
          stops: [0, 95, 100],
        },
      },
      grid: {
        borderColor: "#E2E4E9",
        strokeDashArray: 0,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      markers: {
        size: hasRevenueData ? 3.5 : 0,
        colors: ["#375DFB"],
        strokeColors: "#ffffff",
        strokeWidth: 2,
        hover: { size: 5 },
      },
      tooltip: {
        y: {
          formatter: (val: number) => formatCurrency(val),
        },
      },
      xaxis: {
        categories: revenueTrendCategories,
        labels: {
          style: { colors: "#868C98", fontSize: "12px", fontFamily: "inherit" },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: maxRevenueVal > 0 ? (maxRevenueVal < 1000 ? Math.ceil(maxRevenueVal * 1.2) : Math.ceil(maxRevenueVal * 1.25)) : 60000000,
        tickAmount: 6,
        labels: {
          style: { colors: "#868C98", fontSize: "12px", fontFamily: "inherit" },
          formatter: (val: number) => formatCompactCurrency(val),
        },
      },
    }),
    [revenueTrendCategories, maxRevenueVal, hasRevenueData, formatCurrency]
  );

  const revenueTrendSeries = useMemo(
    () => [
      {
        name: "Revenue",
        data: hasRevenueData ? revenueTrendValues : [],
      },
    ],
    [revenueTrendValues, hasRevenueData]
  );

  /* ─── Loading State ─── */
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          minHeight: "60vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner size={40} />
      </div>
    );
  }

  // Fallback defaults if null
  const revenueStat = data?.total_revenue;
  const passengersStat = data?.total_passengers;
  const driversStat = data?.total_drivers;
  const tripsStat = data?.total_trips;

  return (
    <div className={styles.page}>
      {/* ─── 4 Stat Cards Grid ─── */}
      <div className={styles.statsGrid} id="admin-dashboard-stats">
        <StatCard
          label={revenueStat?.label || "Total Revenue"}
          value={revenueStat?.value || "$0"}
          id="stat-total-revenue"
          growth={formatGrowth(revenueStat)}
          isPositive={revenueStat?.growth_direction === "up"}
        />
        <StatCard
          label={passengersStat?.label || "Total Passengers"}
          value={passengersStat?.value || "0"}
          id="stat-total-passengers"
          growth={formatGrowth(passengersStat)}
          isPositive={passengersStat?.growth_direction === "up"}
        />
        <StatCard
          label={driversStat?.label || "Total Drivers"}
          value={driversStat?.value || "0"}
          id="stat-total-drivers"
          growth={formatGrowth(driversStat)}
          isPositive={driversStat?.growth_direction === "up"}
        />
        <StatCard
          label={tripsStat?.label || "Total Trips"}
          value={tripsStat?.value || "0"}
          id="stat-total-trips"
          growth={formatGrowth(tripsStat)}
          isPositive={tripsStat?.growth_direction === "up"}
        />
      </div>

      {/* ─── Charts Row (2 columns) ─── */}
      <div className={styles.chartsRow}>
        {/* Left: User Growth */}
        <div className={styles.chartCard} id="admin-user-growth-card">
          <div className={styles.chartHeader}>
            <div className={styles.titleArea}>
              <h2 className={styles.chartTitle}>User Growth</h2>
              <p className={styles.chartSubtitle}>Total Users Over Time</p>
            </div>
            <button
              className={styles.filterBtn}
              type="button"
              aria-label="Filter user growth period"
            >
              <span>{userGrowthFilter}</span>
              <ChevronDownIcon />
            </button>
          </div>
          <div className={styles.chartWrapper}>
            <ReactApexChart
              options={userGrowthChartOptions}
              series={userGrowthSeries}
              type="area"
              height={260}
            />
          </div>
        </div>

        {/* Right: Revenue Trend */}
        <div className={styles.chartCard} id="admin-revenue-trend-card">
          <div className={styles.chartHeader}>
            <div className={styles.titleArea}>
              <h2 className={styles.chartTitle}>Revenue Trend</h2>
              <p className={styles.chartSubtitle}>Track Revenue Over Time</p>
            </div>
          </div>
          <div className={styles.chartWrapper}>
            <ReactApexChart
              options={revenueTrendChartOptions}
              series={revenueTrendSeries}
              type="area"
              height={260}
            />
          </div>
        </div>
      </div>

      {/* ─── Bottom Section (Empty State vs Active State) ─── */}
      <div className={styles.bottomCard} id="admin-dashboard-bottom-section">
        {!hasActiveData ? (
          /* Empty / No Analytics Data State matching screenshot */
          <div className={styles.bottomCardEmpty}>
            <h2 className={styles.emptyTitle}>No Analytics Data</h2>
            <p className={styles.emptySubtitle}>No analytics data is available for now</p>
          </div>
        ) : (
          /* Active State: Key Operational Insights Summary */
          <div>
            <div className={styles.activeHeader}>
              <h2 className={styles.activeTitle}>Analytics Overview</h2>
              <p className={styles.activeSubtitle}>Platform engagement & operational performance highlights</p>
            </div>
            <div className={styles.activeMetricsGrid}>
              <div className={styles.metricTile}>
                <span className={styles.metricTileLabel}>Driver-to-Passenger Ratio</span>
                <span className={styles.metricTileValue}>
                  {parseFloat(passengersStat?.raw_value || "0") > 0
                    ? (parseFloat(driversStat?.raw_value || "0") / parseFloat(passengersStat?.raw_value || "1")).toFixed(2)
                    : "0.00"}
                </span>
                <span className={styles.metricTileNote}>Drivers per active passenger</span>
              </div>
              <div className={styles.metricTile}>
                <span className={styles.metricTileLabel}>Avg. Trips Per Driver</span>
                <span className={styles.metricTileValue}>
                  {parseFloat(driversStat?.raw_value || "0") > 0
                    ? (parseFloat(tripsStat?.raw_value || "0") / parseFloat(driversStat?.raw_value || "1")).toFixed(1)
                    : "0.0"}
                </span>
                <span className={styles.metricTileNote}>Trips completed/scheduled</span>
              </div>
              <div className={styles.metricTile}>
                <span className={styles.metricTileLabel}>Active Fleet Capacity</span>
                <span className={styles.metricTileValue}>{driversStat?.value || "0"} Drivers</span>
                <span className={styles.metricTileNote}>Ready for dispatch</span>
              </div>
              <div className={styles.metricTile}>
                <span className={styles.metricTileLabel}>Platform Trips Volume</span>
                <span className={styles.metricTileValue}>{tripsStat?.value || "0"} Trips</span>
                <span className={styles.metricTileNote}>
                  {tripsStat?.growth_percentage ? `+${tripsStat.growth_percentage}% growth` : "Operational"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Inline Icon ─── */
function ChevronDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
