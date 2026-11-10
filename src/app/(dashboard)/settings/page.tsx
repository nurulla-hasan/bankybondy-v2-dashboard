import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

import { SettingsView } from "./_components";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  return <SettingsView role={session.role} />;
}
