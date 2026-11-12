"use client";

import { useTranslations } from "next-intl";

import { DataTable } from "@/components/common/data-table";
import { FilterSelect } from "@/components/common/filter-select";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useTransactions } from "@/services";
import type {
  TransactionCurrency,
  TransactionPlan,
  TransactionType,
  TransactionsQuery,
} from "@/types";
import {
  transactionCurrencies,
  transactionPlans,
  transactionTypes,
} from "@/validations";

import { useTransactionsColumns } from "./income-columns";

type IncomeFilterKey = "type" | "plan" | "currency" | "sort" | "page";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "-createdAt", labelKey: "sortNewest" },
  { value: "createdAt", labelKey: "sortOldest" },
  { value: "-amount", labelKey: "sortAmountHigh" },
  { value: "amount", labelKey: "sortAmountLow" },
] as const;

export function IncomeView() {
  const t = useTranslations("Income");
  const columns = useTransactionsColumns();
  const filters = useNextFilter<IncomeFilterKey>();

  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);
  const rawType = filters.getFilter("type");
  const rawPlan = filters.getFilter("plan");
  const rawCurrency = filters.getFilter("currency");
  const rawSort = filters.getFilter("sort");

  const query: TransactionsQuery = {
    page,
    limit: PAGE_SIZE,
    type: transactionTypes.includes(rawType as TransactionType)
      ? (rawType as TransactionType)
      : undefined,
    plan: transactionPlans.includes(rawPlan as TransactionPlan)
      ? (rawPlan as TransactionPlan)
      : undefined,
    currency: transactionCurrencies.includes(rawCurrency as TransactionCurrency)
      ? (rawCurrency as TransactionCurrency)
      : undefined,
    sort: SORT_OPTIONS.some((option) => option.value === rawSort)
      ? rawSort
      : undefined,
  };

  const transactions = useTransactions(query);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <FilterSelect
          filterKey="type"
          placeholder={t("typeFilter")}
          options={[
            { value: "all", label: t("typeFilter") },
            ...transactionTypes.map((type) => ({ value: type, label: type })),
          ]}
        />
        <FilterSelect
          filterKey="plan"
          placeholder={t("planFilter")}
          options={[
            { value: "all", label: t("planFilter") },
            ...transactionPlans.map((plan) => ({ value: plan, label: plan })),
          ]}
        />
        <FilterSelect
          filterKey="currency"
          placeholder={t("currencyFilter")}
          options={[
            { value: "all", label: t("currencyFilter") },
            ...transactionCurrencies.map((currency) => ({
              value: currency,
              label: currency,
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

      <DataTable
        columns={columns}
        data={transactions.data?.result ?? []}
        meta={transactions.data?.meta}
        filter={filters}
        paginationKey="page"
        isLoading={transactions.isPending}
        isFetching={transactions.isFetching}
        isError={transactions.isError}
        errorMessage={getErrorMessage(transactions.error, t("loadError"))}
        onRetry={() => {
          void transactions.refetch();
        }}
      />
    </div>
  );
}
