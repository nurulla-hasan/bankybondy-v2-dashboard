"use client";

import { useTranslations } from "next-intl";

import { DataTable } from "@/components/common/data-table";
import { FilterSelect } from "@/components/common/filter-select";
import { SearchInput } from "@/components/common/search-input";
import { SectionHeading } from "@/components/common/section-heading";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useSkills } from "@/services";
import type { SkillsQuery } from "@/types";

import { SkillFormModal } from "./skill-form-modal";
import { useSkillsColumns } from "./skills-columns";

type SkillFilterKey = "searchTerm" | "sort" | "page";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "-createdAt", labelKey: "sortNewest" },
  { value: "createdAt", labelKey: "sortOldest" },
  { value: "name", labelKey: "sortName" },
] as const;

export function SkillsView() {
  const t = useTranslations("Skills");
  const columns = useSkillsColumns();
  const filters = useNextFilter<SkillFilterKey>();

  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);
  const rawSort = filters.getFilter("sort");

  const query: SkillsQuery = {
    page,
    limit: PAGE_SIZE,
    searchTerm: filters.getFilter("searchTerm") || undefined,
    sort: SORT_OPTIONS.some((option) => option.value === rawSort)
      ? rawSort
      : undefined,
  };

  const skills = useSkills(query);

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
            filterKey="sort"
            placeholder={t("sortNewest")}
            options={SORT_OPTIONS.map((option) => ({
              value: option.value,
              label: t(option.labelKey),
            }))}
          />
          <SkillFormModal />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={skills.data?.result ?? []}
        meta={skills.data?.meta}
        filter={filters}
        paginationKey="page"
        isLoading={skills.isPending}
        isFetching={skills.isFetching}
        isError={skills.isError}
        errorMessage={getErrorMessage(skills.error, t("loadError"))}
        onRetry={() => {
          void skills.refetch();
        }}
      />
    </div>
  );
}
