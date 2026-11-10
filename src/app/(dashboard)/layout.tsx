import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { isAdminRole } from "@/constants";
import { DashboardShell } from "@/layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Defense in depth: the proxy already gates these routes.
  if (!session || !isAdminRole(session.role)) {
    redirect("/login");
  }

  return <DashboardShell user={session}>{children}</DashboardShell>;
}
