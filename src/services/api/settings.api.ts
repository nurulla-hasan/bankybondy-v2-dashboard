import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  MatchingSettings,
  UpdateMatchingSettingsPayload,
} from "@/types";

export function getMatchingSettings(signal?: AbortSignal) {
  return apiClient<ApiResponse<MatchingSettings>>("/settings/matching", {
    signal,
  });
}

export function updateMatchingSettings(payload: UpdateMatchingSettingsPayload) {
  return apiClient<ApiResponse<MatchingSettings>>("/settings/matching", {
    method: "PATCH",
    body: payload,
  });
}
