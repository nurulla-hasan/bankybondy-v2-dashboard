import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { MatchingSettings } from "@/types";
import {
  getMatchingSettings,
  updateMatchingSettings,
} from "../api/settings.api";

export const matchingSettingsQueryKey = ["settings", "matching"] as const;

export function useMatchingSettings() {
  return useQuery({
    queryKey: matchingSettingsQueryKey,
    queryFn: async ({ signal }) => (await getMatchingSettings(signal)).data,
    staleTime: 0,
  });
}

export function useUpdateMatchingSettings() {
  const queryClient = useQueryClient();
  const queryFilter = { queryKey: matchingSettingsQueryKey, exact: true };

  return useMutation({
    mutationFn: updateMatchingSettings,
    retry: false,
    onSuccess: async (response) => {
      // Stop an older GET from overwriting the authoritative saved response.
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueryData<MatchingSettings>(
        matchingSettingsQueryKey,
        (current) =>
          current && current.revision > response.data.revision
            ? current
            : response.data,
      );
    },
    // Refresh after failures too, including conflicts and uncertain network outcomes.
    onSettled: () => queryClient.invalidateQueries(queryFilter),
  });
}
