import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import type { ProfileMenuVariant } from "@/lib/profile/menu-items";
import { typography } from "@/tokens/design-tokens";

type ProfileMenuRowProps = {
  label: string;
  icon: LucideIcon;
  variant: ProfileMenuVariant;
  to?: string;
  onClick?: () => void;
  trailing?: string;
};

export default function ProfileMenuRow({
  label,
  icon: Icon,
  variant,
  to,
  onClick,
  trailing,
}: ProfileMenuRowProps) {
  const className = cn(
    "mobile-action flex h-14 w-full items-center gap-3 rounded-full px-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    variant === "filled"
      ? "mobile-action-secondary border border-secondary-button-stroke bg-secondary text-secondary-foreground"
      : "border-2 border-foreground bg-transparent text-foreground",
  );

  const content = (
    <>
      <Icon aria-hidden className="size-6 shrink-0" strokeWidth={2} />
      <span className="min-w-0 flex-1 text-pretty" style={typography.bodyLarge}>
        {label}
      </span>
      {trailing ? (
        <span className="shrink-0 text-muted-foreground" style={typography.bodySmall}>
          {trailing}
        </span>
      ) : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}
