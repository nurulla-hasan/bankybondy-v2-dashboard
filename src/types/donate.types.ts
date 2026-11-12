import type { PaginationMeta } from "./api.types";

export type DonateStatus = "Paid" | "Unpaid";

/** The full NormalUser profile is populated under `user`. */
export interface DonorUser {
  _id?: string;
  name?: string;
  email?: string;
  profile_image?: string;
  subscriptionType?: "Free" | "Standard" | "Premium";
}

export interface DonationRecord {
  _id: string;
  user?: DonorUser | string | null;
  amount: number;
  status?: DonateStatus;
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DonationsQuery {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface DonationsPage {
  meta: PaginationMeta;
  result: DonationRecord[];
}
