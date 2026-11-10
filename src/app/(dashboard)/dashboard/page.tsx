"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import {
  useAudioDistribution,
  useBondChart,
  useDashboardMeta,
  useDonorChart,
  useEarningChart,
  useSubscriptionStats,
  useUserChart,
} from "@/services";

import {
  AreaChartCard,
  AudioDistributionCard,
  BondActivityCard,
  OverviewHeader,
  OverviewKpis,
  SubscriptionsCard,
} from "./_components";

export default function OverviewPage() {
  const t = useTranslations("Dashboard");
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const meta = useDashboardMeta();
  const userChart = useUserChart(year);
  const donorChart = useDonorChart(year);
  const earningChart = useEarningChart(year);
  const subscriptionStats = useSubscriptionStats();
  const audioDistribution = useAudioDistribution();
  const bondChart = useBondChart(year);

  const availableYears = useMemo(() => {
    const years = new Set<number>([
      ...(userChart.data?.data.yearsDropdown ?? []),
      ...(donorChart.data?.data.yearsDropdown ?? []),
      ...(earningChart.data?.data.yearsDropdown ?? []),
      ...(bondChart.data?.data.yearsDropdown ?? []),
      currentYear,
    ]);

    return [...years].sort((a, b) => b - a);
  }, [
    userChart.data,
    donorChart.data,
    earningChart.data,
    bondChart.data,
    currentYear,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <OverviewHeader
        years={availableYears}
        year={year}
        onYearChange={setYear}
        hasError={meta.isError}
        onRetry={() => meta.refetch()}
      />

      <OverviewKpis summary={meta.data?.data} isPending={meta.isPending} />

      <div className="grid gap-4 xl:grid-cols-3">
        <AreaChartCard
          className="xl:col-span-2"
          title={t("userGrowthTitle")}
          subtitle={t("userGrowthSubtitle")}
          points={userChart.data?.data.chartData ?? []}
          dataKey="totalUser"
          color="var(--chart-1)"
          isPending={userChart.isPending}
          isError={userChart.isError}
          onRetry={() => userChart.refetch()}
        />
        <SubscriptionsCard
          stats={subscriptionStats.data?.data}
          isPending={subscriptionStats.isPending}
          isError={subscriptionStats.isError}
          onRetry={() => subscriptionStats.refetch()}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <AreaChartCard
          title={t("donorGrowthTitle")}
          subtitle={t("donorGrowthSubtitle")}
          points={donorChart.data?.data.chartData ?? []}
          dataKey="totalDonate"
          color="var(--chart-2)"
          isPending={donorChart.isPending}
          isError={donorChart.isError}
          onRetry={() => donorChart.refetch()}
        />
        <AreaChartCard
          title={t("earningGrowthTitle")}
          subtitle={t("earningGrowthSubtitle")}
          points={earningChart.data?.data.chartData ?? []}
          dataKey="totalEarning"
          color="var(--chart-4)"
          isPending={earningChart.isPending}
          isError={earningChart.isError}
          onRetry={() => earningChart.refetch()}
        />
        <AudioDistributionCard
          stats={audioDistribution.data?.data}
          isPending={audioDistribution.isPending}
          isError={audioDistribution.isError}
          onRetry={() => audioDistribution.refetch()}
        />
      </div>

      <BondActivityCard
        bonds={bondChart.data?.data}
        year={year}
        isPending={bondChart.isPending}
        isError={bondChart.isError}
        onRetry={() => bondChart.refetch()}
      />
    </div>
  );
}
