"use client";

import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function OverviewHeader({
  years,
  year,
  onYearChange,
  hasError,
  onRetry,
}: {
  years: number[];
  year: number;
  onYearChange: (year: number) => void;
  hasError: boolean;
  onRetry: () => void;
}) {
  const t = useTranslations("Dashboard");

  return (
    <div className="flex flex-col gap-2">
      <SectionHeading
        as="h3"
        alignment="left"
        constrain={false}
        title={t("overviewTitle")}
        description={t("overviewSubtitle")}
      >
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          {t("yearLabel")}
          <Select
            value={String(year)}
            onValueChange={(value) => value && onYearChange(Number(value))}
          >
            <SelectTrigger className="w-28" aria-label={t("yearLabel")}>
              <SelectValue>{(value) => value ?? String(year)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {years.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </SectionHeading>

      {hasError && (
        <div
          role="alert"
          className="flex items-center gap-1 text-xs text-destructive"
        >
          <span>{t("dataError")}</span>
          <Button
            variant="link"
            onClick={onRetry}
            className="h-auto p-0 text-xs text-destructive"
          >
            {t("retry")}
          </Button>
        </div>
      )}
    </div>
  );
}
