import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { DonationsQuery } from "@/types";
import { getDonations } from "../api/donors.api";

export const donationsKeys = {
  all: ["donations"] as const,
  list: (query: DonationsQuery) => ["donations", "list", query] as const,
};

export function useDonations(query: DonationsQuery) {
  return useQuery({
    queryKey: donationsKeys.list(query),
    queryFn: async () => (await getDonations(query)).data,
    // Keep the previous page visible while the next one loads.
    placeholderData: keepPreviousData,
  });
}
