import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

import { TopicsView } from "./_components";

export default async function AudioTopicPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  return <TopicsView />;
}
