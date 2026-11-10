import { getTranslations } from "next-intl/server";
import { LayoutDashboard, ShieldCheck, Sparkles, Wallet } from "lucide-react";

import { Logo } from "@/components/common/logo";
import { LanguageToggle } from "@/components/common/language-toggle";
import { ThemeToggle } from "@/components/common/theme-toggle";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Auth");
  const common = await getTranslations("Common");

  return (
    <div className="grid min-h-svh w-full overflow-hidden bg-background lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-muted/30 p-12 lg:flex">
        <div className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 -bottom-40 size-96 rounded-full bg-cyan-glow/15 blur-3xl" />

        <div className="relative z-10">
          <Logo size="lg" showText href="/login" />
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <LayoutDashboard className="size-3.5" aria-hidden />
            {t("adminPill")}
          </div>

          <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight text-foreground xl:text-4xl">
            {t("adminHeroTitle")}
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("adminHeroSubtitle")}
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="rounded-lg border border-border bg-background p-1.5 text-primary shadow-xs">
                <Sparkles className="size-4" aria-hidden />
              </div>
              <span>{t("adminFeature1")}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="rounded-lg border border-border bg-background p-1.5 text-emerald-accent shadow-xs">
                <Wallet className="size-4" aria-hidden />
              </div>
              <span>{t("adminFeature2")}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="rounded-lg border border-border bg-background p-1.5 text-cyan-glow shadow-xs">
                <ShieldCheck className="size-4" aria-hidden />
              </div>
              <span>{t("adminFeature3")}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
          <span>&ldquo;{t("authTagline")}&rdquo;</span>
          <span>{common("brandTagline")}</span>
        </div>
      </aside>

      <div className="relative flex min-h-svh flex-col items-center justify-center p-6 sm:p-10">
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <div className="mb-8 lg:hidden">
          <Logo size="md" showText href="/login" />
        </div>

        <div className="w-full max-w-md animate-in fade-in-50 duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}
