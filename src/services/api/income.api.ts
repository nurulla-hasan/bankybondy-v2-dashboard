import { apiClient } from "@/lib/api-client";
import type { ApiResponse, TransactionsPage, TransactionsQuery } from "@/types";

/** Drop empty params so ofetch never sends `?type=undefined`. */
function toQueryParams(query: TransactionsQuery) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
  );
}

/** GET /transaction/all-transactions — paginated income ledger (admin+). */
export function getTransactions(query: TransactionsQuery) {
  return apiClient<ApiResponse<TransactionsPage>>("/transaction/all-transactions", {
    query: toQueryParams(query),
  });
}
