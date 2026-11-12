"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { formatDate } from "@/lib/utils";
import type { Skill } from "@/types";

import { DeleteSkillModal } from "./delete-skill-modal";
import { SkillFormModal } from "./skill-form-modal";

export function useSkillsColumns() {
  const t = useTranslations("Skills");

  const columns: ColumnDef<Skill, unknown>[] = [
    {
      id: "name",
      header: t("columnName"),
      meta: { headerClassName: "min-w-56" },
      cell: ({ row }) => (
        <span className="text-sm font-medium">{row.original.name}</span>
      ),
    },
    {
      id: "createdAt",
      header: t("columnCreated"),
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
          <SkillFormModal skill={row.original} />
          <DeleteSkillModal skill={row.original} />
        </div>
      ),
    },
  ];

  return columns;
}
