"use client";

import { useTranslations } from "next-intl";

import type { SubscriptionStats } from "@/services";

import { DonutBreakdownCard } from "./donut-breakdown-card";

export function SubscriptionsCard({
  stats,
  isPending,
  isError,
  onRetry,
}: {
  stats?: SubscriptionStats;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  const t = useTranslations("Dashboard");

  const slices = [
    {
      key: "free",
      label: t("freePlan"),
      value: stats?.free ?? 0,
      fill: "var(--chart-3)",
      dotClassName: "bg-chart-3",
    },
    {
      key: "standard",
      label: t("standardPlan"),
      value: stats?.standard ?? 0,
      fill: "var(--chart-4)",
      dotClassName: "bg-chart-4",
    },
    {
      key: "premium",
      label: t("premiumPlan"),
      value: stats?.premium ?? 0,
      fill: "var(--chart-1)",
      dotClassName: "bg-chart-1",
    },
  ];

  return (
    <DonutBreakdownCard
      title={t("subscriptionsTitle")}
      subtitle={t("subscriptionsSubtitle")}
      slices={slices}
      total={stats?.total ?? 0}
      totalLabel={t("subscribers")}
      isPending={isPending}
      isError={isError}
      onRetry={onRetry}
    />
  );
}
