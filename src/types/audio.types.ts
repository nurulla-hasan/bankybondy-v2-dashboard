import type { PaginationMeta } from "./api.types";

export type AudioModerationStatus =
  | "processing"
  | "ready"
  | "rejected"
  | "failed";

export interface AudioTopicRef {
  _id?: string;
  name?: string;
}

/** Populated `name email profile_image` subset of NormalUser. */
export interface AudioAuthor {
  _id?: string;
  name?: string;
  email?: string;
  profile_image?: string;
}

export interface AdminAudio {
  _id: string;
  title: string;
  description?: string;
  /** Signed CDN URL on list responses. */
  audio_url?: string;
  /** Signed CDN URL on list responses. */
  cover_image?: string;
  tags?: string[];
  duration?: number;
  totalPlay?: number;
  totalRating?: number;
  ratingCount?: number;
  isBlocked?: boolean;
  moderationStatus: AudioModerationStatus;
  moderationReason?: string;
  moderationAttempts?: number;
  audioTopic?: AudioTopicRef | string | null;
  user?: AudioAuthor | string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminAudiosQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  moderationStatus?: AudioModerationStatus;
  isBlocked?: boolean;
  sort?: string;
}

export interface AdminAudiosPage {
  meta: PaginationMeta;
  result: AdminAudio[];
}
