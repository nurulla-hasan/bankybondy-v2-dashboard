import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { TopicsQuery, UpdateTopicPayload } from "@/types";
import {
  createTopic,
  deleteTopic,
  getTopics,
  updateTopic,
} from "../api/topics.api";

export const topicsKeys = {
  all: ["topics"] as const,
  list: (query: TopicsQuery) => ["topics", "list", query] as const,
};

export function useTopics(query: TopicsQuery) {
  return useQuery({
    queryKey: topicsKeys.list(query),
    queryFn: async () => (await getTopics(query)).data,
    // Keep the previous page visible while the next one loads.
    placeholderData: keepPreviousData,
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTopic,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: topicsKeys.all }),
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      payload,
    }: {
      topicId: string;
      payload: UpdateTopicPayload;
    }) => updateTopic(topicId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: topicsKeys.all }),
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTopic,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: topicsKeys.all }),
  });
}
