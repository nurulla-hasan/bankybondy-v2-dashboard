"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, getInitials } from "@/lib/utils";
import type {
  TransactionCurrency,
  TransactionRecord,
  TransactionType,
  TransactionUser,
} from "@/types";

const TYPE_VARIANTS: Record<TransactionType, "success" | "info"> = {
  Donation: "success",
  Subscription: "info",
};

function formatAmount(
  amount: number,
  currency: TransactionCurrency = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "code",
  }).format(amount);
}

function UserCell({ user }: { user?: TransactionUser | string | null }) {
  const t = useTranslations("Income");

  if (!user || typeof user === "string" || !user.name) {
    return <span className="text-sm text-muted-foreground">{t("unknownUser")}</span>;
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user.profile_image || undefined} alt={user.name} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <p className="truncate text-sm font-medium">{user.name}</p>
    </div>
  );
}

export function useTransactionsColumns() {
  const t = useTranslations("Income");

  const columns: ColumnDef<TransactionRecord, unknown>[] = [
    {
      id: "user",
      header: t("columnUser"),
      meta: { headerClassName: "min-w-48" },
      cell: ({ row }) => <UserCell user={row.original.user} />,
    },
    {
      id: "type",
      header: t("columnType"),
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={TYPE_VARIANTS[row.original.type]}>{row.original.type}</Badge>
          {row.original.refundPending ? (
            <Badge variant="rejected">{t("refundPending")}</Badge>
          ) : null}
        </div>
      ),
    },
    {
      id: "plan",
      header: t("columnPlan"),
      cell: ({ row }) =>
        row.original.plan ? (
          <Badge variant="outline">{row.original.plan}</Badge>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
    {
      id: "amount",
      header: t("columnAmount"),
      cell: ({ row }) => (
        <span className="text-sm font-medium whitespace-nowrap">
          {formatAmount(row.original.amount, row.original.currency ?? "USD")}
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
