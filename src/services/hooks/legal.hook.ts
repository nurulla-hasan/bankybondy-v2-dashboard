import { useMutation } from "@tanstack/react-query";

import type { LegalDocumentKind } from "@/types";
import { saveLegalDocument } from "../api/legal.api";

interface SaveLegalDocumentVariables {
  kind: LegalDocumentKind;
  description: string;
}

export function useSaveLegalDocument() {
  return useMutation({
    mutationFn: ({ kind, description }: SaveLegalDocumentVariables) =>
      saveLegalDocument(kind, description),
    retry: false,
  });
}
