import { redirect } from "next/navigation";

import { getLegalDocuments } from "@/lib/legal";
import { getSession } from "@/lib/session";

import { SettingsView } from "./_components";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  const legalDocuments = await getLegalDocuments();

  return <SettingsView role={session.role} legalDocuments={legalDocuments} />;
}
