"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { SubscriptionPlan } from "@/types";

type BadgeVariant = "secondary" | "info" | "success";

const PLAN_VARIANTS: Record<SubscriptionPlan, BadgeVariant> = {
  Free: "secondary",
  Standard: "info",
  Premium: "success",
};

export function PlanBadge({ plan }: { plan: SubscriptionPlan }) {
  return <Badge variant={PLAN_VARIANTS[plan] ?? "secondary"}>{plan}</Badge>;
}

export function StatusBadge({ blocked }: { blocked: boolean }) {
  const t = useTranslations("Users");

  return blocked ? (
    <Badge variant="blocked">{t("statusBlocked")}</Badge>
  ) : (
    <Badge variant="success">{t("statusActive")}</Badge>
  );
}
