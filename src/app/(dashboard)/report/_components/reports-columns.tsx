"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, getInitials } from "@/lib/utils";
import type { ReportUserRef, UserReport } from "@/types";

import { DeleteReportModal } from "./delete-report-modal";

function UserCell({
  user,
  fallbackEmail = false,
}: {
  user?: ReportUserRef | null;
  fallbackEmail?: boolean;
}) {
  const t = useTranslations("Reports");

  if (!user?.name) {
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
        {fallbackEmail && user.email ? (
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        ) : null}
      </div>
    </div>
  );
}

export function useReportsColumns() {
  const t = useTranslations("Reports");
  const tIncident = useTranslations("Reports.incidentTypes");

  const columns: ColumnDef<UserReport, unknown>[] = [
    {
      id: "reportFrom",
      header: t("columnReporter"),
      meta: { headerClassName: "min-w-48" },
      cell: ({ row }) => <UserCell user={row.original.reportFrom} />,
    },
    {
      id: "reportTo",
      header: t("columnReported"),
      meta: { headerClassName: "min-w-56" },
      cell: ({ row }) => (
        <UserCell user={row.original.reportTo} fallbackEmail />
      ),
    },
    {
      id: "incidentType",
      header: t("columnIncident"),
      cell: ({ row }) => {
        const incidentType = row.original.incidentType;

        return (
          <Badge variant="outline">
            {tIncident.has(incidentType) ? tIncident(incidentType) : incidentType}
          </Badge>
        );
      },
    },
    {
      id: "additionalNote",
      header: t("columnNote"),
      meta: { headerClassName: "min-w-64" },
      cell: ({ row }) => {
        const note = row.original.additionalNote;

        return (
          <p
            className="line-clamp-2 max-w-72 text-sm text-muted-foreground"
            title={note || undefined}
          >
            {note || "—"}
          </p>
        );
      },
    },
    {
      id: "createdAt",
      header: t("columnReportedAt"),
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
        <div className="flex items-center justify-end gap-1">
          <DeleteReportModal report={row.original} />
        </div>
      ),
    },
  ];

  return columns;
}
