import sanitizeHtml from "sanitize-html";

import type {
  ApiResponse,
  LegalDocument,
  LegalDocumentContent,
  LegalDocumentKind,
  LegalDocuments,
} from "@/types";

const BACKEND_URL = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

const GET_PATHS: Record<LegalDocumentKind, string> = {
  about: "/manage/get-about-us",
  terms: "/manage/get-terms-conditions",
  privacy: "/manage/get-privacy-policy",
};

const EMPTY_DOCUMENT: LegalDocumentContent = {
  description: null,
  updatedAt: null,
};

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "span",
    "h1",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "blockquote",
    "pre",
    "code",
    "hr",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "a",
  ],
  allowedAttributes: {
    "*": ["style"],
    a: ["href", "target", "rel"],
    ol: ["start"],
  },
  allowedStyles: {
    "*": { "text-align": [/^(left|right|center|justify)$/] },
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
  },
};

async function fetchLegalDocument(
  kind: LegalDocumentKind,
): Promise<LegalDocumentContent> {
  try {
    const response = await fetch(`${BACKEND_URL}${GET_PATHS[kind]}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return EMPTY_DOCUMENT;

    const payload = (await response.json()) as ApiResponse<LegalDocument | null>;
    const description = payload.data?.description?.trim();

    if (!description) return EMPTY_DOCUMENT;

    return {
      description: sanitizeHtml(description, SANITIZE_OPTIONS),
      updatedAt: payload.data?.updatedAt ?? null,
    };
  } catch {
    return EMPTY_DOCUMENT;
  }
}

export async function getLegalDocuments(): Promise<LegalDocuments> {
  const [about, terms, privacy] = await Promise.all([
    fetchLegalDocument("about"),
    fetchLegalDocument("terms"),
    fetchLegalDocument("privacy"),
  ]);

  return { about, terms, privacy };
}
