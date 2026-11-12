"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";
import type { AdminMember } from "@/types";

import { AdminFormModal } from "./admin-form-modal";
import { DeleteAdminModal } from "./delete-admin-modal";

export function useAdminsColumns() {
  const t = useTranslations("Admins");

  const columns: ColumnDef<AdminMember, unknown>[] = [
    {
      id: "admin",
      header: t("columnAdmin"),
      meta: { headerClassName: "min-w-56" },
      cell: ({ row }) => {
        const admin = row.original;

        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={admin.profile_image || undefined}
                alt={admin.name}
              />
              <AvatarFallback>
                {getInitials(admin.name || admin.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-sm font-medium">{admin.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {admin.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "phoneNumber",
      header: t("columnPhone"),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.phoneNumber || "—"}
        </span>
      ),
    },
    {
      id: "createdAt",
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
        <div className="flex items-center justify-end gap-1">
          <AdminFormModal admin={row.original} />
          <DeleteAdminModal admin={row.original} />
        </div>
      ),
    },
  ];

  return columns;
}
