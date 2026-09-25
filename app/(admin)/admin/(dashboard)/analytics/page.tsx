"use client";

import { useState, useEffect, useCallback } from "react";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/admin/Spinner";
import AnalyticsTabs, { AnalyticsTabType } from "@/components/admin/analytics/AnalyticsTabs";
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
  CommissionTrendResponse,
  UserGrowthResponse,
  ActiveVsNewUsersResponse,
  RetentionResponse,
  ChurnResponse,
  PopularDestinationsResponse,
  AverageOccupancyResponse,
  UsersSummaryResponse,
  AdminUserItem,
  TripsSummaryResponse,
  AdminTripItem,
  DriversSummaryResponse,
  AdminDriverItem,
  PassengersSummaryResponse,
  AdminPassengerItem,
} from "@/services/analytics-services";
import styles from "./analytics.module.css";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTabType>("Overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("Today");
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Endpoint data states
  const [overviewSummary, setOverviewSummary] = useState<OverviewSummaryResponse | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrendResponse | null>(null);
  const [payoutsData, setPayoutsData] = useState<PayoutsResponse | null>(null);
  const [commissionTrend, setCommissionTrend] = useState<CommissionTrendResponse | null>(null);
  const [userGrowth, setUserGrowth] = useState<UserGrowthResponse | null>(null);
  const [activeVsNew, setActiveVsNew] = useState<ActiveVsNewUsersResponse | null>(null);
  const [retentionData, setRetentionData] = useState<RetentionResponse | null>(null);
  const [churnData, setChurnData] = useState<ChurnResponse | null>(null);
  const [popularDestinationsData, setPopularDestinationsData] = useState<PopularDestinationsResponse | null>(null);
  const [occupancyData, setOccupancyData] = useState<AverageOccupancyResponse | null>(null);

  // Tab endpoint data states
  const [usersSummary, setUsersSummary] = useState<UsersSummaryResponse | null>(null);
  const [usersList, setUsersList] = useState<AdminUserItem[]>([]);
  const [tripsSummary, setTripsSummary] = useState<TripsSummaryResponse | null>(null);
  const [tripsList, setTripsList] = useState<AdminTripItem[]>([]);
  const [driversSummary, setDriversSummary] = useState<DriversSummaryResponse | null>(null);
  const [driversList, setDriversList] = useState<AdminDriverItem[]>([]);
  const [passengersSummary, setPassengersSummary] = useState<PassengersSummaryResponse | null>(null);
  const [passengersList, setPassengersList] = useState<AdminPassengerItem[]>([]);

  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        summaryRes, trendRes, payoutsRes, commissionRes, growthRes,
        activeVsNewRes, retentionRes, churnRes, popularDestRes, occupancyRes,
        usersSummaryRes, usersListRes, tripsSummaryRes, tripsListRes,
        driversSummaryRes, driversListRes, passengersSummaryRes, passengersListRes,
      ] = await Promise.allSettled([
        analyticsService.getOverviewSummary("this_year"),
        analyticsService.getRevenueTrend("this_month"),
        analyticsService.getPayouts("this_month"),
        analyticsService.getCommissionTrend("this_month"),
        analyticsService.getUserGrowth("this_year"),
        analyticsService.getActiveVsNewUsers("this_year"),
        analyticsService.getRetention("this_year"),
        analyticsService.getChurn("this_year"),
        analyticsService.getPopularDestinations("this_year"),
        analyticsService.getAverageOccupancy("this_year"),
        analyticsService.getUsersSummary("this_month"),
        analyticsService.getUsersList(),
        analyticsService.getTripsSummary("this_month"),
        analyticsService.getTripsList(),
        analyticsService.getDriversSummary("this_month"),
        analyticsService.getDriversList(),
        analyticsService.getPassengersSummary("this_month"),
        analyticsService.getPassengersList(),
      ]);

      const summary = summaryRes.status === "fulfilled" ? summaryRes.value : null;
      const trend = trendRes.status === "fulfilled" ? trendRes.value : null;
      const payouts = payoutsRes.status === "fulfilled" ? payoutsRes.value : null;
      const commission = commissionRes.status === "fulfilled" ? commissionRes.value : null;
      const growth = growthRes.status === "fulfilled" ? growthRes.value : null;
      const activeVsNewResVal = activeVsNewRes.status === "fulfilled" ? activeVsNewRes.value : null;
      const retention = retentionRes.status === "fulfilled" ? retentionRes.value : null;
      const churn = churnRes.status === "fulfilled" ? churnRes.value : null;
      const popularDest = popularDestRes.status === "fulfilled" ? popularDestRes.value : null;
      const occupancy = occupancyRes.status === "fulfilled" ? occupancyRes.value : null;

      if (summary) setOverviewSummary(summary);
      if (trend) setRevenueTrend(trend);
      if (payouts) setPayoutsData(payouts);
      if (commission) setCommissionTrend(commission);
      if (growth) setUserGrowth(growth);
      if (activeVsNewResVal) setActiveVsNew(activeVsNewResVal);
      if (retention) setRetentionData(retention);
      if (churn) setChurnData(churn);
      if (popularDest) setPopularDestinationsData(popularDest);
      if (occupancy) setOccupancyData(occupancy);

      if (usersSummaryRes.status === "fulfilled") setUsersSummary(usersSummaryRes.value);
      if (usersListRes.status === "fulfilled") setUsersList(usersListRes.value);
      if (tripsSummaryRes.status === "fulfilled") setTripsSummary(tripsSummaryRes.value);
      if (tripsListRes.status === "fulfilled") setTripsList(tripsListRes.value);
      if (driversSummaryRes.status === "fulfilled") setDriversSummary(driversSummaryRes.value);
      if (driversListRes.status === "fulfilled") {
        const d = driversListRes.value;
        setDriversList(Array.isArray(d) ? d : (d as any).results || []);
      }
      if (passengersSummaryRes.status === "fulfilled") setPassengersSummary(passengersSummaryRes.value);
      if (passengersListRes.status === "fulfilled") {
        const p = passengersListRes.value;
        setPassengersList(Array.isArray(p) ? p : (p as any).results || []);
      }

      const hasBackendData = Boolean(
        (summary && ((summary.active_users?.value ?? 0) > 0 || (summary.platform_revenue?.value ?? 0) > 0 || (summary.completed_trips?.value ?? 0) > 0 || (summary.total_bookings?.value ?? 0) > 0)) ||
        (trend && ((trend.total ?? 0) > 0 || trend.points?.some((p) => p.value > 0))) ||
        (payouts && ((payouts.total ?? 0) > 0 || payouts.points?.some((p) => p.value > 0))) ||
        (commission && ((commission.total ?? 0) > 0 || commission.points?.some((p) => p.value > 0))) ||
        (growth && ((growth.total ?? 0) > 0 || growth.points?.some((p) => p.value > 0))) ||
        (activeVsNewResVal?.points && activeVsNewResVal.points.some((p) => (p.active_users ?? 0) > 0 || (p.new_users ?? 0) > 0)) ||
        (retention?.cohorts && retention.cohorts.some((c) => c.cohort_size > 0)) ||
        (churn?.points && churn.points.some((p) => (p.churn_rate ?? 0) > 0)) ||
        (popularDest?.results && popularDest.results.length > 0) ||
        ((occupancy?.trip_count ?? 0) > 0 || (occupancy?.avg_seats_booked ?? 0) > 0),
      );

      setHasData(hasBackendData);
    } catch (err) {
      console.error("Failed to load analytics endpoints:", err);
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnalyticsData(); }, [fetchAnalyticsData]);

  const handleExport = () => { console.log(`Exporting analytics data for ${activeTab}...`); };

  const activeUsersVal = overviewSummary?.active_users?.value ?? 0;
  const platformRevenueVal = overviewSummary?.platform_revenue?.value ? `$${overviewSummary.platform_revenue.value}` : 0;
  const completedTripsVal = overviewSummary?.completed_trips?.value ?? 0;
  const totalBookingsVal = overviewSummary?.total_bookings?.value ?? 0;

  return (
    <div className={styles.page}>
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
        {activeTab === "Overview" ? (
          <>
            <StatCard label="Active Users" value={activeUsersVal} id="stat-active-users" />
            <StatCard label="Platform Revenue" value={platformRevenueVal} id="stat-platform-revenue" />
            <StatCard label="Completed Trips" value={completedTripsVal} id="stat-completed-trips" />
            <StatCard label="Total Bookings" value={totalBookingsVal} id="stat-total-bookings" />
          </>
        ) : activeTab === "Users" ? (
          <>
            <StatCard label="Active Users" value={usersSummary?.active_users?.value ?? 0} growth={usersSummary?.active_users?.change_pct != null ? `${usersSummary.active_users.change_pct}%` : undefined} isPositive={(usersSummary?.active_users?.change_pct ?? 0) >= 0} id="stat-active-users" />
            <StatCard label="Total Users" value={usersSummary?.total_users?.value ?? 0} growth={usersSummary?.total_users?.change_pct != null ? `${usersSummary.total_users.change_pct}%` : undefined} isPositive={(usersSummary?.total_users?.change_pct ?? 0) >= 0} id="stat-total-users" />
            <StatCard label="New Users" value={usersSummary?.new_users?.value ?? 0} growth={usersSummary?.new_users?.change_pct != null ? `${usersSummary.new_users.change_pct}%` : undefined} isPositive={(usersSummary?.new_users?.change_pct ?? 0) >= 0} id="stat-new-users" />
            <StatCard label="Retention Rate" value={`${usersSummary?.retention_rate?.value ?? 0}%`} growth={usersSummary?.retention_rate?.change_pct != null ? `${usersSummary.retention_rate.change_pct}%` : undefined} isPositive={(usersSummary?.retention_rate?.change_pct ?? 0) >= 0} id="stat-retention-rate" />
          </>
        ) : activeTab === "Trips" ? (
          <>
            <StatCard label="Total Trips" value={tripsSummary?.total_trips?.value ?? 0} growth={tripsSummary?.total_trips?.change_pct != null ? `${tripsSummary.total_trips.change_pct}%` : undefined} isPositive={(tripsSummary?.total_trips?.change_pct ?? 0) >= 0} id="stat-total-trips" />
            <StatCard label="Average Occupancy" value={tripsSummary?.average_occupancy?.value ?? 0} growth={tripsSummary?.average_occupancy?.change_pct != null ? `${tripsSummary.average_occupancy.change_pct}%` : undefined} isPositive={(tripsSummary?.average_occupancy?.change_pct ?? 0) >= 0} id="stat-average-occupancy" />
            <StatCard label="Average Distance" value={tripsSummary?.average_distance_km?.value != null ? `${tripsSummary.average_distance_km.value} km` : 0} growth={tripsSummary?.average_distance_km?.change_pct != null ? `${tripsSummary.average_distance_km.change_pct}%` : undefined} isPositive={(tripsSummary?.average_distance_km?.change_pct ?? 0) >= 0} id="stat-average-distance" />
            <StatCard label="Completion Rate" value={tripsSummary?.completion_rate?.value != null ? `${tripsSummary.completion_rate.value}%` : 0} growth={tripsSummary?.completion_rate?.change_pct != null ? `${tripsSummary.completion_rate.change_pct}%` : undefined} isPositive={(tripsSummary?.completion_rate?.change_pct ?? 0) >= 0} id="stat-completion-rate" />
          </>
        ) : activeTab === "Drivers" ? (
          <>
            <StatCard label="Active Drivers" value={driversSummary?.active_drivers?.value ?? 0} growth={driversSummary?.active_drivers?.change_pct != null ? `${driversSummary.active_drivers.change_pct}%` : undefined} isPositive={(driversSummary?.active_drivers?.change_pct ?? 0) >= 0} id="stat-active-drivers" />
            <StatCard label="Average Rating" value={driversSummary?.average_rating?.value ?? 0} growth={driversSummary?.average_rating?.change_pct != null ? `${driversSummary.average_rating.change_pct}%` : undefined} isPositive={(driversSummary?.average_rating?.change_pct ?? 0) >= 0} id="stat-average-rating" />
            <StatCard label="Acceptance Rate" value={driversSummary?.acceptance_rate?.value != null ? `${driversSummary.acceptance_rate.value}%` : 0} growth={driversSummary?.acceptance_rate?.change_pct != null ? `${driversSummary.acceptance_rate.change_pct}%` : undefined} isPositive={(driversSummary?.acceptance_rate?.change_pct ?? 0) >= 0} id="stat-acceptance-rate" />
            <StatCard label="Cancellation Rate" value={driversSummary?.cancellation_rate?.value != null ? `${driversSummary.cancellation_rate.value}%` : 0} growth={driversSummary?.cancellation_rate?.change_pct != null ? `${driversSummary.cancellation_rate.change_pct}%` : undefined} isPositive={(driversSummary?.cancellation_rate?.change_pct ?? 0) >= 0} id="stat-cancellation-rate" />
          </>
        ) : activeTab === "Passengers" ? (
          <>
            <StatCard label="Active Passengers" value={passengersSummary?.active_passengers?.value ?? 0} growth={passengersSummary?.active_passengers?.change_pct != null ? `${passengersSummary.active_passengers.change_pct}%` : undefined} isPositive={(passengersSummary?.active_passengers?.change_pct ?? 0) >= 0} id="stat-active-passengers" />
            <StatCard label="Average Trips Per Passenger" value={passengersSummary?.average_trips_per_passenger?.value ?? 0} growth={passengersSummary?.average_trips_per_passenger?.change_pct != null ? `${passengersSummary.average_trips_per_passenger.change_pct}%` : undefined} isPositive={(passengersSummary?.average_trips_per_passenger?.change_pct ?? 0) >= 0} id="stat-avg-trips-passenger" />
            <StatCard label="Repeat Rate" value={passengersSummary?.repeat_rate?.value != null ? `${passengersSummary.repeat_rate.value}%` : 0} growth={passengersSummary?.repeat_rate?.change_pct != null ? `${passengersSummary.repeat_rate.change_pct}%` : undefined} isPositive={(passengersSummary?.repeat_rate?.change_pct ?? 0) >= 0} id="stat-repeat-rate" />
            <StatCard label="Cancellation Rate" value={passengersSummary?.cancellation_rate?.value != null ? `${passengersSummary.cancellation_rate.value}%` : 0} growth={passengersSummary?.cancellation_rate?.change_pct != null ? `${passengersSummary.cancellation_rate.change_pct}%` : undefined} isPositive={(passengersSummary?.cancellation_rate?.change_pct ?? 0) >= 0} id="stat-cancellation-rate" />
          </>
        ) : null}
      </div>

      {/* ── Tab Content ── */}
      {isLoading ? (
        <div className={styles.loadingCard}>
          <Spinner size={36} color="#2F68FE" />
          <p className={styles.loadingSubtitle}>Loading {activeTab.toLowerCase()} data…</p>
        </div>
      ) : activeTab === "Overview" ? (
        !hasData ? (
          <AnalyticsEmptyState title="No Analytics Data" subtitle="No analytics data is available for now" />
        ) : (
          <OverviewTabContent
            revenueTrendData={revenueTrend}
            payoutsData={payoutsData}
            commissionTrendData={commissionTrend}
            userGrowthData={userGrowth}
            activeVsNewData={activeVsNew}
            retentionData={retentionData}
            churnData={churnData}
            popularDestinationsData={popularDestinationsData}
            occupancyData={occupancyData}
          />
        )
      ) : activeTab === "Users" ? (
        <UsersTabContent users={usersList} isLoading={isLoading} />
      ) : activeTab === "Trips" ? (
        <TripsTabContent trips={tripsList} isLoading={isLoading} />
      ) : activeTab === "Drivers" ? (
        <DriversTabContent drivers={driversList} isLoading={isLoading} />
      ) : activeTab === "Passengers" ? (
        <PassengersTabContent passengers={passengersList} isLoading={isLoading} />
      ) : (
        <AnalyticsEmptyState title={`No ${activeTab} Data`} subtitle={`No ${activeTab.toLowerCase()} data is available for now`} />
      )}
    </div>
  );
}
