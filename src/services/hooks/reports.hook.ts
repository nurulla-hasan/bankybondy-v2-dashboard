import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { ReportsQuery } from "@/types";
import { deleteReport, getReports } from "../api/reports.api";

export const reportsKeys = {
  all: ["reports"] as const,
  list: (query: ReportsQuery) => ["reports", "list", query] as const,
};

export function useReports(query: ReportsQuery) {
  return useQuery({
    queryKey: reportsKeys.list(query),
    queryFn: async () => (await getReports(query)).data,
    // Keep the previous page visible while the next one loads.
    placeholderData: keepPreviousData,
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: reportsKeys.all }),
  });
}
