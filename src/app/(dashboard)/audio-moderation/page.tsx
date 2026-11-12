import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

import { AudioModerationView } from "./_components";

export default async function AudioModerationPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  // The API scopes the admin audio endpoints to admin+.
  if (session.role !== "admin" && session.role !== "superAdmin") {
    redirect("/dashboard");
  }

  return <AudioModerationView />;
}
