import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { loginUser, logoutUser } from "../api/auth.api";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.clear();
    },
  });
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
