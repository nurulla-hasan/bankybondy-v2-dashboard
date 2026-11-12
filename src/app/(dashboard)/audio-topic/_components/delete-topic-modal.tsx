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
import { useDeleteTopic } from "@/services";
import type { Topic } from "@/types";

export function DeleteTopicModal({ topic }: { topic: Topic }) {
  const t = useTranslations("Topics");
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useDeleteTopic();

  async function handleConfirm() {
    try {
      await mutateAsync(topic._id);
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
                aria-label={t("deleteTopic")}
              >
                <Trash2 aria-hidden />
              </Button>
            }
          />
        }
        title={t("deleteTitle")}
        description={t("deleteDescription", { name: topic.name })}
        confirmText={t("confirmDelete")}
        loadingText={t("deleting")}
        cancelText={t("cancel")}
        variant="destructive"
        isLoading={isPending}
        onConfirm={handleConfirm}
      />
      <TooltipContent>{t("deleteTopic")}</TooltipContent>
    </Tooltip>
  );
}
