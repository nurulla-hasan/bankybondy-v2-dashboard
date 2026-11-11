import type { PaginationMeta } from "./api.types";

export interface Skill {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillPayload {
  name: string;
}

export interface SkillsQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sort?: string;
}

export interface SkillsPage {
  meta: PaginationMeta;
  result: Skill[];
}
