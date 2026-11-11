"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { useNextFilter } from "@/hooks/useNextFilter";
import { cn } from "@/lib/utils";

const SEARCH_KEY = "searchTerm";
const DEBOUNCE_MS = 300;

export function SearchInput({
  placeholder,
  ariaLabel,
}: {
  placeholder?: string;
  ariaLabel?: string;
} = {}) {
  const t = useTranslations("Common");
  const { getFilter, updateFilter } = useNextFilter<typeof SEARCH_KEY>();
  const value = getFilter(SEARCH_KEY);
  const resolvedPlaceholder = placeholder ?? t("searchPlaceholder");
  const resolvedAriaLabel = ariaLabel ?? t("searchLabel");

  return (
    <div className={cn("relative w-full sm:max-w-64")}>
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        type="text"
        value={value}
        onChange={(event) =>
          updateFilter(SEARCH_KEY, event.target.value, {
            debounce: DEBOUNCE_MS,
          })
        }
        placeholder={resolvedPlaceholder}
        aria-label={resolvedAriaLabel}
        className="pr-8 pl-9"
      />

      {value && (
        <button
          type="button"
          onClick={() => updateFilter(SEARCH_KEY, null)}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
          aria-label={t("searchClear")}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
