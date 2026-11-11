import type { AdminUser, AdminUserAccount } from "@/types";

/** The `user` relation can be an id string when it is not populated. */
export function getUserAccount(user: AdminUser): AdminUserAccount | null {
  return typeof user.user === "string" ? null : user.user;
}
