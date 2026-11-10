import type { UserRole } from "@/types";

export const ACCESS_COOKIE_NAME = "accessToken";
export const REFRESH_COOKIE_NAME = "refreshToken";

/** Roles allowed into the dashboard; the API answers everything else with 403. */
export const isAdminRole = (role?: string): role is UserRole =>
  role === "admin" || role === "superAdmin";
