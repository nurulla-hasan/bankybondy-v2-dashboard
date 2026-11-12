"use client";

import { useTranslations } from "next-intl";
import { Ban, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { useBlockUnblockAudio } from "@/services";
import type { AdminAudio } from "@/types";

export function BlockAudioButton({ audio }: { audio: AdminAudio }) {
  const t = useTranslations("AudioModeration");
  const { mutateAsync, isPending } = useBlockUnblockAudio();

  async function handleToggle() {
    try {
      await mutateAsync(audio._id);
      successToast(audio.isBlocked ? t("unblockedToast") : t("blockedToast"));
    } catch (error: unknown) {
      errorToast(t("updateFailed"), getErrorMessage(error, t("updateFailed")));
    }
  }

  const label = audio.isBlocked ? t("unblockAudio") : t("blockAudio");

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            disabled={isPending}
            onClick={() => {
              void handleToggle();
            }}
          >
            {audio.isBlocked ? <CircleCheck aria-hidden /> : <Ban aria-hidden />}
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
