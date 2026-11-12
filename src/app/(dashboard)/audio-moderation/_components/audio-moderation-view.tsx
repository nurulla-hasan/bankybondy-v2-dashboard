"use client";

import { useTranslations } from "next-intl";

import { DataTable } from "@/components/common/data-table";
import { FilterSelect } from "@/components/common/filter-select";
import { SearchInput } from "@/components/common/search-input";
import { SectionHeading } from "@/components/common/section-heading";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useAdminAudios } from "@/services";
import type { AdminAudiosQuery, AudioModerationStatus } from "@/types";
import { audioModerationStatuses } from "@/validations";

import { useAudioModerationColumns } from "./audio-moderation-columns";

type AudioModerationFilterKey =
  | "searchTerm"
  | "moderationStatus"
  | "isBlocked"
  | "sort"
  | "page";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "-createdAt", labelKey: "sortNewest" },
  { value: "createdAt", labelKey: "sortOldest" },
  { value: "-totalPlay", labelKey: "sortMostPlayed" },
  { value: "-ratingCount", labelKey: "sortTopRated" },
] as const;

const STATUS_LABEL_KEY: Record<AudioModerationStatus, string> = {
  processing: "statusProcessing",
  ready: "statusReady",
  rejected: "statusRejected",
  failed: "statusFailed",
};

export function AudioModerationView() {
  const t = useTranslations("AudioModeration");
  const columns = useAudioModerationColumns();
  const filters = useNextFilter<AudioModerationFilterKey>();

  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);
  const rawStatus = filters.getFilter("moderationStatus");
  const rawBlocked = filters.getFilter("isBlocked");
  const rawSort = filters.getFilter("sort");

  const query: AdminAudiosQuery = {
    page,
    limit: PAGE_SIZE,
    searchTerm: filters.getFilter("searchTerm") || undefined,
    moderationStatus: audioModerationStatuses.includes(
      rawStatus as AudioModerationStatus,
    )
      ? (rawStatus as AudioModerationStatus)
      : undefined,
    isBlocked:
      rawBlocked === "true" ? true : rawBlocked === "false" ? false : undefined,
    sort: SORT_OPTIONS.some((option) => option.value === rawSort)
      ? rawSort
      : undefined,
  };

  const audios = useAdminAudios(query);

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
            filterKey="moderationStatus"
            placeholder={t("statusFilter")}
            options={[
              { value: "all", label: t("statusFilter") },
              ...audioModerationStatuses.map((status) => ({
                value: status,
                label: t(STATUS_LABEL_KEY[status]),
              })),
            ]}
          />
          <FilterSelect
            filterKey="isBlocked"
            placeholder={t("blockedFilter")}
            options={[
              { value: "all", label: t("blockedFilter") },
              { value: "false", label: t("filterActive") },
              { value: "true", label: t("filterBlocked") },
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
        data={audios.data?.result ?? []}
        meta={audios.data?.meta}
        filter={filters}
        paginationKey="page"
        isLoading={audios.isPending}
        isFetching={audios.isFetching}
        isError={audios.isError}
        errorMessage={getErrorMessage(audios.error, t("loadError"))}
        onRetry={() => {
          void audios.refetch();
        }}
      />
    </div>
  );
}
