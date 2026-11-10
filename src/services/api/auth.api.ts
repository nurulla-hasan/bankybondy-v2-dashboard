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

export interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  profile_image?: string;
  contact?: string;
  address?: string;
  createdAt?: string;
}

/** GET /auth/me — full profile for the signed-in account. */
export function getMyProfile() {
  return apiClient<ApiResponse<AdminProfile>>("/auth/me");
}

export interface UpdateProfilePayload {
  name: string;
  contact?: string;
  address?: string;
  image?: File | null;
}

/** PATCH /super-admin/update-profile — profile fields, with optional avatar upload. */
export function updateMyProfile({ image, ...fields }: UpdateProfilePayload) {
  if (image) {
    const formData = new FormData();
    formData.append("profile_image", image);
    formData.append("data", JSON.stringify(fields));

    return apiClient<ApiResponse<AdminProfile>>("/super-admin/update-profile", {
      method: "PATCH",
      body: formData,
    });
  }

  return apiClient<ApiResponse<AdminProfile>>("/super-admin/update-profile", {
    method: "PATCH",
    body: fields,
  });
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/** POST /auth/change-password — rotates the signed-in admin's password. */
export function changePassword(payload: ChangePasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/change-password", {
    method: "POST",
    body: payload,
  });
}
