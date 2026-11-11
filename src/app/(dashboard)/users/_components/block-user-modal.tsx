"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Ban, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { useToggleUserBlock } from "@/services";
import type { AdminUser, AdminUserAccount } from "@/types";

export function BlockUserModal({
  user,
  account,
}: {
  user: AdminUser;
  account: AdminUserAccount;
}) {
  const t = useTranslations("Users");
  const [open, setOpen] = useState(false);
  const toggleBlock = useToggleUserBlock();
  const isBlocked = account.isBlocked;

  async function handleConfirm() {
    try {
      await toggleBlock.mutateAsync(account._id);
      successToast(isBlocked ? t("unblockedToast") : t("blockedToast"));
      setOpen(false);
    } catch (error: unknown) {
      errorToast(t("blockFailed"), getErrorMessage(error, t("blockFailed")));
    }
  }

  return (
    <Tooltip>
      <ConfirmationModal
        open={open}
        onOpenChange={(nextOpen) => {
          if (!toggleBlock.isPending) setOpen(nextOpen);
        }}
        actionTrigger={
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  isBlocked ? t("unblockAccount") : t("blockAccount")
                }
              >
                {isBlocked ? (
                  <ShieldCheck aria-hidden />
                ) : (
                  <Ban aria-hidden />
                )}
              </Button>
            }
          />
        }
        title={isBlocked ? t("unblockTitle") : t("blockTitle")}
        description={
          isBlocked
            ? t("unblockDescription", { name: user.name })
            : t("blockDescription", { name: user.name })
        }
        confirmText={isBlocked ? t("confirmUnblock") : t("confirmBlock")}
        loadingText={t("updating")}
        cancelText={t("cancel")}
        variant={isBlocked ? "default" : "destructive"}
        isLoading={toggleBlock.isPending}
        onConfirm={handleConfirm}
      />
      <TooltipContent>
        {isBlocked ? t("unblockAccount") : t("blockAccount")}
      </TooltipContent>
    </Tooltip>
  );
}
