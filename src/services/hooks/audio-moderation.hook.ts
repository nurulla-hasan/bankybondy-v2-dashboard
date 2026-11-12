import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { AdminAudiosQuery } from "@/types";
import {
  blockUnblockAudio,
  deleteAdminAudio,
  getAdminAudios,
} from "../api/audio-moderation.api";

export const audioModerationKeys = {
  all: ["audio-moderation"] as const,
  list: (query: AdminAudiosQuery) =>
    ["audio-moderation", "list", query] as const,
};

export function useAdminAudios(query: AdminAudiosQuery) {
  return useQuery({
    queryKey: audioModerationKeys.list(query),
    queryFn: async () => (await getAdminAudios(query)).data,
    // Keep the previous page visible while the next one loads.
    placeholderData: keepPreviousData,
  });
}

export function useBlockUnblockAudio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blockUnblockAudio,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: audioModerationKeys.all }),
  });
}

export function useDeleteAdminAudio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminAudio,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: audioModerationKeys.all }),
  });
}
