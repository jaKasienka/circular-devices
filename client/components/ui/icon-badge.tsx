import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type IconBadgeVariant = "active" | "emphasis" | "muted" | "default";

/** Matches scan flow phase chips: 36px circle, 20px glyph. */
export const ICON_BADGE_SIZE_CLASS = "size-9";
export const ICON_BADGE_GLYPH_CLASS = "size-5";

const variantClasses: Record<IconBadgeVariant, string> = {
  active: "bg-primary text-primary-foreground",
  emphasis: "bg-primary/20 text-primary",
  muted: "bg-muted text-muted-foreground",
  default: "bg-primary/15 text-primary",
};

type IconBadgeProps = {
  children: ReactNode;
  variant?: IconBadgeVariant;
  className?: string;
};

export default function IconBadge({
  children,
  variant = "default",
  className,
}: IconBadgeProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full [&_svg]:size-5",
        ICON_BADGE_SIZE_CLASS,
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

type MaskedIconProps = {
  src: string;
  className?: string;
};

export function MaskedIcon({ src, className }: MaskedIconProps) {
  return (
    <span
      aria-hidden
      className={cn("block bg-current", ICON_BADGE_GLYPH_CLASS, className)}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
