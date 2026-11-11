"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { FormInput } from "@/components/common/form-input";
import { Modal } from "@/components/common/modal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { useSetUserPlan } from "@/services";
import type { AdminUser } from "@/types";
import { changeUserPlanSchema, userPlans } from "@/validations";

import { PlanBadge } from "./user-badges";

export function ChangePlanModal({ user }: { user: AdminUser }) {
  const t = useTranslations("Users");
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useSetUserPlan();

  const form = useForm({
    defaultValues: {
      type: user.subscriptionType,
      reason: "",
    },
    validators: {
      onChange: changeUserPlanSchema,
      onSubmit: changeUserPlanSchema,
    },
    onSubmit: async ({ value }) => {
      if (isPending) return;
      try {
        await mutateAsync({
          profileId: user._id,
          payload: {
            type: value.type,
            reason: value.reason.trim() || undefined,
          },
        });
        successToast(t("planSaved"));
        setOpen(false);
      } catch (error: unknown) {
        errorToast(t("planFailed"), getErrorMessage(error, t("planFailed")));
      }
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    if (isPending || form.state.isSubmitting) return;
    if (nextOpen) {
      form.reset({ type: user.subscriptionType, reason: "" });
    }
    setOpen(nextOpen);
  }

  return (
    <Tooltip>
      <Modal
        open={open}
        onOpenChange={handleOpenChange}
        actionTrigger={
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("changePlan")}
              >
                <Sparkles aria-hidden />
              </Button>
            }
          />
        }
        title={t("planTitle")}
        description={t("planSubtitle")}
      >
      <form
        className="flex flex-col gap-5"
        noValidate
        aria-busy={isPending}
        onSubmit={(event) => {
          event.preventDefault();
          if (!isPending && !form.state.isSubmitting) void form.handleSubmit();
        }}
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t("currentPlan")}</span>
          <PlanBadge plan={user.subscriptionType} />
        </div>

        <FormInput
          form={form}
          name="type"
          label={t("planLabel")}
          type="select"
          disabled={isPending}
          options={userPlans.map((plan) => ({ value: plan, label: plan }))}
        />

        <FormInput
          form={form}
          name="reason"
          label={t("reasonLabel")}
          type="textarea"
          placeholder={t("reasonPlaceholder")}
          maxLength={500}
          disabled={isPending}
        />

        <form.Subscribe
          selector={({ canSubmit, isSubmitting, values }) => ({
            canSubmit,
            isSubmitting,
            type: values.type,
          })}
        >
          {({ canSubmit, isSubmitting, type }) => (
            <DialogFooter>
              <DialogClose
                disabled={isPending || isSubmitting}
                render={<Button variant="outline" />}
              >
                {t("cancel")}
              </DialogClose>
              <Button
                type="submit"
                loading={isPending || isSubmitting}
                loadingText={t("saving")}
                disabled={
                  !canSubmit ||
                  isSubmitting ||
                  type === user.subscriptionType
                }
              >
                {t("save")}
              </Button>
            </DialogFooter>
          )}
        </form.Subscribe>
      </form>
      </Modal>
      <TooltipContent>{t("changePlan")}</TooltipContent>
    </Tooltip>
  );
}
