import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) redirect("/login");

  const t = await getTranslations("Dashboard");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          {t("profileTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("profileSubtitle")}</p>
      </header>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            {session.email}
          </CardTitle>
          <CardDescription>
            <Badge variant="admin">{session.role}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {session.profileId ?? session.id}
        </CardContent>
      </Card>
    </div>
  );
}
