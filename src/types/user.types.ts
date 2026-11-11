import type { PaginationMeta } from "./api.types";

export type SubscriptionPlan = "Free" | "Standard" | "Premium";

export interface UserReputation {
  avg: number;
  count: number;
  score: number;
}

export interface UserSkill {
  _id: string;
  name: string;
}

/** Account link populated by the admin list (`select: 'isBlocked'`). */
export interface AdminUserAccount {
  _id: string;
  isBlocked: boolean;
}

/**
 * A member row from `GET /normal-user/get-all-user` (admin branch). `location`
 * is stripped server-side; `skills` are ids in the list and resolved objects in
 * the single-user response.
 */
export interface AdminUser {
  _id: string;
  user: AdminUserAccount | string;
  name: string;
  email: string;
  phone?: string;
  profile_image?: string;
  cover_image?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  bio?: string;
  skills?: Array<UserSkill | string>;
  socialLinks?: string[];
  subscriptionType: SubscriptionPlan;
  bondLimit: number;
  reputation?: UserReputation;
  hasActiveBonds?: boolean;
  bondsPublic?: boolean;
  listedInPeople?: boolean;
  digestOptOut?: boolean;
  mutedNotificationCategories?: string[];
  subscriptionSetAt?: string;
  subscriptionSetReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersPage {
  meta: PaginationMeta;
  result: AdminUser[];
}

export interface UsersQuery {
  page: number;
  limit: number;
  searchTerm?: string;
  subscriptionType?: SubscriptionPlan;
  sort?: string;
}

export interface SetUserPlanPayload {
  type: SubscriptionPlan;
  reason?: string;
}
