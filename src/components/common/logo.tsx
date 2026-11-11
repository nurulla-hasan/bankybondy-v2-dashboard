import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-logo";

export function Logo({
  className,
  size = "md",
  showText = true,
  showTextOnMobile = true,
  href = "/",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showTextOnMobile?: boolean;
  href?: string;
}) {
  const svgSize = size === "lg" ? 36 : size === "md" ? 30 : 24;
  const t = useTranslations("Common");

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-90",
        className
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-black shadow-sm">
        B
      </div>

      <span
        className={cn(
          "font-extrabold tracking-tight font-heading text-foreground truncate group-data-[collapsible=icon]:hidden",
          size === "lg" && "text-2xl tracking-tighter",
          size === "md" && "text-xl tracking-tight",
          size === "sm" && "text-base"
        )}
      >
        Banky<span className="text-primary">bondy</span>
      </span>
    </Link>
  );
}


