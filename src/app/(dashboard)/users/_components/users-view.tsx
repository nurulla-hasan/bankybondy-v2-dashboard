"use client";

import { useTranslations } from "next-intl";

import { DataTable } from "@/components/common/data-table";
import { FilterSelect } from "@/components/common/filter-select";
import { SearchInput } from "@/components/common/search-input";
import { SectionHeading } from "@/components/common/section-heading";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useUsers } from "@/services";
import type { SubscriptionPlan, UsersQuery } from "@/types";
import { userPlans } from "@/validations";

import { useUsersColumns } from "./users-columns";
import { UsersStats } from "./users-stats";

type UserFilterKey = "searchTerm" | "subscriptionType" | "sort" | "page";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "-createdAt", labelKey: "sortNewest" },
  { value: "createdAt", labelKey: "sortOldest" },
  { value: "name", labelKey: "sortName" },
  { value: "-reputation.score", labelKey: "sortReputation" },
] as const;

export function UsersView({ role }: { role: string }) {
  const t = useTranslations("Users");
  const canManage = role === "superAdmin";
  const columns = useUsersColumns({ canManage });
  const filters = useNextFilter<UserFilterKey>();

  const rawPlan = filters.getFilter("subscriptionType");
  const rawSort = filters.getFilter("sort");
  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);

  const query: UsersQuery = {
    page,
    limit: PAGE_SIZE,
    searchTerm: filters.getFilter("searchTerm") || undefined,
    subscriptionType: userPlans.includes(rawPlan as SubscriptionPlan)
      ? (rawPlan as SubscriptionPlan)
      : undefined,
    sort: SORT_OPTIONS.some((option) => option.value === rawSort)
      ? rawSort
      : undefined,
  };

  const users = useUsers(query);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h3"
        alignment="left"
        constrain={false}
        title={t("title")}
        description={t("subtitle")}
      />

      <UsersStats />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            placeholder={t("searchPlaceholder")}
            ariaLabel={t("searchPlaceholder")}
          />

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <FilterSelect
              filterKey="subscriptionType"
              placeholder={t("planFilter")}
              options={[
                { value: "all", label: t("planFilter") },
                ...userPlans.map((plan) => ({ value: plan, label: plan })),
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
          data={users.data?.result ?? []}
          meta={users.data?.meta}
          filter={filters}
          paginationKey="page"
          isLoading={users.isPending}
          isFetching={users.isFetching}
          isError={users.isError}
          errorMessage={getErrorMessage(users.error, t("loadError"))}
          onRetry={() => {
            void users.refetch();
          }}
        />
      </div>
    </div>
  );
}
