"use client";

import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/common/section-heading";

import { MatchingSection } from "./matching-section";
import { PasswordCard } from "./password-card";
import { ProfileCard } from "./profile-card";

export function SettingsView({ role }: { role: string }) {
  const t = useTranslations("Dashboard");

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h3"
        alignment="left"
        constrain={false}
        title={t("settingsTitle")}
        description={t("settingsSubtitle")}
      />

      <ProfileCard role={role} />
      <PasswordCard />
      <MatchingSection role={role} />
    </div>
  );
}
