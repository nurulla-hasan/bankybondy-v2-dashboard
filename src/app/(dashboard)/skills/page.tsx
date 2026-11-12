import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

import { SkillsView } from "./_components";

export default async function SkillsPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  return <SkillsView />;
}
