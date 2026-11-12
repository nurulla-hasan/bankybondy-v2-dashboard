import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

import { HeatMapView } from "./_components";

export default async function HeatMapPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  // The API scopes the geo aggregation to admin+.
  if (session.role !== "admin" && session.role !== "superAdmin") {
    redirect("/dashboard");
  }

  return <HeatMapView />;
}
