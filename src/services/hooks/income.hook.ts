import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { TransactionsQuery } from "@/types";
import { getTransactions } from "../api/income.api";

export const transactionsKeys = {
  all: ["transactions"] as const,
  list: (query: TransactionsQuery) => ["transactions", "list", query] as const,
};

export function useTransactions(query: TransactionsQuery) {
  return useQuery({
    queryKey: transactionsKeys.list(query),
    queryFn: async () => (await getTransactions(query)).data,
    // Keep the previous page visible while the next one loads.
    placeholderData: keepPreviousData,
  });
}
