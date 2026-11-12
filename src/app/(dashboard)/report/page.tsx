import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

import { ReportsView } from "./_components";

export default async function ReportPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  // The API scopes report endpoints to admin+; users never see this page.
  if (session.role !== "admin" && session.role !== "superAdmin") {
    redirect("/dashboard");
  }

  return <ReportsView />;
}
