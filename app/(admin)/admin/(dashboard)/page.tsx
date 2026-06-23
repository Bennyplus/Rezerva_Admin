"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/admin/Spinner";
import { dashboardService } from "@/services/dashboard-service";
import styles from "./page.module.css";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

/* ─── API Types ─── */
interface DashboardSummary {
  total_bookings: { value: number; change_label?: string };
  total_revenue: { value: number; change_label?: string };
  total_payouts: { value: number; change_label?: string };
  available_cars: { value: number; change_label?: string };
}

interface RevenueChartData {
  month: string;
  revenue: number;
}

interface BookingTrend {
  label: string;
  count: number;
  percentage: number;
}

interface RecentBooking {
  booking_id: string;
  customer_name: string;
  customer_phone: string;
  vehicle: string;
  booking_type: string;
  status: string;
  status_code: string;
}

interface DashboardApiResponse {
  summary: DashboardSummary;
  revenue_chart: RevenueChartData[];
  booking_trends: BookingTrend[];
  recent_bookings: RecentBooking[];
}

/* ─── Status badge helper ─── */
function statusClass(status_code: string): string {
  switch (status_code.toLowerCase()) {
    case "completed": return styles.statusCompleted;
    case "scheduled": return styles.statusUpcoming;
    case "ongoing": return styles.statusOngoing;
    case "pending": return styles.statusPending || "";
    case "cancelled": return styles.statusCancelled;
    default: return "";
  }
}

export default function AdminDashboard() {
  const [_openMenu, setOpenMenu] = useState<number | null>(null);
  const [data, setData] = useState<DashboardApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from your API endpoint here
    const fetchData = async () => {
      try {
        const json = await dashboardService.fetchDashboardOverview();
        setData(json);
      } catch (error) {
        console.error("API fetch failed, falling back to initial data:", error);
        // Fallback or handle error
        // For demonstration, you could also provide default static data here
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const revenueChartOptions: ApexOptions = useMemo(() => ({
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
      categories: data?.revenue_chart.map(d => d.month) || [],
      labels: { style: { colors: "#868C98", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: {
        style: { colors: "#868C98", fontSize: "12px" },
        formatter: (val: number) => `$${val >= 1000 ? (val / 1000).toFixed(0) + 'K' : val}`,
      },
    },
  }), [data]);

  const trendsChartOptions: ApexOptions = useMemo(() => {
    if (!data) return {};
    const total = data.booking_trends.reduce((sum, item) => sum + item.count, 0);
    const pct = (n: number) => `${Math.round((n / total) * 100)}%`;

    return {
      chart: {
        type: "donut",
        toolbar: { show: false },
        fontFamily: "inherit",
      },
      colors: ["#BEBFC2", "#FFD6A8", "#1447E6"],
      labels: data.booking_trends.map(t => t.label),
      dataLabels: {
        enabled: true,
        formatter: (_val: string | number | number[], opts?: { seriesIndex?: number }) => {
          const idx = opts?.seriesIndex ?? 0;
          return pct(data.booking_trends[idx].count);
        },
        style: { fontSize: "10px", fontWeight: "500", colors: ["#F6F8FA"] },
        background: {
          enabled: true,
          foreColor: "#0A0D14",
          borderRadius: 4,
          padding: 4,
          borderWidth: 1,
          borderColor: "#E2E4E9",
          dropShadow: { enabled: false },
        },
        dropShadow: { enabled: false },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "58%",
          },
        },
      },
      legend: { show: false },
      stroke: { width: 0 },
      tooltip: { enabled: false },
    };
  }, [data]);

  // Loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (!data) {
    return <div className={styles.page}>Failed to load dashboard data.</div>;
  }

  const revenueSeries = [{
    name: "Revenue",
    data: data.revenue_chart.map(d => d.revenue)
  }];

  const trendsSeries = data.booking_trends.map(t => t.count);

  // Format stats for UI cards
  const dashboardStats = [
    {
      id: "total_bookings",
      label: "Total Bookings",
      value: data.summary.total_bookings.value.toString(),
      growth: data.summary.total_bookings.change_label,
      isPositive: data.summary.total_bookings.change_label?.includes('+')
    },
    {
      id: "total_revenue",
      label: "Total Revenue",
      value: `$${data.summary.total_revenue.value.toLocaleString()}`,
      growth: data.summary.total_revenue.change_label,
      isPositive: data.summary.total_revenue.change_label?.includes('+')
    },
    {
      id: "total_payouts",
      label: "Total Payouts",
      value: `$${data.summary.total_payouts.value.toLocaleString()}`,
      growth: data.summary.total_payouts.change_label,
      isPositive: data.summary.total_payouts.change_label?.includes('+')
    },
    {
      id: "available_cars",
      label: "Available Cars",
      value: data.summary.available_cars.value.toString(),
      growth: data.summary.available_cars.change_label,
      isPositive: data.summary.available_cars.change_label?.includes('+')
    },
  ];

  return (
    <div className={styles.page}>

      {/* ─── Stat Cards ─── */}
      <div className={styles.statsGrid} id="admin-stats">
        {dashboardStats.map((stat) => (
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
              series={revenueSeries}
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
              {data.booking_trends.map((trend, idx) => {
                let dotClass = '';
                const labelLower = trend.label.toLowerCase();
                if (labelLower.includes('cancel')) dotClass = styles.dotCancelled || '';
                else if (labelLower.includes('ongoing')) dotClass = styles.dotOngoing || '';
                else if (labelLower.includes('schedule')) dotClass = styles.dotScheduled || '';

                return (
                  <div key={idx} className={styles.legendItem}>
                    <span className={styles.legendLabel}>
                      <span className={`${styles.legendDot} ${dotClass}`} />
                      {trend.label}
                    </span>
                    <span className={styles.legendCount}>{trend.count}</span>
                  </div>
                );
              })}
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
                  {/* <th className={styles.actionsCol} /> */}
                </tr>
              </thead>
              <tbody>
                {data.recent_bookings.map((booking, idx) => (
                  <tr key={idx}>
                    <td>{booking.booking_id}</td>
                    <td>
                      <div>{booking.customer_name}</div>
                      <div style={{ fontSize: "12px", color: "#868C98", marginTop: "2px" }}>
                        {booking.customer_phone}
                      </div>
                    </td>
                    <td>{booking.vehicle}</td>
                    <td>{booking.booking_type}</td>
                    <td>
                      <span className={`${styles.badge} ${statusClass(booking.status_code)}`}>
                        <span className={styles.badgeDot} />
                        {booking.status}
                      </span>
                    </td>
                    {/* <td className={styles.actionsCol}>
                      <button
                        className={styles.moreBtn}
                        aria-label="More actions"
                        onClick={() => setOpenMenu(idx)}
                      >
                        <MoreIcon />
                      </button>
                    </td> */}
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
