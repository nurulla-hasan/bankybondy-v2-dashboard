"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";
import type { DonationRecord, DonorUser } from "@/types";

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function DonorCell({ user }: { user?: DonorUser | string | null }) {
  const t = useTranslations("Donors");

  if (!user || typeof user === "string" || !user.name) {
    return <span className="text-sm text-muted-foreground">{t("unknownUser")}</span>;
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user.profile_image || undefined} alt={user.name} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <p className="truncate text-sm font-medium">{user.name}</p>
        {user.email ? (
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        ) : null}
      </div>
    </div>
  );
}

export function useDonorsColumns() {
  const t = useTranslations("Donors");

  const columns: ColumnDef<DonationRecord, unknown>[] = [
    {
      id: "donor",
      header: t("columnDonor"),
      meta: { headerClassName: "min-w-56" },
      cell: ({ row }) => <DonorCell user={row.original.user} />,
    },
    {
      id: "amount",
      header: t("columnAmount"),
      cell: ({ row }) => (
        <span className="text-sm font-medium whitespace-nowrap">
          {formatAmount(row.original.amount)}
        </span>
      ),
    },
    {
      id: "transactionId",
      header: t("columnTransaction"),
      meta: { headerClassName: "min-w-40" },
      cell: ({ row }) => {
        const transactionId = row.original.transactionId;

        return (
          <span
            className="block max-w-40 truncate font-mono text-xs text-muted-foreground"
            title={transactionId || undefined}
          >
            {transactionId || "—"}
          </span>
        );
      },
    },
    {
      id: "createdAt",
      header: t("columnDate"),
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
  ];

  return columns;
}
