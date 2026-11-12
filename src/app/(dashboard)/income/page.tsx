import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

import { IncomeView } from "./_components";

export default async function IncomePage() {
  const session = await getSession();

  if (!session) redirect("/login");

  // The API scopes transaction endpoints to admin+.
  if (session.role !== "admin" && session.role !== "superAdmin") {
    redirect("/dashboard");
  }

  return <IncomeView />;
}
