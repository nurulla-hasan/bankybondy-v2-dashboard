import { apiClient } from "@/lib/api-client";
import type {
  AdminMember,
  AdminsPage,
  AdminsQuery,
  ApiResponse,
  CreateAdminPayload,
  UpdateAdminPayload,
} from "@/types";

/** Drop empty params so ofetch never sends `?searchTerm=undefined`. */
function toQueryParams(query: AdminsQuery) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
  );
}

/** GET /admin/all-admins — paginated admin directory (superAdmin only). */
export function getAdmins(query: AdminsQuery) {
  return apiClient<ApiResponse<AdminsPage>>("/admin/all-admins", {
    query: toQueryParams(query),
  });
}

/** POST /admin/create-admin — creates the login account and the profile together. */
export function createAdmin(payload: CreateAdminPayload) {
  return apiClient<ApiResponse<AdminMember>>("/admin/create-admin", {
    method: "POST",
    body: payload,
  });
}

/** PATCH /admin/update-admin/:id — email is immutable on the server. */
export function updateAdmin(adminId: string, payload: UpdateAdminPayload) {
  return apiClient<ApiResponse<AdminMember>>(`/admin/update-admin/${adminId}`, {
    method: "PATCH",
    body: payload,
  });
}

/** DELETE /admin/delete-admin/:id — removes the login account and profile. */
export function deleteAdmin(adminId: string) {
  return apiClient<ApiResponse<null>>(`/admin/delete-admin/${adminId}`, {
    method: "DELETE",
  });
}
