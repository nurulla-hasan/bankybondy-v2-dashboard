import { apiClient } from "@/lib/api-client";
import type { ApiResponse, DonationsPage, DonationsQuery } from "@/types";

/** Drop empty params so ofetch never sends `?sort=undefined`. */
function toQueryParams(query: DonationsQuery) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
  );
}

/** GET /donate/get-all-donner — paid donations only, scoped on the server. */
export function getDonations(query: DonationsQuery) {
  return apiClient<ApiResponse<DonationsPage>>("/donate/get-all-donner", {
    query: toQueryParams(query),
  });
}
