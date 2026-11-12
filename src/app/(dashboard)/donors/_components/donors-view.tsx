"use client";

import { useTranslations } from "next-intl";

import { DataTable } from "@/components/common/data-table";
import { FilterSelect } from "@/components/common/filter-select";
import { SectionHeading } from "@/components/common/section-heading";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useDonations } from "@/services";
import type { DonationsQuery } from "@/types";

import { useDonorsColumns } from "./donors-columns";

type DonorFilterKey = "sort" | "page";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "-createdAt", labelKey: "sortNewest" },
  { value: "createdAt", labelKey: "sortOldest" },
  { value: "-amount", labelKey: "sortAmountHigh" },
  { value: "amount", labelKey: "sortAmountLow" },
] as const;

export function DonorsView() {
  const t = useTranslations("Donors");
  const columns = useDonorsColumns();
  const filters = useNextFilter<DonorFilterKey>();

  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);
  const rawSort = filters.getFilter("sort");

  const query: DonationsQuery = {
    page,
    limit: PAGE_SIZE,
    sort: SORT_OPTIONS.some((option) => option.value === rawSort)
      ? rawSort
      : undefined,
  };

  const donations = useDonations(query);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h3"
        alignment="left"
        constrain={false}
        title={t("title")}
        description={t("subtitle")}
      />

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <FilterSelect
          filterKey="sort"
          placeholder={t("sortNewest")}
          options={SORT_OPTIONS.map((option) => ({
            value: option.value,
            label: t(option.labelKey),
          }))}
        />
      </div>

      <DataTable
        columns={columns}
        data={donations.data?.result ?? []}
        meta={donations.data?.meta}
        filter={filters}
        paginationKey="page"
        isLoading={donations.isPending}
        isFetching={donations.isFetching}
        isError={donations.isError}
        errorMessage={getErrorMessage(donations.error, t("loadError"))}
        onRetry={() => {
          void donations.refetch();
        }}
      />
    </div>
  );
}
