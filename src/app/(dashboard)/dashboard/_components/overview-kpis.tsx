"use client";

import { useTranslations } from "next-intl";
import { Ban, HandCoins, HeartHandshake, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { DashboardMeta } from "@/services";

import { useCountFormatter } from "./use-count-formatter";

export function OverviewKpis({
  summary,
  isPending,
}: {
  summary?: DashboardMeta;
  isPending: boolean;
}) {
  const t = useTranslations("Dashboard");
  const fmt = useCountFormatter();

  const kpis = [
    {
      key: "totalUsers",
      value: summary?.totalUser,
      icon: Users,
      tone: "bg-primary/10 text-primary",
    },
    {
      key: "blockedAccounts",
      value: summary?.totalBlockAccount,
      icon: Ban,
      tone: "bg-destructive/10 text-destructive",
    },
    {
      key: "totalDonations",
      value: summary?.totalDonationAmount,
      icon: HandCoins,
      tone: "bg-emerald-accent/10 text-emerald-accent",
    },
    {
      key: "activeDonors",
      value: summary?.totalDonors,
      icon: HeartHandshake,
      tone: "bg-cyan-glow/10 text-cyan-glow",
    },
  ] as const;

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-busy={isPending}
    >
      {kpis.map((kpi) => (
        <Card key={kpi.key}>
          <CardContent className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">{t(kpi.key)}</p>
              {isPending ? (
                <Skeleton aria-hidden className="mt-1 h-8 w-20" />
              ) : (
                <p className="font-heading text-3xl font-bold tracking-tight">
                  {fmt(kpi.value)}
                </p>
              )}
            </div>
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                kpi.tone,
              )}
            >
              <kpi.icon className="size-5" aria-hidden />
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
