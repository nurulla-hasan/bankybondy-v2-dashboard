"use client";

import { useTranslations } from "next-intl";
import { Construction } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ModulePlaceholder({ titleKey }: { titleKey: string }) {
  const t = useTranslations("Dashboard");
  const nav = useTranslations("Nav");

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h3"
        alignment="left"
        constrain={false}
        title={nav(titleKey)}
        description={t("comingSoonTitle")}
      />

      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Construction className="size-7" aria-hidden />
          </div>
          <CardTitle className="font-heading text-lg">
            {t("comingSoonTitle")}
          </CardTitle>
          <p className="max-w-md text-sm text-muted-foreground">
            {t("comingSoonBody")}
          </p>
          <Badge variant="progress">{nav(titleKey)}</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
