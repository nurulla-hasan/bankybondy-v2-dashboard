"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "@tanstack/react-form";
import { ShieldAlert, ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { useLogin } from "@/services";
import { loginSchema, type LoginSchemaType } from "@/validations";
import { errorToast, successToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";

export function LoginForm({
  callbackUrl,
  forbidden,
}: {
  callbackUrl: string;
  forbidden: boolean;
}) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const form = useForm({
    defaultValues: { email: "", password: "" } as LoginSchemaType,
    validators: {
      onChange: loginSchema,
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      login(value, {
        onSuccess: () => {
          successToast(t("loginSuccess"));
          router.replace(callbackUrl);
          router.refresh();
        },
        onError: (err) => errorToast(t("loginError"), getErrorMessage(err)),
      });
    },
  });

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="w-fit rounded-xl bg-primary/10 p-2.5 text-primary">
          <ShieldCheck className="size-5" aria-hidden />
        </div>
        <CardTitle className="font-heading text-xl">{t("loginTitle")}</CardTitle>
        <CardDescription>{t("loginSubtitle")}</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="flex flex-col gap-5"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          {forbidden && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <ShieldAlert className="size-4 shrink-0" aria-hidden />
              {t("adminOnly")}
            </div>
          )}

          <FormInput
            form={form}
            name="email"
            label={t("emailLabel")}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
          />

          <FormInput
            form={form}
            name="password"
            label={t("passwordLabel")}
            type="password"
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={isPending}
            loadingText={t("signingIn")}
          >
            {t("signIn")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
