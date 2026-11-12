"use client";

import { useTranslations } from "next-intl";

import { DataTable } from "@/components/common/data-table";
import { FilterSelect } from "@/components/common/filter-select";
import { SearchInput } from "@/components/common/search-input";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useAdmins } from "@/services";
import type { AdminsQuery } from "@/types";

import { AdminFormModal } from "./admin-form-modal";
import { useAdminsColumns } from "./admins-columns";

type AdminFilterKey = "searchTerm" | "sort" | "page";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "-createdAt", labelKey: "sortNewest" },
  { value: "createdAt", labelKey: "sortOldest" },
  { value: "name", labelKey: "sortName" },
] as const;

export function AdminsView() {
  const t = useTranslations("Admins");
  const columns = useAdminsColumns();
  const filters = useNextFilter<AdminFilterKey>();

  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);
  const rawSort = filters.getFilter("sort");

  const query: AdminsQuery = {
    page,
    limit: PAGE_SIZE,
    searchTerm: filters.getFilter("searchTerm") || undefined,
    sort: SORT_OPTIONS.some((option) => option.value === rawSort)
      ? rawSort
      : undefined,
  };

  const admins = useAdmins(query);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          placeholder={t("searchPlaceholder")}
          ariaLabel={t("searchPlaceholder")}
        />

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <FilterSelect
            filterKey="sort"
            placeholder={t("sortNewest")}
            options={SORT_OPTIONS.map((option) => ({
              value: option.value,
              label: t(option.labelKey),
            }))}
          />
          <AdminFormModal />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={admins.data?.result ?? []}
        meta={admins.data?.meta}
        filter={filters}
        paginationKey="page"
        isLoading={admins.isPending}
        isFetching={admins.isFetching}
        isError={admins.isError}
        errorMessage={getErrorMessage(admins.error, t("loadError"))}
        onRetry={() => {
          void admins.refetch();
        }}
      />
    </div>
  );
}
