"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { FormInput } from "@/components/common/form-input";
import { Modal } from "@/components/common/modal";
import { getErrorMessage, type AppError } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { useUpdateMatchingSettings } from "@/services";
import type { MatchingSettings } from "@/types";
import { createMatchingSettingsPatch, matchingSettingsSchema } from "@/validations";

export function MatchingFormModal({
  config,
  disabled = false,
}: {
  config: MatchingSettings;
  disabled?: boolean;
}) {
  const t = useTranslations("Dashboard");
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(() => ({
    config,
    values: matchingSettingsSchema.parse(config),
  }));
  const [saveError, setSaveError] = useState<string | null>(null);
  const { mutateAsync, isPending, reset } = useUpdateMatchingSettings();

  const form = useForm({
    defaultValues: opening.values,
    validators: {
      onChange: matchingSettingsSchema,
      onSubmit: matchingSettingsSchema,
    },
    onSubmit: async ({ value }) => {
      if (isPending) return;
      setSaveError(null);
      try {
        const payload = createMatchingSettingsPatch(opening.config, value);
        if (!payload) {
          setOpen(false);
          return;
        }
        await mutateAsync(payload);
        successToast(t("matchingSaved"));
        setOpen(false);
      } catch (error: unknown) {
        const apiError = error as AppError | null;
        const status = apiError?.status ?? apiError?.statusCode ?? apiError?.response?.status;
        const message = getErrorMessage(error, t("matchingSaveFailed"));
        setSaveError(status === 409 ? t("matchingConflict") : message);
        errorToast(
          status === 409 ? t("matchingConflict") : t("matchingSaveFailed"),
          message,
        );
      }
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    if (isPending || form.state.isSubmitting) return;
    if (nextOpen) {
      if (disabled) return;
      // Capture values and revision only on opening, never on a background GET.
      const values = matchingSettingsSchema.parse(config);
      setOpening({ config, values });
      form.reset(values);
      reset();
      setSaveError(null);
    }
    setOpen(nextOpen);
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      actionTrigger={
        <Button variant="outline" disabled={disabled}>
          <Pencil aria-hidden />
          {t("edit")}
        </Button>
      }
      title={t("matchingEditTitle")}
      description={t("matchingEditSubtitle")}
      size="lg"
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
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput
            form={form}
            name="candidateMode"
            label={t("candidateMode")}
            type="select"
            disabled={isPending}
            options={[
              { value: "vector", label: t("candidateModeVector") },
              { value: "knn", label: t("candidateModeKnn") },
            ]}
          />

          <FormInput
            form={form}
            name="cacheTtlMinutes"
            label={t("cacheTtl")}
            description={t("cacheTtlDesc")}
            type="number"
            min={0}
            max={43200}
            step={1}
            disabled={isPending}
          />

          <FormInput
            form={form}
            name="surpriseFloor"
            label={t("surpriseFloor")}
            type="number"
            step="0.01"
            min={0}
            max={1}
            disabled={isPending}
          />

          <FormInput
            form={form}
            name="surpriseMargin"
            label={t("surpriseMargin")}
            type="number"
            step="0.01"
            min={0}
            max={1}
            disabled={isPending}
          />

          <FormInput
            form={form}
            name="frontierSeeds"
            label={t("frontierSeeds")}
            type="number"
            min={1}
            max={20}
            step={1}
            disabled={isPending}
          />

          <form.Field name="frontierEnabled">
            {(field) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>
                    {t("frontierEnabled")}
                  </FieldLabel>
                  <FieldDescription>{t("frontierEnabledDesc")}</FieldDescription>
                </FieldContent>
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                  onBlur={field.handleBlur}
                  disabled={isPending}
                />
              </Field>
            )}
          </form.Field>

          <FormInput
            form={form}
            name="sweepBatch"
            label={t("sweepBatch")}
            type="number"
            min={1}
            max={20000}
            step={1}
            disabled={isPending}
          />

          <FormInput
            form={form}
            name="sweepCron"
            label={t("sweepCron")}
            description={t("sweepCronDesc")}
            maxLength={120}
            disabled={isPending}
          />

          <form.Field name="sweepEnabled">
            {(field) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>
                    {t("sweepEnabled")}
                  </FieldLabel>
                  <FieldDescription>{t("sweepEnabledDesc")}</FieldDescription>
                </FieldContent>
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                  onBlur={field.handleBlur}
                  disabled={isPending}
                />
              </Field>
            )}
          </form.Field>
        </div>

        {saveError && (
          <div className="flex flex-col gap-1" role="alert">
            <p>{saveError}</p>
            <p>{t("matchingReopenHint")}</p>
          </div>
        )}

        <form.Subscribe
          selector={({ canSubmit, isSubmitting, isDefaultValue }) => ({
            canSubmit, isSubmitting, isDefaultValue,
          })}
        >
          {({ canSubmit, isSubmitting, isDefaultValue }) => (
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
                loadingText={t("matchingSaving")}
                disabled={!canSubmit || isDefaultValue}
              >
                {t("saveChanges")}
              </Button>
            </DialogFooter>
          )}
        </form.Subscribe>
      </form>
    </Modal>
  );
}
