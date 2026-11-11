"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import { useMatchingSettings } from "@/services";
import type { MatchingSettings } from "@/types";

import { DetailItem } from "./detail-item";
import { MatchingFormModal } from "./matching-form-modal";

export function MatchingSection({ role }: { role: string }) {
  const t = useTranslations("Dashboard");
  const query = useMatchingSettings();
  const config = query.data;

  const modeLabels: Record<MatchingSettings["candidateMode"], string> = {
    vector: t("candidateModeVector"),
    knn: t("candidateModeKnn"),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("matchingTitle")}</CardTitle>
        <CardDescription>{t("matchingDescription")}</CardDescription>
        {config && role === "superAdmin" && (
          <CardAction>
            <MatchingFormModal
              config={config}
              disabled={query.isFetching || query.isError}
            />
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {query.isPending && (
          <div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            role="status"
            aria-busy="true"
            aria-label={t("matchingLoading")}
          >
            {Array.from({ length: 9 }, (_, index) => (
              <div key={index} className="grid h-16" aria-hidden="true">
                <Skeleton />
              </div>
            ))}
          </div>
        )}

        {query.isError && (
          <div className="flex flex-col items-start gap-3" role="alert">
            <p>{getErrorMessage(query.error, t("matchingLoadError"))}</p>
            <Button
              variant="outline"
              loading={query.isFetching}
              onClick={() => void query.refetch()}
            >
              {t("retry")}
            </Button>
          </div>
        )}

        {config && (
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem
              label={t("candidateMode")}
              value={modeLabels[config.candidateMode]}
            />
            <DetailItem label={t("cacheTtl")} value={config.cacheTtlMinutes} />
            <DetailItem
              label={t("surpriseFloor")}
              value={config.surpriseFloor}
            />
            <DetailItem
              label={t("surpriseMargin")}
              value={config.surpriseMargin}
            />
            <DetailItem label={t("frontierSeeds")} value={config.frontierSeeds} />
            <DetailItem
              label={t("frontierEnabled")}
              value={config.frontierEnabled ? t("sweepOn") : t("sweepOff")}
            />
            <DetailItem label={t("sweepBatch")} value={config.sweepBatch} />
            <div className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3">
              <dt className="text-xs text-muted-foreground">
                {t("sweepEnabled")}
              </dt>
              <dd>
                <Badge variant={config.sweepEnabled ? "active" : "outline"}>
                  {config.sweepEnabled ? t("sweepOn") : t("sweepOff")}
                </Badge>
              </dd>
            </div>
            <DetailItem label={t("sweepCron")} value={config.sweepCron} />
          </dl>
        )}

        <p className="text-xs text-muted-foreground">{t("matchingLiveNote")}</p>
      </CardContent>
    </Card>
  );
}
