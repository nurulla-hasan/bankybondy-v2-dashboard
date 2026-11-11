"use client";

import { useLocale, useTranslations } from "next-intl";
import { BadgeCheck, Crown, Gift, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDashboardMeta, useSubscriptionStats } from "@/services";

export function UsersStats() {
  const t = useTranslations("Users");
  const locale = useLocale();
  const meta = useDashboardMeta();
  const stats = useSubscriptionStats();

  const format = new Intl.NumberFormat(locale).format;

  const planCounts = stats.data?.data;
  const kpis = [
    {
      key: "statTotal",
      value: meta.data?.data.totalUser,
      isPending: meta.isPending,
      icon: Users,
      tone: "bg-primary/10 text-primary",
    },
    {
      key: "statFree",
      value: planCounts?.free,
      isPending: stats.isPending,
      icon: Gift,
      tone: "bg-muted text-muted-foreground",
    },
    {
      key: "statStandard",
      value: planCounts?.standard,
      isPending: stats.isPending,
      icon: BadgeCheck,
      tone: "bg-cyan-glow/10 text-cyan-glow",
    },
    {
      key: "statPremium",
      value: planCounts?.premium,
      isPending: stats.isPending,
      icon: Crown,
      tone: "bg-emerald-accent/10 text-emerald-accent",
    },
  ] as const;

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-busy={meta.isPending || stats.isPending}
    >
      {kpis.map((kpi) => (
        <Card key={kpi.key}>
          <CardContent className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">{t(kpi.key)}</p>
              {kpi.isPending ? (
                <Skeleton aria-hidden className="mt-1 h-8 w-20" />
              ) : (
                <p className="font-heading text-3xl font-bold tracking-tight">
                  {typeof kpi.value === "number" ? format(kpi.value) : "—"}
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
