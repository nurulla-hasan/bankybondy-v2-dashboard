"use client";

import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/common/section-heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNextFilter } from "@/hooks/useNextFilter";
import type { LegalDocumentKind, LegalDocuments } from "@/types";

import { LegalDocumentCard } from "./legal-document";
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

const LEGAL_TABS = [
  { value: "about", labelKey: "settingsTabAbout" },
  { value: "terms", labelKey: "settingsTabTerms" },
  { value: "privacy", labelKey: "settingsTabPrivacy" },
] as const;

/** About us is open to admins; the legal policies are super-admin only. */
function canEditLegal(kind: LegalDocumentKind, role: string) {
  return kind === "about"
    ? role === "admin" || role === "superAdmin"
    : role === "superAdmin";
}

export function SettingsView({
  role,
  legalDocuments,
}: {
  role: string;
  legalDocuments: LegalDocuments;
}) {
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
        <ScrollArea className="w-full overflow-x-auto">
          <TabsList variant="line" className="mb-2">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {t(tab.labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        <TabsContent value="profile">
          <div className="flex flex-col gap-6">
            <ProfileCard role={role} />
            <PasswordCard />
            <MatchingSection role={role} />
          </div>
        </TabsContent>

        {LEGAL_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <LegalDocumentCard
              kind={tab.value}
              title={t(tab.labelKey)}
              content={legalDocuments[tab.value]}
              canEdit={canEditLegal(tab.value, role)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
