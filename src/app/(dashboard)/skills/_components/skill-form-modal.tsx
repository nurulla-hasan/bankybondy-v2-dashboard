"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { Pencil, Plus } from "lucide-react";

import { FormInput } from "@/components/common/form-input";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { useCreateSkill, useUpdateSkill } from "@/services";
import type { Skill } from "@/types";
import { skillFormSchema } from "@/validations";

export function SkillFormModal({ skill }: { skill?: Skill }) {
  const t = useTranslations("Skills");
  const [open, setOpen] = useState(false);
  const create = useCreateSkill();
  const update = useUpdateSkill();
  const isEdit = Boolean(skill);
  const isPending = create.isPending || update.isPending;

  const form = useForm({
    defaultValues: { name: skill?.name ?? "" },
    validators: {
      onChange: skillFormSchema,
      onSubmit: skillFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (isPending) return;
      const payload = { name: value.name.trim() };

      try {
        if (skill) {
          await update.mutateAsync({ skillId: skill._id, payload });
          successToast(t("updatedToast"));
        } else {
          await create.mutateAsync(payload);
          successToast(t("createdToast"));
        }
        setOpen(false);
      } catch (error: unknown) {
        errorToast(t("saveFailed"), getErrorMessage(error, t("saveFailed")));
      }
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    if (isPending || form.state.isSubmitting) return;
    if (nextOpen) form.reset({ name: skill?.name ?? "" });
    setOpen(nextOpen);
  }

  const trigger = isEdit ? (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("editSkill")}
          >
            <Pencil aria-hidden />
          </Button>
        }
      />
      <TooltipContent>{t("editSkill")}</TooltipContent>
    </Tooltip>
  ) : (
    <Button>
      <Plus aria-hidden />
      {t("addSkill")}
    </Button>
  );

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      actionTrigger={trigger}
      title={isEdit ? t("editTitle") : t("createTitle")}
      description={isEdit ? t("editDescription") : t("createDescription")}
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
        <FormInput
          form={form}
          name="name"
          label={t("nameLabel")}
          placeholder={t("namePlaceholder")}
          maxLength={50}
          disabled={isPending}
        />

        <form.Subscribe
          selector={({ canSubmit, isSubmitting }) => ({
            canSubmit,
            isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
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
                disabled={!canSubmit || isSubmitting || isPending}
              >
                {isEdit ? t("save") : t("create")}
              </Button>
            </DialogFooter>
          )}
        </form.Subscribe>
      </form>
    </Modal>
  );
}
