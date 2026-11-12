import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

import { DonorsView } from "./_components";

export default async function DonorsPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  // The API scopes the donor list to admin+.
  if (session.role !== "admin" && session.role !== "superAdmin") {
    redirect("/dashboard");
  }

  return <DonorsView />;
}
