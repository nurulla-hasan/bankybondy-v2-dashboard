"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { FileText, Pencil } from "lucide-react";

import { RichTextEditor } from "@/components/common/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { useSaveLegalDocument } from "@/services";
import type { LegalDocumentContent, LegalDocumentKind } from "@/types";

import "@/components/common/tiptap.css";

interface LegalDocumentCardProps {
  kind: LegalDocumentKind;
  title: string;
  content: LegalDocumentContent;
  canEdit: boolean;
}

export function LegalDocumentCard({
  kind,
  title,
  content,
  canEdit,
}: LegalDocumentCardProps) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const router = useRouter();
  const mutation = useSaveLegalDocument();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const startEditing = () => {
    setDraft(content.description ?? "");
    setEditing(true);
  };

  const handleSave = () => {
    mutation.mutate(
      { kind, description: draft },
      {
        onSuccess: () => {
          successToast(t("savedToast"));
          setEditing(false);
          router.refresh();
        },
        onError: (error) => {
          errorToast(getErrorMessage(error, t("legalSaveFailed")));
        },
      },
    );
  };

  const updatedLabel = content.updatedAt
    ? t("legalUpdated", {
        date: new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
          new Date(content.updatedAt),
        ),
      })
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{t("legalPublicHint")}</CardDescription>
        {canEdit && !editing && (
          <CardAction>
            <Button variant="outline" onClick={startEditing}>
              <Pencil data-icon="inline-start" />
              {t("edit")}
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {editing ? (
          <>
            <RichTextEditor
              value={draft}
              onChange={setDraft}
              placeholder={t("legalEditorPlaceholder")}
            />
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="outline"
                disabled={mutation.isPending}
                onClick={() => setEditing(false)}
              >
                {t("cancel")}
              </Button>
              <Button loading={mutation.isPending} onClick={handleSave}>
                {t("saveChanges")}
              </Button>
            </div>
          </>
        ) : content.description ? (
          <>
            <div
              className="tiptap-content"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
            {updatedLabel && (
              <p className="text-xs text-muted-foreground">{updatedLabel}</p>
            )}
          </>
        ) : (
          <div
            className="flex flex-col items-center gap-2 py-10 text-center"
            role="status"
          >
            <FileText className="size-8 text-muted-foreground" />
            <p className="text-muted-foreground">{t("legalEmpty")}</p>
            {canEdit && (
              <Button variant="outline" onClick={startEditing}>
                <Pencil data-icon="inline-start" />
                {t("writeContent")}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
