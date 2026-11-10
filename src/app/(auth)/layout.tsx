import { Logo } from "@/components/common/logo";
import { LanguageToggle } from "@/components/common/language-toggle";
import { ThemeToggle } from "@/components/common/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-8 bg-muted/30 px-4 py-10">
      <div className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-cyan-glow/10 blur-3xl" />

      <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="relative z-10">
        <Logo size="lg" showText href="/dashboard" />
      </div>

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
