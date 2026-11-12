"use client";

import { useTranslations } from "next-intl";

import { DataTable } from "@/components/common/data-table";
import { FilterSelect } from "@/components/common/filter-select";
import { SearchInput } from "@/components/common/search-input";
import { SectionHeading } from "@/components/common/section-heading";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useReports } from "@/services";
import type { IncidentType, ReportsQuery } from "@/types";
import { incidentTypes } from "@/validations";

import { useReportsColumns } from "./reports-columns";

type ReportFilterKey = "searchTerm" | "incidentType" | "sort" | "page";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "-createdAt", labelKey: "sortNewest" },
  { value: "createdAt", labelKey: "sortOldest" },
] as const;

export function ReportsView() {
  const t = useTranslations("Reports");
  const tIncident = useTranslations("Reports.incidentTypes");
  const columns = useReportsColumns();
  const filters = useNextFilter<ReportFilterKey>();

  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);
  const rawIncident = filters.getFilter("incidentType");
  const rawSort = filters.getFilter("sort");

  const incidentLabel = (value: IncidentType) =>
    tIncident.has(value) ? tIncident(value) : value;

  const query: ReportsQuery = {
    page,
    limit: PAGE_SIZE,
    searchTerm: filters.getFilter("searchTerm") || undefined,
    incidentType: incidentTypes.includes(rawIncident as IncidentType)
      ? (rawIncident as IncidentType)
      : undefined,
    sort: SORT_OPTIONS.some((option) => option.value === rawSort)
      ? rawSort
      : undefined,
  };

  const reports = useReports(query);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h3"
        alignment="left"
        constrain={false}
        title={t("title")}
        description={t("subtitle")}
      />

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          placeholder={t("searchPlaceholder")}
          ariaLabel={t("searchPlaceholder")}
        />

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <FilterSelect
            className="w-45"
            filterKey="incidentType"
            placeholder={t("incidentFilter")}
            options={[
              { value: "all", label: t("incidentFilter") },
              ...incidentTypes.map((incident) => ({
                value: incident,
                label: incidentLabel(incident),
              })),
            ]}
          />
          <FilterSelect
            filterKey="sort"
            placeholder={t("sortNewest")}
            options={SORT_OPTIONS.map((option) => ({
              value: option.value,
              label: t(option.labelKey),
            }))}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={reports.data?.result ?? []}
        meta={reports.data?.meta}
        filter={filters}
        paginationKey="page"
        isLoading={reports.isPending}
        isFetching={reports.isFetching}
        isError={reports.isError}
        errorMessage={getErrorMessage(reports.error, t("loadError"))}
        onRetry={() => {
          void reports.refetch();
        }}
      />
    </div>
  );
}
