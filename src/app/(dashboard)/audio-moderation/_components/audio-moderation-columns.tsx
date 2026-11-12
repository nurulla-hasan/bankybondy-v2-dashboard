"use client";

import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate, getInitials } from "@/lib/utils";
import type {
  AdminAudio,
  AudioAuthor,
  AudioModerationStatus,
} from "@/types";

import { BlockAudioButton } from "./block-audio-button";
import { DeleteAudioModal } from "./delete-audio-modal";

const STATUS_VARIANTS: Record<
  AudioModerationStatus,
  "processing" | "success" | "rejected" | "warning"
> = {
  processing: "processing",
  ready: "success",
  rejected: "rejected",
  failed: "warning",
};

const STATUS_LABEL_KEY: Record<AudioModerationStatus, string> = {
  processing: "statusProcessing",
  ready: "statusReady",
  rejected: "statusRejected",
  failed: "statusFailed",
};

function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return "—";
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function AuthorCell({ author }: { author?: AudioAuthor | string | null }) {
  const t = useTranslations("AudioModeration");

  if (!author || typeof author === "string" || !author.name) {
    return <span className="text-sm text-muted-foreground">{t("unknownUser")}</span>;
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={author.profile_image || undefined} alt={author.name} />
        <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <p className="truncate text-sm font-medium">{author.name}</p>
        {author.email ? (
          <p className="truncate text-xs text-muted-foreground">{author.email}</p>
        ) : null}
      </div>
    </div>
  );
}

function AudioCell({ audio }: { audio: AdminAudio }) {
  const t = useTranslations("AudioModeration");
  const topicName =
    audio.audioTopic && typeof audio.audioTopic === "object"
      ? audio.audioTopic.name
      : undefined;

  return (
    <div className="flex items-center gap-3">
      {audio.cover_image ? (
        <Image
          src={audio.cover_image}
          alt=""
          width={40}
          height={40}
          unoptimized
          className="size-10 shrink-0 rounded-md border object-cover"
        />
      ) : (
        <div className="size-10 shrink-0 rounded-md border bg-muted" />
      )}
      <div className="flex min-w-0 flex-col">
        <p className="truncate text-sm font-medium">{audio.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {topicName || t("noTopic")}
        </p>
      </div>
    </div>
  );
}

function PlayAudioLink({ audio }: { audio: AdminAudio }) {
  const t = useTranslations("AudioModeration");

  if (!audio.audio_url) return null;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <a
            href={audio.audio_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("playAudio")}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <Play aria-hidden />
          </a>
        }
      />
      <TooltipContent>{t("playAudio")}</TooltipContent>
    </Tooltip>
  );
}

export function useAudioModerationColumns() {
  const t = useTranslations("AudioModeration");

  const columns: ColumnDef<AdminAudio, unknown>[] = [
    {
      id: "audio",
      header: t("columnAudio"),
      meta: { headerClassName: "min-w-64" },
      cell: ({ row }) => <AudioCell audio={row.original} />,
    },
    {
      id: "author",
      header: t("columnAuthor"),
      meta: { headerClassName: "min-w-52" },
      cell: ({ row }) => <AuthorCell author={row.original.user} />,
    },
    {
      id: "moderationStatus",
      header: t("columnStatus"),
      cell: ({ row }) => {
        const audio = row.original;

        return (
          <div className="flex flex-wrap items-center gap-1.5">
            <span title={audio.moderationReason || undefined}>
              <Badge variant={STATUS_VARIANTS[audio.moderationStatus]}>
                {t(STATUS_LABEL_KEY[audio.moderationStatus])}
              </Badge>
            </span>
            {audio.isBlocked ? (
              <Badge variant="blocked">{t("blockedBadge")}</Badge>
            ) : null}
          </div>
        );
      },
    },
    {
      id: "totalPlay",
      header: t("columnPlays"),
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          {new Intl.NumberFormat("en-US").format(row.original.totalPlay ?? 0)}
        </span>
      ),
    },
    {
      id: "duration",
      header: t("columnDuration"),
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          {formatDuration(row.original.duration)}
        </span>
      ),
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
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <PlayAudioLink audio={row.original} />
          <BlockAudioButton audio={row.original} />
          <DeleteAudioModal audio={row.original} />
        </div>
      ),
    },
  ];

  return columns;
}
