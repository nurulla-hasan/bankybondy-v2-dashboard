"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { ImagePlus, Pencil, Plus } from "lucide-react";

import { FormInput } from "@/components/common/form-input";
import { Modal } from "@/components/common/modal";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { useCreateTopic, useUpdateTopic } from "@/services";
import type { Topic } from "@/types";
import { topicFormSchema } from "@/validations";

export function TopicFormModal({ topic }: { topic?: Topic }) {
  const t = useTranslations("Topics");
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const create = useCreateTopic();
  const update = useUpdateTopic();
  const isEdit = Boolean(topic);
  const isPending = create.isPending || update.isPending;

  const clearPendingImage = () => {
    setImage(null);
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setImageError(false);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const form = useForm({
    defaultValues: { name: topic?.name ?? "" },
    validators: {
      onChange: topicFormSchema,
      onSubmit: topicFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (isPending) return;
      if (!topic && !image) {
        setImageError(true);
        return;
      }

      const payload = { name: value.name.trim() };

      try {
        if (topic) {
          await update.mutateAsync({
            topicId: topic._id,
            payload: { ...payload, image },
          });
          successToast(t("updatedToast"));
        } else if (image) {
          await create.mutateAsync({ ...payload, image });
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
      form.reset({ name: topic?.name ?? "" });
      clearPendingImage();
    }
    setOpen(nextOpen);
  }

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    setImage(file);
    setImageError(false);
    event.target.value = "";
  };

  const trigger = isEdit ? (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={t("editTopic")}>
            <Pencil aria-hidden />
          </Button>
        }
      />
      <TooltipContent>{t("editTopic")}</TooltipContent>
    </Tooltip>
  ) : (
    <Button>
      <Plus aria-hidden />
      {t("addTopic")}
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
          maxLength={60}
          disabled={isPending}
        />

        <Field data-invalid={imageError || undefined}>
          <FieldLabel htmlFor="topic-image">{t("imageLabel")}</FieldLabel>
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage
                src={preview ?? (topic?.topic_image || undefined)}
                alt={topic?.name ?? t("imageLabel")}
              />
              <AvatarFallback>
                <ImagePlus aria-hidden />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus aria-hidden />
                {preview || topic?.topic_image
                  ? t("replaceImage")
                  : t("uploadImage")}
              </Button>
              <FieldDescription>{t("imageHint")}</FieldDescription>
            </div>

            <input
              ref={fileInputRef}
              id="topic-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onFileChange}
              className="hidden"
            />
          </div>
          {imageError && <FieldError>{t("imageRequired")}</FieldError>}
        </Field>

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
