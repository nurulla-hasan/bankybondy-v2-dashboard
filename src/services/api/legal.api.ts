import { apiClient } from "@/lib/api-client";
import type { ApiResponse, LegalDocument, LegalDocumentKind } from "@/types";

const GET_PATHS: Record<LegalDocumentKind, string> = {
  about: "/manage/get-about-us",
  terms: "/manage/get-terms-conditions",
  privacy: "/manage/get-privacy-policy",
};

const SAVE_PATHS: Record<LegalDocumentKind, string> = {
  about: "/manage/add-about-us",
  terms: "/manage/add-terms-conditions",
  privacy: "/manage/add-privacy-policy",
};

export function getLegalDocument(kind: LegalDocumentKind) {
  return apiClient<ApiResponse<LegalDocument | null>>(GET_PATHS[kind]);
}

/** `add-*` upserts the singleton; the update branch returns no document. */
export function saveLegalDocument(
  kind: LegalDocumentKind,
  description: string,
) {
  return apiClient<ApiResponse<LegalDocument | null>>(SAVE_PATHS[kind], {
    method: "POST",
    body: { description },
  });
}
