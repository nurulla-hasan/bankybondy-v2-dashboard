import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { SetUserPlanPayload, UsersQuery } from "@/types";
import {
  getUserDetails,
  getUsers,
  setUserPlan,
  toggleUserBlock,
} from "../api/users.api";

export const usersKeys = {
  all: ["users"] as const,
  list: (query: UsersQuery) => ["users", "list", query] as const,
  details: (profileId: string) => ["users", "details", profileId] as const,
};

export function useUsers(query: UsersQuery) {
  return useQuery({
    queryKey: usersKeys.list(query),
    queryFn: async () => (await getUsers(query)).data,
    // Keep the previous page visible while the next one loads so the table does
    // not collapse into a skeleton on every filter/page change.
    placeholderData: keepPreviousData,
  });
}

export function useUserDetails(profileId: string, enabled: boolean) {
  return useQuery({
    queryKey: usersKeys.details(profileId),
    queryFn: async ({ signal }) => (await getUserDetails(profileId, signal)).data,
    enabled,
  });
}

export function useToggleUserBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleUserBlock,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKeys.all }),
  });
}

export function useSetUserPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      profileId,
      payload,
    }: {
      profileId: string;
      payload: SetUserPlanPayload;
    }) => setUserPlan(profileId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKeys.all }),
  });
}
