"use client";

import { useTranslations } from "next-intl";
import { Bell, Flag, Link2, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const KPIS = [
  { key: "kpiTotalUsers", icon: Users },
  { key: "kpiActiveBonds", icon: Link2 },
  { key: "kpiMatchesToday", icon: Bell },
  { key: "kpiPendingReports", icon: Flag },
] as const;

export default function OverviewPage() {
  const t = useTranslations("Dashboard");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          {t("overviewTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("overviewSubtitle")}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((kpi) => (
          <Card key={kpi.key}>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(kpi.key)}
              </CardTitle>
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <kpi.icon className="size-4" aria-hidden />
              </span>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-bold tracking-tight">
                —
              </p>
              <CardDescription className="mt-1 text-xs">
                {t("kpiHint")}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
