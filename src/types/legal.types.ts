export type LegalDocumentKind = "about" | "terms" | "privacy";

/** Raw singleton document returned by `GET /manage/get-*`. */
export interface LegalDocument {
  _id?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Sanitized legal content passed from the server page to the settings view. */
export interface LegalDocumentContent {
  description: string | null;
  updatedAt: string | null;
}

export type LegalDocuments = Record<LegalDocumentKind, LegalDocumentContent>;
