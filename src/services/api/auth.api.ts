import { apiClient } from "@/lib/api-client";
import type { ApiResponse, LoginPayload, LoginResponse } from "@/types";

/** POST /auth/login — the API sets HttpOnly accessToken/refreshToken cookies. */
export function loginUser(payload: LoginPayload) {
  return apiClient<ApiResponse<LoginResponse>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

/** POST /auth/logout — clears the refresh cookie server-side. */
export function logoutUser() {
  return apiClient<ApiResponse<null>>("/auth/logout", {
    method: "POST",
  });
}

/** POST /auth/refresh-token — renewed access cookie from the refresh cookie. */
export function refreshSession() {
  return apiClient<ApiResponse<LoginResponse>>("/auth/refresh-token", {
    method: "POST",
  });
}
