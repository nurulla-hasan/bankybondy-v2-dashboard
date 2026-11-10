"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  defaultMatchingSettings,
  type MatchingSettingsType,
} from "@/validations";

import { DetailItem } from "./detail-item";
import { MatchingFormModal } from "./matching-form-modal";

export function MatchingSection() {
  const t = useTranslations("Dashboard");
  const [config, setConfig] = useState<MatchingSettingsType>(
    defaultMatchingSettings,
  );

  const modeLabels: Record<MatchingSettingsType["candidateMode"], string> = {
    hybrid: t("candidateModeHybrid"),
    knn: t("candidateModeKnn"),
    frontier: t("candidateModeFrontier"),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("matchingTitle")}</CardTitle>
        <CardDescription>{t("matchingDescription")}</CardDescription>
        <CardAction>
          <MatchingFormModal config={config} onSave={setConfig} />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem
            label={t("candidateMode")}
            value={modeLabels[config.candidateMode]}
          />
          <DetailItem label={t("cacheTtl")} value={config.cacheTtl} />
          <DetailItem
            label={t("surpriseFloor")}
            value={config.surpriseFloor.toFixed(2)}
          />
          <DetailItem
            label={t("surpriseMargin")}
            value={config.surpriseMargin.toFixed(2)}
          />
          <DetailItem label={t("frontierSeeds")} value={config.frontierSeeds} />
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

        <p className="text-xs text-muted-foreground">{t("matchingEnvNote")}</p>
      </CardContent>
    </Card>
  );
}
