import type { PaginationMeta } from "./api.types";

export interface Topic {
  _id: string;
  name: string;
  topic_image: string;
  /** Approved audios attached to this topic (aggregated by the API). */
  totalAudios?: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTopicPayload {
  name: string;
  image: File;
}

export interface UpdateTopicPayload {
  name: string;
  image?: File | null;
}

export interface TopicsQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export interface TopicsPage {
  meta: PaginationMeta;
  result: Topic[];
}
