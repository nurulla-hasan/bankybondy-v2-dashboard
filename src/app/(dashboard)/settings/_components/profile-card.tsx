"use client";

import { useLocale, useTranslations } from "next-intl";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { useMyProfile, type AdminProfile } from "@/services";

import { DetailItem } from "./detail-item";
import { ProfileFormModal } from "./profile-form-modal";

export function ProfileCard({ role }: { role: string }) {
  const t = useTranslations("Dashboard");
  const profile = useMyProfile();

  if (profile.isPending) return <ProfileCardSkeleton />;

  if (profile.isError || !profile.data) {
    return (
      <Card>
        <CardContent
          className="flex flex-col items-start gap-3 py-10"
          role="alert"
        >
          <p className="text-sm text-muted-foreground">
            {t("profileLoadError")}
          </p>
          <Button variant="outline" onClick={() => profile.refetch()}>
            {t("retry")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <ProfileSummary profile={profile.data} role={role} />;
}

function ProfileSummary({
  profile,
  role,
}: {
  profile: AdminProfile;
  role: string;
}) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();

  const joined = profile.createdAt
    ? new Intl.DateTimeFormat(locale, {
        month: "short",
        year: "numeric",
      }).format(new Date(profile.createdAt))
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profileTitle")}</CardTitle>
        <CardDescription>{t("profileSubtitle")}</CardDescription>
        <CardAction>
          <ProfileFormModal profile={profile} />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={profile.profile_image || undefined} alt={profile.name} />
            <AvatarFallback>
              {getInitials(profile.name || profile.email)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate font-heading text-sm font-semibold">
              {profile.name}
            </p>
            <Badge variant="admin">{role}</Badge>
          </div>

          {joined && (
            <p className="ml-auto text-xs text-muted-foreground">
              {t("memberSince", { date: joined })}
            </p>
          )}
        </div>

        <dl className="grid gap-3 sm:grid-cols-3">
          <DetailItem label={t("accountEmail")} value={profile.email} />
          <DetailItem
            label={t("accountContact")}
            value={profile.contact}
            emptyText={t("notSet")}
          />
          <DetailItem
            label={t("accountAddress")}
            value={profile.address}
            emptyText={t("notSet")}
          />
        </dl>
      </CardContent>
    </Card>
  );
}

function ProfileCardSkeleton() {
  return (
    <Card aria-busy="true">
      <CardHeader>
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
