import { apiClient } from "@/lib/api-client";
import type { ApiResponse, ReportsPage, ReportsQuery } from "@/types";

/** Drop empty params so ofetch never sends `?searchTerm=undefined`. */
function toQueryParams(query: ReportsQuery) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
  );
}

/** GET /report/all-reports — paginated reports filed by users (admin+). */
export function getReports(query: ReportsQuery) {
  return apiClient<ApiResponse<ReportsPage>>("/report/all-reports", {
    query: toQueryParams(query),
  });
}

/** DELETE /report/delete-report/:id — hard delete on the server. */
export function deleteReport(reportId: string) {
  return apiClient<ApiResponse<null>>(`/report/delete-report/${reportId}`, {
    method: "DELETE",
  });
}
