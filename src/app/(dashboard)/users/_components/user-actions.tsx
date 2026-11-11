"use client";

import type { AdminUser } from "@/types";

import { BlockUserModal } from "./block-user-modal";
import { ChangePlanModal } from "./change-plan-modal";
import { UserDetailsModal } from "./user-details-modal";
import { getUserAccount } from "./user-account";

export function UserActions({
  user,
  canManage,
}: {
  user: AdminUser;
  canManage: boolean;
}) {
  const account = getUserAccount(user);

  return (
    <div className="flex items-center justify-end gap-1">
      <UserDetailsModal user={user} />
      {canManage && <ChangePlanModal user={user} />}
      {canManage && account && (
        <BlockUserModal user={user} account={account} />
      )}
    </div>
  );
}
