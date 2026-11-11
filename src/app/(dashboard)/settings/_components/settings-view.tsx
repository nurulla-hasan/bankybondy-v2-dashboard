"use client";

import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/common/section-heading";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNextFilter } from "@/hooks/useNextFilter";

import { MatchingSection } from "./matching-section";
import { PasswordCard } from "./password-card";
import { ProfileCard } from "./profile-card";

const TABS = [
  { value: "profile", labelKey: "settingsTabProfile" },
  { value: "about", labelKey: "settingsTabAbout" },
  { value: "terms", labelKey: "settingsTabTerms" },
  { value: "privacy", labelKey: "settingsTabPrivacy" },
] as const;

type SettingsTab = (typeof TABS)[number]["value"];

const LEGAL_TABS = TABS.filter((tab) => tab.value !== "profile");

export function SettingsView({ role }: { role: string }) {
  const t = useTranslations("Dashboard");
  const filters = useNextFilter<"tab">();

  const rawTab = filters.getFilter("tab");
  const activeTab: SettingsTab = TABS.some((tab) => tab.value === rawTab)
    ? (rawTab as SettingsTab)
    : "profile";

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h3"
        alignment="left"
        constrain={false}
        title={t("settingsTitle")}
        description={t("settingsSubtitle")}
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          // Keep the default tab out of the URL so /settings stays clean.
          filters.updateFilter("tab", value === "profile" ? null : value, {
            resetPage: false,
          });
        }}
      >
        <TabsList variant="line" className="mb-2">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {t(tab.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <div className="flex flex-col gap-6">
            <ProfileCard role={role} />
            <PasswordCard />
            <MatchingSection role={role} />
          </div>
        </TabsContent>

        {LEGAL_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle>{t(tab.labelKey)}</CardTitle>
                <CardDescription>{t("comingSoonBody")}</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
