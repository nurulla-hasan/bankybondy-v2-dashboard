"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ImagePlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import type { Topic } from "@/types";

import { DeleteTopicModal } from "./delete-topic-modal";
import { TopicFormModal } from "./topic-form-modal";

export function useTopicsColumns() {
  const t = useTranslations("Topics");

  const columns: ColumnDef<Topic, unknown>[] = [
    {
      id: "topic",
      header: t("columnTopic"),
      meta: { headerClassName: "min-w-56" },
      cell: ({ row }) => {
        const topic = row.original;

        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={topic.topic_image || undefined}
                alt={topic.name}
              />
              <AvatarFallback>
                <ImagePlus aria-hidden />
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-sm font-medium">{topic.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {t("audiosCount", { count: topic.totalAudios ?? 0 })}
              </p>
            </div>
          </div>
        );
      },
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
          <TopicFormModal topic={row.original} />
          <DeleteTopicModal topic={row.original} />
        </div>
      ),
    },
  ];

  return columns;
}
