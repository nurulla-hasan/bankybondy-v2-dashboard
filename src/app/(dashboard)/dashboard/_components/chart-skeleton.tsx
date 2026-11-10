"use client";

import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const BAR_HEIGHTS = [
  "h-8",
  "h-14",
  "h-10",
  "h-20",
  "h-16",
  "h-24",
  "h-12",
  "h-28",
  "h-20",
  "h-32",
  "h-24",
  "h-36",
] as const;

export function AreaChartSkeleton({ label }: { label: string }) {
  const t = useTranslations("Dashboard");

  return (
    <div
      role="status"
      aria-label={`${label} — ${t("loading")}`}
      className="relative h-64 w-full"
    >
      <span className="sr-only">{t("loading")}</span>
      <div aria-hidden className="flex h-full items-end gap-2 pt-6">
        {BAR_HEIGHTS.map((height, index) => (
          <Skeleton key={index} className={cn("flex-1", height)} />
        ))}
      </div>
    </div>
  );
}

export function DonutChartSkeleton({ label }: { label: string }) {
  const t = useTranslations("Dashboard");

  return (
    <div
      role="status"
      aria-label={`${label} — ${t("loading")}`}
      className="flex flex-col gap-4"
    >
      <span className="sr-only">{t("loading")}</span>
      <div aria-hidden className="relative mx-auto size-52">
        <Skeleton className="size-52 rounded-full" />
        <div className="absolute inset-0 m-auto size-32 rounded-full bg-card" />
      </div>
      <div aria-hidden className="flex flex-col gap-2">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="size-2.5 rounded-full" />
              <Skeleton className="h-3.5 w-16" />
            </div>
            <Skeleton className="h-3.5 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
