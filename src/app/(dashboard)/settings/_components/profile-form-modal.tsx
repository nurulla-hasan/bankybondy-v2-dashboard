"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { Camera, Pencil } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormInput } from "@/components/common/form-input";
import { Modal } from "@/components/common/modal";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { getInitials } from "@/lib/utils";
import { useUpdateProfile, type AdminProfile } from "@/services";
import { updateProfileSchema, type UpdateProfileSchemaType } from "@/validations";

export function ProfileFormModal({ profile }: { profile: AdminProfile }) {
  const t = useTranslations("Dashboard");
  const { mutateAsync, isPending } = useUpdateProfile();

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      name: profile.name,
      contact: profile.contact ?? "",
      address: profile.address ?? "",
    } as UpdateProfileSchemaType,
    validators: {
      onChange: updateProfileSchema,
      onSubmit: updateProfileSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          name: value.name.trim(),
          contact: value.contact,
          address: value.address,
          image,
        });
        clearPendingImage();
        successToast(t("profileSaved"));
        setOpen(false);
      } catch (error) {
        errorToast(t("saveFailed"), getErrorMessage(error, t("saveFailed")));
      }
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      name: profile.name,
      contact: profile.contact ?? "",
      address: profile.address ?? "",
    });
    clearPendingImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, profile]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const clearPendingImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
    event.target.value = "";
  };

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
      title={t("profileEditTitle")}
      description={t("profileEditSubtitle")}
    >
      <form
        className="flex flex-col gap-5"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="size-16">
              <AvatarImage
                src={preview ?? (profile.profile_image || undefined)}
                alt={profile.name}
              />
              <AvatarFallback>
                {getInitials(profile.name || profile.email)}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label={t("changePhoto")}
              className="absolute -right-1 -bottom-1 grid size-7 cursor-pointer place-items-center rounded-full border bg-background text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Camera className="size-3.5" aria-hidden />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{profile.email}</p>
            {preview && (
              <Badge variant="progress">{t("photoPending")}</Badge>
            )}
          </div>
        </div>

        <FormInput
          form={form}
          name="name"
          label={t("accountName")}
          autoComplete="name"
          placeholder={t("accountName")}
        />

        <Field>
          <FieldLabel htmlFor="locked-email">{t("accountEmail")}</FieldLabel>
          <Input id="locked-email" value={profile.email} disabled readOnly />
          <FieldDescription>{t("emailLocked")}</FieldDescription>
        </Field>

        <FormInput
          form={form}
          name="contact"
          label={t("accountContact")}
          type="tel"
          autoComplete="tel"
          placeholder={t("accountContact")}
        />

        <FormInput
          form={form}
          name="address"
          label={t("accountAddress")}
          autoComplete="street-address"
          placeholder={t("accountAddress")}
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
