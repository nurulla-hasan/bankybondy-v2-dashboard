"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";

const DASH = "—";

export function useCountFormatter() {
  const locale = useLocale();

  return useMemo(() => {
    const format = new Intl.NumberFormat(locale);

    return (value?: number) =>
      typeof value === "number" ? format.format(value) : DASH;
  }, [locale]);
}
