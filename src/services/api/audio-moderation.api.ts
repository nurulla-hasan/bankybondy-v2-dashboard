import { apiClient } from "@/lib/api-client";
import type { AdminAudio, AdminAudiosPage, AdminAudiosQuery, ApiResponse } from "@/types";

/** Drop empty params so ofetch never sends `?moderationStatus=undefined`. */
function toQueryParams(query: AdminAudiosQuery) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
  );
}

/** GET /audio/admin/all-audios — unfiltered moderation listing (admin+). */
export function getAdminAudios(query: AdminAudiosQuery) {
  return apiClient<ApiResponse<AdminAudiosPage>>("/audio/admin/all-audios", {
    query: toQueryParams(query),
  });
}

/** PATCH /audio/admin/block-unblock/:id — reversible toggle, hides from the feed. */
export function blockUnblockAudio(audioId: string) {
  return apiClient<ApiResponse<AdminAudio>>(
    `/audio/admin/block-unblock/${audioId}`,
    { method: "PATCH" },
  );
}

/** DELETE /audio/admin/:id — hard delete; ratings, bookmarks and S3 files go too. */
export function deleteAdminAudio(audioId: string) {
  return apiClient<ApiResponse<null>>(`/audio/admin/${audioId}`, {
    method: "DELETE",
  });
}
