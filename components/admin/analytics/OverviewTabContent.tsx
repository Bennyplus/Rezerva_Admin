"use client";

import MonthlyPayoutsChart from "./MonthlyPayoutsChart";
import RevenueTrendChart from "./RevenueTrendChart";
import CommissionTrendChart from "./CommissionTrendChart";
import UserGrowthChart from "./UserGrowthChart";
import ActiveVsNewUsersChart from "./ActiveVsNewUsersChart";
import RetentionRateChart from "./RetentionRateChart";
import ChurnRateChart from "./ChurnRateChart";
import PopularDestinationsCard from "./PopularDestinationsCard";
import AverageOccupancyCard from "./AverageOccupancyCard";
import {
  RevenueTrendResponse,
  PayoutsResponse,
  CommissionTrendResponse,
  UserGrowthResponse,
  ActiveVsNewUsersResponse,
  RetentionResponse,
  ChurnResponse,
  PopularDestinationsResponse,
  AverageOccupancyResponse,
} from "@/services/analytics-services";
import styles from "./AnalyticsCharts.module.css";

interface OverviewTabContentProps {
  revenueTrendData?: RevenueTrendResponse | null;
  payoutsData?: PayoutsResponse | null;
  commissionTrendData?: CommissionTrendResponse | null;
  userGrowthData?: UserGrowthResponse | null;
  activeVsNewData?: ActiveVsNewUsersResponse | null;
  retentionData?: RetentionResponse | null;
  churnData?: ChurnResponse | null;
  popularDestinationsData?: PopularDestinationsResponse | null;
  occupancyData?: AverageOccupancyResponse | null;
}

export default function OverviewTabContent({
  revenueTrendData,
  payoutsData,
  commissionTrendData,
  userGrowthData,
  activeVsNewData,
  retentionData,
  churnData,
  popularDestinationsData,
  occupancyData,
}: OverviewTabContentProps) {
  return (
    <div className={styles.grid2x2}>
      {/* Row 1 (Screenshot 2 & 3) */}
      <MonthlyPayoutsChart payoutsData={payoutsData} />
      <RevenueTrendChart trendData={revenueTrendData} />

      {/* Row 2 (Screenshot 3) */}
      <CommissionTrendChart commissionData={commissionTrendData} />
      <UserGrowthChart userGrowthData={userGrowthData} />

      {/* Row 3 (Screenshot 3 & 4) */}
      <ActiveVsNewUsersChart activeVsNewData={activeVsNewData} />
      <RetentionRateChart retentionData={retentionData} />

      {/* Row 4 (Screenshot 5) */}
      <ChurnRateChart churnData={churnData} />
      <AverageOccupancyCard occupancyData={occupancyData} />

      {/* Row 5 (Screenshot 5) */}
      <PopularDestinationsCard destinationsData={popularDestinationsData} />
    </div>
  );
}
