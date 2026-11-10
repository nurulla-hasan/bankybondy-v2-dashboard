"use client";

import { useTranslations } from "next-intl";
import { Activity, CheckCircle2, Link2, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { BondChartData } from "@/services";

import { SectionError } from "./section-error";
import { useCountFormatter } from "./use-count-formatter";

export function BondActivityCard({
  bonds,
  year,
  isPending,
  isError,
  onRetry,
}: {
  bonds?: BondChartData;
  year: number;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  const t = useTranslations("Dashboard");
  const fmt = useCountFormatter();

  const stats = [
    {
      key: "bondsTotal",
      value: bonds?.total,
      icon: Link2,
      tone: "bg-primary/10 text-primary",
    },
    {
      key: "bondsOngoing",
      value: bonds?.ongoing,
      icon: Activity,
      tone: "bg-amber-accent/10 text-amber-accent",
    },
    {
      key: "bondsCompleted",
      value: bonds?.completed,
      icon: CheckCircle2,
      tone: "bg-emerald-accent/10 text-emerald-accent",
    },
    {
      key: "bondsCanceled",
      value: bonds?.canceled,
      icon: XCircle,
      tone: "bg-destructive/10 text-destructive",
    },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">{t("bondActivityTitle")}</CardTitle>
        <CardDescription>{t("bondActivitySubtitle", { year })}</CardDescription>
      </CardHeader>
      <CardContent>
        {isError ? (
          <SectionError onRetry={onRetry} />
        ) : (
          <div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            aria-busy={isPending}
          >
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4"
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    stat.tone,
                  )}
                >
                  <stat.icon className="size-5" aria-hidden />
                </span>
                <div className="flex flex-col">
                  {isPending ? (
                    <Skeleton aria-hidden className="my-1 h-6 w-12" />
                  ) : (
                    <span className="font-heading text-xl font-bold tracking-tight tabular-nums">
                      {fmt(stat.value)}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {t(stat.key)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
