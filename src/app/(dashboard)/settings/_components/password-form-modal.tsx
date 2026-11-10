"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { FormInput } from "@/components/common/form-input";
import { Modal } from "@/components/common/modal";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { useChangePassword } from "@/services";
import {
  changePasswordSchema,
  type ChangePasswordSchemaType,
} from "@/validations";

const emptyValues: ChangePasswordSchemaType = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export function PasswordFormModal() {
  const t = useTranslations("Dashboard");
  const { mutateAsync, isPending } = useChangePassword();

  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: emptyValues,
    validators: {
      onChange: changePasswordSchema,
      onSubmit: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync(value);
        successToast(t("passwordChanged"));
        form.reset(emptyValues);
        setOpen(false);
      } catch (error) {
        errorToast(
          t("passwordFailed"),
          getErrorMessage(error, t("passwordFailed")),
        );
      }
    },
  });

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      actionTrigger={
        <Button variant="outline">
          <KeyRound aria-hidden />
          {t("changePassword")}
        </Button>
      }
      title={t("passwordEditTitle")}
      description={t("passwordEditSubtitle")}
    >
      <form
        className="flex flex-col gap-5"
        noValidate
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <FormInput
          form={form}
          name="oldPassword"
          label={t("currentPassword")}
          type="password"
          autoComplete="current-password"
        />

        <FormInput
          form={form}
          name="newPassword"
          label={t("newPassword")}
          type="password"
          autoComplete="new-password"
          description={t("passwordMin")}
        />

        <FormInput
          form={form}
          name="confirmNewPassword"
          label={t("confirmPassword")}
          type="password"
          autoComplete="new-password"
        />

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t("cancel")}
          </DialogClose>
          <Button type="submit" loading={isPending}>
            {t("saveChanges")}
          </Button>
        </DialogFooter>
      </form>
    </Modal>
  );
}
