"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";
import type { AdminUser } from "@/types";

import { PlanBadge, StatusBadge } from "./user-badges";
import { UserActions } from "./user-actions";
import { getUserAccount } from "./user-account";

export function useUsersColumns({ canManage }: { canManage: boolean }) {
  const t = useTranslations("Users");

  const columns: ColumnDef<AdminUser, unknown>[] = [
    {
      id: "user",
      header: t("columnUser"),
      meta: { headerClassName: "min-w-56" },
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={user.profile_image || undefined}
                alt={user.name}
              />
              <AvatarFallback>
                {getInitials(user.name || user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "plan",
      header: t("columnPlan"),
      cell: ({ row }) => <PlanBadge plan={row.original.subscriptionType} />,
    },
    {
      id: "reputation",
      header: t("columnReputation"),
      cell: ({ row }) => {
        const reputation = row.original.reputation;

        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {typeof reputation?.score === "number"
                ? reputation.score.toFixed(1)
                : "—"}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("reviews", { count: reputation?.count ?? 0 })}
            </span>
          </div>
        );
      },
    },
    {
      id: "status",
      header: t("columnStatus"),
      cell: ({ row }) => {
        const account = getUserAccount(row.original);

        return account ? <StatusBadge blocked={account.isBlocked} /> : "—";
      },
    },
    {
      id: "joined",
      header: t("columnJoined"),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <UserActions user={row.original} canManage={canManage} />
      ),
    },
  ];

  return columns;
}
