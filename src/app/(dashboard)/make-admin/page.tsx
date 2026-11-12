import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

import { AdminsView } from "./_components";

export default async function MakeAdminPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  // The API scopes every admin endpoint to superAdmin; keep plain admins out
  // of a page that can only render permission errors for them.
  if (session.role !== "superAdmin") redirect("/dashboard");

  return <AdminsView />;
}
