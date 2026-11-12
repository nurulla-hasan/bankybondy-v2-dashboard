"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";

import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { useDeleteReport } from "@/services";
import type { UserReport } from "@/types";

export function DeleteReportModal({ report }: { report: UserReport }) {
  const t = useTranslations("Reports");
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useDeleteReport();

  const reportedName = report.reportTo?.name ?? t("unknownUser");

  async function handleConfirm() {
    try {
      await mutateAsync(report._id);
      successToast(t("deletedToast"));
      setOpen(false);
    } catch (error: unknown) {
      errorToast(t("deleteFailed"), getErrorMessage(error, t("deleteFailed")));
    }
  }

  return (
    <Tooltip>
      <ConfirmationModal
        open={open}
        onOpenChange={(nextOpen) => {
          if (!isPending) setOpen(nextOpen);
        }}
        actionTrigger={
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("deleteReport")}
              >
                <Trash2 aria-hidden />
              </Button>
            }
          />
        }
        title={t("deleteTitle")}
        description={t("deleteDescription", { name: reportedName })}
        confirmText={t("confirmDelete")}
        loadingText={t("deleting")}
        cancelText={t("cancel")}
        variant="destructive"
        isLoading={isPending}
        onConfirm={handleConfirm}
      />
      <TooltipContent>{t("deleteReport")}</TooltipContent>
    </Tooltip>
  );
}
