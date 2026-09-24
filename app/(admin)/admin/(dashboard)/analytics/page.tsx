"use client";

import { useState, useEffect, useCallback } from "react";
import StatCard from "@/components/admin/StatCard";
import AnalyticsTabs, {
  AnalyticsTabType,
} from "@/components/admin/analytics/AnalyticsTabs";
import AnalyticsEmptyState from "@/components/admin/analytics/AnalyticsEmptyState";
import OverviewTabContent from "@/components/admin/analytics/OverviewTabContent";
import UsersTabContent from "@/components/admin/analytics/UsersTabContent";
import TripsTabContent from "@/components/admin/analytics/TripsTabContent";
import DriversTabContent from "@/components/admin/analytics/DriversTabContent";
import PassengersTabContent from "@/components/admin/analytics/PassengersTabContent";
import {
  analyticsService,
  OverviewSummaryResponse,
  RevenueTrendResponse,
  PayoutsResponse,
} from "@/services/analytics-services";
import styles from "./analytics.module.css";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTabType>("Overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("Today");
  const [hasData, setHasData] = useState(true);

  // Endpoint data states
  const [overviewSummary, setOverviewSummary] =
    useState<OverviewSummaryResponse | null>(null);
  const [revenueTrend, setRevenueTrend] =
    useState<RevenueTrendResponse | null>(null);
  const [payoutsData, setPayoutsData] =
    useState<PayoutsResponse | null>(null);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const [summaryRes, trendRes, payoutsRes] = await Promise.allSettled([
        analyticsService.getOverviewSummary("this_year"),
        analyticsService.getRevenueTrend("this_month"),
        analyticsService.getPayouts("this_month"),
      ]);

      if (summaryRes.status === "fulfilled" && summaryRes.value) {
        setOverviewSummary(summaryRes.value);
      }
      if (trendRes.status === "fulfilled" && trendRes.value) {
        setRevenueTrend(trendRes.value);
      }
      if (payoutsRes.status === "fulfilled" && payoutsRes.value) {
        setPayoutsData(payoutsRes.value);
      }
    } catch (err) {
      console.error("Failed to load analytics endpoints:", err);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleExport = () => {
    console.log(`Exporting analytics data for ${activeTab}...`);
  };

  // Overview stat values from endpoint
  const activeUsersVal = overviewSummary?.active_users?.value ?? 0;
  const platformRevenueVal = overviewSummary?.platform_revenue?.value
    ? `$${overviewSummary.platform_revenue.value}`
    : 0;
  const completedTripsVal = overviewSummary?.completed_trips?.value ?? 0;
  const totalBookingsVal = overviewSummary?.total_bookings?.value ?? 0;

  return (
    <div className={styles.page}>
      {/* ── Tabs Navigation & Right Toolbar ── */}
      <AnalyticsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showToolbar={activeTab === "Overview" && hasData}
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={setSelectedTimeframe}
        onExport={handleExport}
      />

      {/* ── Top Stats Grid (4 Cards - Contextual to active tab) ── */}
      <div className={styles.statsGrid}>
        {activeTab === "Drivers" ? (
          <>
            <StatCard
              label="Active Drivers"
              value={0}
              id="stat-active-drivers"
            />
            <StatCard
              label="Average Rating"
              value={0}
              id="stat-average-rating"
            />
            <StatCard
              label="Acceptance Rate"
              value={0}
              id="stat-acceptance-rate"
            />
            <StatCard
              label="Cancellation Rate"
              value={0}
              id="stat-cancellation-rate"
            />
          </>
        ) : activeTab === "Passengers" ? (
          <>
            <StatCard
              label="Active Passengers"
              value={0}
              id="stat-active-passengers"
            />
            <StatCard
              label="Average Trips Per Passenger"
              value={0}
              id="stat-avg-trips-passenger"
            />
            <StatCard
              label="Repeat Rate"
              value={0}
              id="stat-repeat-rate"
            />
            <StatCard
              label="Cancellation Rate"
              value={0}
              id="stat-cancellation-rate"
            />
          </>
        ) : activeTab === "Trips" ? (
          <>
            <StatCard
              label="Total Trips"
              value={0}
              id="stat-total-trips"
            />
            <StatCard
              label="Average Occupancy"
              value={0}
              id="stat-average-occupancy"
            />
            <StatCard
              label="Average Distance"
              value={0}
              id="stat-average-distance"
            />
            <StatCard
              label="Completion Rate"
              value={0}
              id="stat-completion-rate"
            />
          </>
        ) : activeTab === "Users" ? (
          <>
            <StatCard
              label="Active Users"
              value={0}
              id="stat-active-users"
            />
            <StatCard
              label="Total Users"
              value={0}
              growth="+18% growth"
              isPositive={true}
              id="stat-total-users"
            />
            <StatCard
              label="New Users"
              value={0}
              id="stat-new-users"
            />
            <StatCard
              label="Retention Rate"
              value={0}
              id="stat-retention-rate"
            />
          </>
        ) : (
          <>
            <StatCard
              label="Active Users"
              value={activeUsersVal}
              id="stat-active-users"
            />
            <StatCard
              label="Platform Revenue"
              value={platformRevenueVal}
              id="stat-platform-revenue"
            />
            <StatCard
              label="Completed Trips"
              value={completedTripsVal}
              id="stat-completed-trips"
            />
            <StatCard
              label="Total Bookings"
              value={totalBookingsVal}
              id="stat-total-bookings"
            />
          </>
        )}
      </div>

      {/* ── Tab Content ── */}
      {!hasData ? (
        /* Inactive Data State (Screenshot 1) */
        <AnalyticsEmptyState />
      ) : activeTab === "Overview" ? (
        /* Overview 2x2 Vertical Grid Graphs */
        <OverviewTabContent
          revenueTrendData={revenueTrend}
          payoutsData={payoutsData}
        />
      ) : activeTab === "Users" ? (
        /* Users Tab Screen Flow */
        <UsersTabContent />
      ) : activeTab === "Trips" ? (
        /* Trips Tab Screen Flow */
        <TripsTabContent />
      ) : activeTab === "Drivers" ? (
        /* Drivers Tab Screen Flow */
        <DriversTabContent />
      ) : activeTab === "Passengers" ? (
        /* Passengers Tab Screen Flow */
        <PassengersTabContent />
      ) : (
        /* Other tabs empty state placeholder until designs are attached */
        <AnalyticsEmptyState
          title={`No ${activeTab} Data`}
          subtitle={`No ${activeTab.toLowerCase()} data is available for now`}
        />
      )}
    </div>
  );
}
