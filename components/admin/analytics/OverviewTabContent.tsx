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
} from "@/services/analytics-services";
import styles from "./AnalyticsCharts.module.css";

interface OverviewTabContentProps {
  revenueTrendData?: RevenueTrendResponse | null;
  payoutsData?: PayoutsResponse | null;
}

export default function OverviewTabContent({
  revenueTrendData,
  payoutsData,
}: OverviewTabContentProps) {
  return (
    <div className={styles.grid2x2}>
      {/* Row 1 (Screenshot 2 & 3) */}
      <MonthlyPayoutsChart payoutsData={payoutsData} />
      <RevenueTrendChart trendData={revenueTrendData} />

      {/* Row 2 (Screenshot 3) */}
      <CommissionTrendChart />
      <UserGrowthChart />

      {/* Row 3 (Screenshot 3 & 4) */}
      <ActiveVsNewUsersChart />
      <RetentionRateChart />

      {/* Row 4 (Screenshot 5) */}
      <ChurnRateChart />
      <AverageOccupancyCard />

      {/* Row 5 (Screenshot 5) */}
      <PopularDestinationsCard />
    </div>
  );
}
