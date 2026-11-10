"use client";

import { useEffect, useState } from "react";
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
import { successToast } from "@/lib/toast";
import {
  matchingSettingsSchema,
  type MatchingSettingsType,
} from "@/validations";

export function MatchingFormModal({
  config,
  onSave,
}: {
  config: MatchingSettingsType;
  onSave: (next: MatchingSettingsType) => void;
}) {
  const t = useTranslations("Dashboard");
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: config,
    validators: {
      onChange: matchingSettingsSchema,
      onSubmit: matchingSettingsSchema,
    },
    onSubmit: ({ value }) => {
      onSave(value);
      successToast(t("savedToast"));
      setOpen(false);
    },
  });

  useEffect(() => {
    if (open) form.reset(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, config]);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      actionTrigger={
        <Button variant="outline">
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
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput
            form={form}
            name="candidateMode"
            label={t("candidateMode")}
            type="select"
            options={[
              { value: "hybrid", label: t("candidateModeHybrid") },
              { value: "knn", label: t("candidateModeKnn") },
              { value: "frontier", label: t("candidateModeFrontier") },
            ]}
          />

          <FormInput
            form={form}
            name="cacheTtl"
            label={t("cacheTtl")}
            type="number"
            min={0}
            max={1440}
          />

          <FormInput
            form={form}
            name="surpriseFloor"
            label={t("surpriseFloor")}
            type="number"
            step="0.01"
            min={0}
            max={1}
          />

          <FormInput
            form={form}
            name="surpriseMargin"
            label={t("surpriseMargin")}
            type="number"
            step="0.01"
            min={0}
            max={1}
          />

          <FormInput
            form={form}
            name="frontierSeeds"
            label={t("frontierSeeds")}
            type="number"
            min={1}
            max={200}
          />

          <FormInput
            form={form}
            name="sweepBatch"
            label={t("sweepBatch")}
            type="number"
            min={1}
            max={5000}
          />

          <FormInput
            form={form}
            name="sweepCron"
            label={t("sweepCron")}
            placeholder="0 */6 * * *"
          />

          <form.Field name="sweepEnabled">
            {(field) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="sweep-enabled">
                    {t("sweepEnabled")}
                  </FieldLabel>
                  <FieldDescription>{t("sweepEnabledDesc")}</FieldDescription>
                </FieldContent>
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </Field>
            )}
          </form.Field>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t("cancel")}
          </DialogClose>
          <Button type="submit">{t("saveChanges")}</Button>
        </DialogFooter>
      </form>
    </Modal>
  );
}
