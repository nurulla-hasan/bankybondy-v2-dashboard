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
import { useCreateAdmin, useUpdateAdmin } from "@/services";
import type { AdminMember } from "@/types";
import { createAdminSchema, updateAdminSchema } from "@/validations";

export function AdminFormModal({ admin }: { admin?: AdminMember }) {
  const t = useTranslations("Admins");
  const [open, setOpen] = useState(false);
  const create = useCreateAdmin();
  const update = useUpdateAdmin();
  const isEdit = Boolean(admin);
  const isPending = create.isPending || update.isPending;

  const form = useForm({
    defaultValues: {
      name: admin?.name ?? "",
      email: admin?.email ?? "",
      phoneNumber: admin?.phoneNumber ?? "",
      password: "",
    },
    validators: {
      onChange: isEdit ? updateAdminSchema : createAdminSchema,
      onSubmit: isEdit ? updateAdminSchema : createAdminSchema,
    },
    onSubmit: async ({ value }) => {
      if (isPending) return;
      const phoneNumber = value.phoneNumber.trim() || undefined;

      try {
        if (admin) {
          await update.mutateAsync({
            adminId: admin._id,
            payload: {
              name: value.name.trim(),
              phoneNumber,
              password: value.password || undefined,
            },
          });
          successToast(t("updatedToast"));
        } else {
          await create.mutateAsync({
            name: value.name.trim(),
            email: value.email.trim(),
            phoneNumber,
            password: value.password,
          });
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
    if (nextOpen) {
      form.reset({
        name: admin?.name ?? "",
        email: admin?.email ?? "",
        phoneNumber: admin?.phoneNumber ?? "",
        password: "",
      });
    }
    setOpen(nextOpen);
  }

  const modal = (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      actionTrigger={
        isEdit ? (
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon" aria-label={t("editAdmin")}>
                <Pencil aria-hidden />
              </Button>
            }
          />
        ) : (
          <Button>
            <Plus aria-hidden />
            {t("addAdmin")}
          </Button>
        )
      }
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
          maxLength={80}
          disabled={isPending}
        />

        <FormInput
          form={form}
          name="email"
          label={t("emailLabel")}
          placeholder={t("emailPlaceholder")}
          type="email"
          autoComplete="off"
          disabled={isEdit || isPending}
          description={isEdit ? t("emailHint") : undefined}
        />

        <FormInput
          form={form}
          name="phoneNumber"
          label={t("phoneLabel")}
          placeholder={t("phonePlaceholder")}
          type="tel"
          maxLength={20}
          disabled={isPending}
        />

        <FormInput
          form={form}
          name="password"
          label={t("passwordLabel")}
          placeholder={
            isEdit ? t("passwordPlaceholderEdit") : t("passwordPlaceholder")
          }
          type="password"
          autoComplete="new-password"
          disabled={isPending}
          description={isEdit ? t("passwordHint") : undefined}
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

  if (!isEdit) return modal;

  return (
    <Tooltip>
      {modal}
      <TooltipContent>{t("editAdmin")}</TooltipContent>
    </Tooltip>
  );
}
