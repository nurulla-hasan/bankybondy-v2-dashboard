import React from "react";
import { cn } from "@/lib/utils";

interface BrandMarkProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  size?: number;
}

// V1 mark geometry (capsule · dot · bar · dot), painted with the v2 palette:
// cyan glow · primary indigo · emerald accent on a deep indigo capsule.
export function BrandMark({ className, size = 30, ...props }: BrandMarkProps) {
  const isLg = size >= 34;
  const isSm = size < 28;

  return (
    <div
      role="img"
      aria-label="Bankybondy"
      className={cn(
        "flex shrink-0 select-none items-center justify-center font-extrabold tracking-tighter text-primary font-heading",
        isLg && "text-xl",
        !isLg && !isSm && "text-lg",
        isSm && "text-base",
        className,
      )}
      {...props}
    >
      <span className="text-foreground">Banky</span>
      <span className="text-primary">bondy</span>
    </div>
  );
}

export default BrandMark;
