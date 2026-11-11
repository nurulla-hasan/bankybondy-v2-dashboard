import { apiClient } from "@/lib/api-client";
import type {
  AdminUser,
  AdminUsersPage,
  ApiResponse,
  SetUserPlanPayload,
  UsersQuery,
} from "@/types";

/** Drop empty params so ofetch never sends `?searchTerm=undefined`. */
function toQueryParams(query: UsersQuery) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
  );
}

/** GET /normal-user/get-all-user — paginated staff listing (admin branch). */
export function getUsers(query: UsersQuery) {
  return apiClient<ApiResponse<AdminUsersPage>>("/normal-user/get-all-user", {
    query: toQueryParams(query),
  });
}

/** GET /normal-user/single-user/:id — full member profile (staff view). */
export function getUserDetails(profileId: string, signal?: AbortSignal) {
  return apiClient<ApiResponse<AdminUser>>(
    `/normal-user/single-user/${profileId}`,
    { signal },
  );
}

/** PATCH /user/block-unblock/:id — toggles User.isBlocked (account id, not profile id). */
export function toggleUserBlock(accountId: string) {
  return apiClient<ApiResponse<AdminUserAccountResponse>>(
    `/user/block-unblock/${accountId}`,
    { method: "PATCH" },
  );
}

export interface AdminUserAccountResponse {
  _id: string;
  isBlocked: boolean;
}

/** PATCH /normal-user/admin/subscription/:id — audited manual plan override. */
export function setUserPlan(profileId: string, payload: SetUserPlanPayload) {
  return apiClient<ApiResponse<AdminUser>>(
    `/normal-user/admin/subscription/${profileId}`,
    { method: "PATCH", body: payload },
  );
}
