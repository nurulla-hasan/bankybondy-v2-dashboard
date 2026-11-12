import type { PaginationMeta } from "./api.types";

export interface AdminMember {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profile_image?: string;
  user?: { _id?: string; isBlocked?: boolean } | string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface UpdateAdminPayload {
  name: string;
  phoneNumber?: string;
  /** Omit to keep the current password. */
  password?: string;
}

export interface AdminsQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sort?: string;
}

export interface AdminsPage {
  meta: PaginationMeta;
  result: AdminMember[];
}
