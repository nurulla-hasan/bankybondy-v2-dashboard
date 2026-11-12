import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { AdminsQuery, UpdateAdminPayload } from "@/types";
import {
  createAdmin,
  deleteAdmin,
  getAdmins,
  updateAdmin,
} from "../api/admins.api";

export const adminsKeys = {
  all: ["admins"] as const,
  list: (query: AdminsQuery) => ["admins", "list", query] as const,
};

export function useAdmins(query: AdminsQuery) {
  return useQuery({
    queryKey: adminsKeys.list(query),
    queryFn: async () => (await getAdmins(query)).data,
    // Keep the previous page visible while the next one loads.
    placeholderData: keepPreviousData,
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminsKeys.all }),
  });
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      adminId,
      payload,
    }: {
      adminId: string;
      payload: UpdateAdminPayload;
    }) => updateAdmin(adminId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminsKeys.all }),
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminsKeys.all }),
  });
}
