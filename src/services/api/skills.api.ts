import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  Skill,
  SkillPayload,
  SkillsPage,
  SkillsQuery,
} from "@/types";

/** Drop empty params so ofetch never sends `?searchTerm=undefined`. */
function toQueryParams(query: SkillsQuery) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
  );
}

/** GET /skill/all-skills — paginated skill catalog (staff). */
export function getSkills(query: SkillsQuery) {
  return apiClient<ApiResponse<SkillsPage>>("/skill/all-skills", {
    query: toQueryParams(query),
  });
}

/** POST /skill/create-skill — admin + superAdmin. */
export function createSkill(payload: SkillPayload) {
  return apiClient<ApiResponse<Skill>>("/skill/create-skill", {
    method: "POST",
    body: payload,
  });
}

/** PATCH /skill/update-skill/:skillId — admin + superAdmin. */
export function updateSkill(skillId: string, payload: SkillPayload) {
  return apiClient<ApiResponse<Skill>>(`/skill/update-skill/${skillId}`, {
    method: "PATCH",
    body: payload,
  });
}

/** DELETE /skill/delete-skill/:skillId — admin + superAdmin. */
export function deleteSkill(skillId: string) {
  return apiClient<ApiResponse<Skill>>(`/skill/delete-skill/${skillId}`, {
    method: "DELETE",
  });
}
