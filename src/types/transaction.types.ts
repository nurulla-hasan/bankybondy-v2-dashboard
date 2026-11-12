import type { PaginationMeta } from "./api.types";

export type TransactionType = "Donation" | "Subscription";
export type TransactionCurrency = "USD" | "ARS";
export type TransactionPlan = "Standard" | "Premium";

/** Only `profile_image` and `name` are populated by the API. */
export interface TransactionUser {
  _id?: string;
  name?: string;
  profile_image?: string;
}

export interface TransactionRecord {
  _id: string;
  user?: TransactionUser | string | null;
  type: TransactionType;
  amount: number;
  currency?: TransactionCurrency;
  /** Only set when `type` is `Subscription`. */
  plan?: TransactionPlan;
  transactionId?: string;
  applied?: boolean;
  /** Charged but the plan could not be granted — money to refund manually. */
  refundPending?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionsQuery {
  page?: number;
  limit?: number;
  type?: TransactionType;
  plan?: TransactionPlan;
  currency?: TransactionCurrency;
  sort?: string;
}

export interface TransactionsPage {
  meta: PaginationMeta;
  result: TransactionRecord[];
}
