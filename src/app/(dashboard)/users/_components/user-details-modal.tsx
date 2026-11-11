"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/common/modal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate, formatDateTime, getInitials } from "@/lib/utils";
import { useUserDetails } from "@/services";
import type { AdminUser, UserSkill } from "@/types";

import { PlanBadge, StatusBadge } from "./user-badges";
import { getUserAccount } from "./user-account";

export function UserDetailsModal({ user }: { user: AdminUser }) {
  const t = useTranslations("Users");
  const [open, setOpen] = useState(false);
  const details = useUserDetails(user._id, open);
  const data = details.data ?? user;
  const account = getUserAccount(data);
  const skills = (data.skills ?? []).filter(
    (skill): skill is UserSkill => typeof skill !== "string",
  );

  return (
    <Tooltip>
      <Modal
        open={open}
        onOpenChange={setOpen}
        actionTrigger={
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("viewDetails")}
              >
                <Eye aria-hidden />
              </Button>
            }
          />
        }
        title={data.name}
        description={t("detailsSubtitle")}
        size="lg"
      >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="size-14">
            <AvatarImage
              src={data.profile_image || undefined}
              alt={data.name}
            />
            <AvatarFallback>
              {getInitials(data.name || data.email)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate text-sm font-medium">{data.email}</p>
            <div className="flex flex-wrap items-center gap-2">
              <PlanBadge plan={data.subscriptionType} />
              {account && <StatusBadge blocked={account.isBlocked} />}
            </div>
          </div>

          <p className="ml-auto text-xs text-muted-foreground">
            {t("memberSince", { date: formatDate(data.createdAt) })}
          </p>
        </div>

        {details.isError && (
          <div
            className="flex flex-col items-start gap-3 rounded-lg border p-4"
            role="alert"
          >
            <p className="text-sm text-muted-foreground">{t("detailsError")}</p>
            <Button variant="outline" onClick={() => details.refetch()}>
              {t("retry")}
            </Button>
          </div>
        )}

        {details.isPending ? (
          <div className="grid gap-3 sm:grid-cols-2" aria-busy="true">
            <span className="sr-only">{t("detailsLoading")}</span>
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : details.isError ? null : (
          <>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Detail label={t("phone")} value={data.phone} emptyText={t("notSet")} />
              <Detail
                label={t("birthDate")}
                value={data.dateOfBirth ? formatDate(data.dateOfBirth) : null}
                emptyText={t("notSet")}
              />
              <Detail
                label={t("gender")}
                value={data.gender}
                emptyText={t("notSet")}
              />
              <Detail
                label={t("address")}
                value={data.address}
                emptyText={t("notSet")}
              />
              <Detail label={t("bondLimit")} value={data.bondLimit} />
              <Detail
                label={t("reputation")}
                value={
                  data.reputation
                    ? `${data.reputation.avg.toFixed(1)} · ${t("reviews", {
                        count: data.reputation.count,
                      })}`
                    : null
                }
                emptyText={t("reviews", { count: 0 })}
              />
              <Detail label={t("listedInPeople")} value={data.listedInPeople === false ? t("no") : t("yes")} />
              <Detail label={t("publicBonds")} value={data.bondsPublic === false ? t("no") : t("yes")} />
              <Detail label={t("weeklyDigest")} value={data.digestOptOut ? t("no") : t("yes")} />
              <Detail
                label={t("lastUpdate")}
                value={formatDateTime(data.updatedAt)}
              />
            </dl>

            {data.bio && (
              <div className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">{t("bio")}</p>
                <p className="whitespace-pre-line text-sm">{data.bio}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">{t("skills")}</p>
              {skills.length ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill._id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t("notSet")}</p>
              )}
            </div>
          </>
        )}
      </div>
      </Modal>
      <TooltipContent>{t("viewDetails")}</TooltipContent>
    </Tooltip>
  );
}

function Detail({
  label,
  value,
  emptyText,
}: {
  label: string;
  value?: string | number | null;
  emptyText?: string;
}) {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={
          hasValue
            ? "truncate text-sm font-medium"
            : "truncate text-sm text-muted-foreground"
        }
      >
        {hasValue ? value : (emptyText ?? "—")}
      </dd>
    </div>
  );
}
