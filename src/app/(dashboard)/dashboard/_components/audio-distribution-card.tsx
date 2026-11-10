"use client";

import { useTranslations } from "next-intl";

import type { AudioDistribution } from "@/services";

import { DonutBreakdownCard } from "./donut-breakdown-card";

export function AudioDistributionCard({
  stats,
  isPending,
  isError,
  onRetry,
}: {
  stats?: AudioDistribution;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  const t = useTranslations("Dashboard");

  const slices = [
    {
      key: "short",
      label: t("shortAudio"),
      value: stats?.shortAudioCount ?? 0,
      fill: "var(--chart-3)",
      dotClassName: "bg-chart-3",
    },
    {
      key: "long",
      label: t("longAudio"),
      value: stats?.longAudioCount ?? 0,
      fill: "var(--chart-4)",
      dotClassName: "bg-chart-4",
    },
  ];

  return (
    <DonutBreakdownCard
      title={t("audioDistributionTitle")}
      subtitle={t("audioDistributionSubtitle")}
      slices={slices}
      total={stats?.totalCount ?? 0}
      totalLabel={t("audios")}
      isPending={isPending}
      isError={isError}
      onRetry={onRetry}
    />
  );
}
