"use client";

import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PasswordFormModal } from "./password-form-modal";

export function PasswordCard() {
  const t = useTranslations("Dashboard");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("passwordTitle")}</CardTitle>
        <CardDescription>{t("passwordDescription")}</CardDescription>
        <CardAction>
          <PasswordFormModal />
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <Lock className="size-4" aria-hidden />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-sm font-medium">{t("passwordSet")}</p>
            <p className="text-xs text-muted-foreground">
              {t("passwordSetHint")}
            </p>
          </div>
          <span className="ml-auto text-sm text-muted-foreground" aria-hidden>
            {"••••••••"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
