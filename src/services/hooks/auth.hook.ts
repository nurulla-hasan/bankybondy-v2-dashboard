import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  changePassword,
  getMyProfile,
  loginUser,
  logoutUser,
  updateMyProfile,
} from "../api/auth.api";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => (await getMyProfile()).data,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (response) => {
      queryClient.setQueryData(["auth", "me"], response.data);
    },
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      queryClient.cancelQueries();
      queryClient.clear();
      router.replace("/login");
      router.refresh();
    },
  });
}
