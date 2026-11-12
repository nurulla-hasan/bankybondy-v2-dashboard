"use client";

import { useTranslations } from "next-intl";

import { DataTable } from "@/components/common/data-table";
import { SearchInput } from "@/components/common/search-input";
import { SectionHeading } from "@/components/common/section-heading";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useTopics } from "@/services";
import type { TopicsQuery } from "@/types";

import { TopicFormModal } from "./topic-form-modal";
import { useTopicsColumns } from "./topics-columns";

type TopicFilterKey = "searchTerm" | "page";

const PAGE_SIZE = 10;

export function TopicsView() {
  const t = useTranslations("Topics");
  const columns = useTopicsColumns();
  const filters = useNextFilter<TopicFilterKey>();

  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);

  const query: TopicsQuery = {
    page,
    limit: PAGE_SIZE,
    searchTerm: filters.getFilter("searchTerm") || undefined,
  };

  const topics = useTopics(query);

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
          <TopicFormModal />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={topics.data?.result ?? []}
        meta={topics.data?.meta}
        filter={filters}
        paginationKey="page"
        isLoading={topics.isPending}
        isFetching={topics.isFetching}
        isError={topics.isError}
        errorMessage={getErrorMessage(topics.error, t("loadError"))}
        onRetry={() => {
          void topics.refetch();
        }}
      />
    </div>
  );
}
