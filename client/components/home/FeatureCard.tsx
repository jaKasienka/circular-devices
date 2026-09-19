import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";

import IconBadge from "@/components/ui/icon-badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { typography } from "@/tokens/design-tokens";

type FeatureCardProps = {
  icon: LucideIcon;
  imageSrc: string;
  imageAlt: string;
  description: string;
  className?: string;
};

const cardCopyStyle: CSSProperties = {
  fontFamily: typography.bodySmall.fontFamily,
  fontWeight: typography.bodySmall.fontWeight,
  letterSpacing: typography.bodySmall.letterSpacing,
};

/** Figma Cards (991:2014): radius-m is 12px on a 64px-tall card; scale with height. */
const cardShellClass =
  "flex h-16 min-h-16 w-full min-w-0 items-center overflow-hidden rounded-lg shadow-none [@media(max-height:640px)]:h-14 [@media(max-height:640px)]:min-h-14 [@media(max-height:640px)]:rounded-[length:calc(var(--radius-medium)*0.875)] min-[400px]:h-20 min-[400px]:min-h-20 min-[400px]:rounded-[length:calc(var(--radius-medium)*1.25)] tall:h-[clamp(7rem,12vh,9rem)] tall:!h-[clamp(7rem,12vh,9rem)] tall:min-h-28 tall:rounded-[length:calc(var(--radius-medium)/4rem*clamp(7rem,12vh,9rem))]";

const cardImageClass =
  "h-full w-auto shrink-0 aspect-square rounded-r-lg object-cover object-bottom [@media(max-height:640px)]:rounded-r-[length:calc(var(--radius-medium)*0.875)] min-[400px]:rounded-r-[length:calc(var(--radius-medium)*1.25)] tall:rounded-r-[length:calc(var(--radius-medium)/4rem*clamp(7rem,12vh,9rem))]";

export default function FeatureCard({
  icon: Icon,
  imageSrc,
  imageAlt,
  description,
  className,
}: FeatureCardProps) {
  return (
    <Card className={cn(cardShellClass, className)}>
      <div className="flex h-full min-w-0 flex-1 items-center gap-2.5 py-2 pr-3 pl-2 min-[400px]:gap-3 min-[400px]:py-3 min-[400px]:pr-4 tall:gap-3 tall:pr-5 tall:pl-3">
        <IconBadge variant="emphasis">
          <Icon aria-hidden strokeWidth={2} />
        </IconBadge>
        <p
          className="min-w-0 flex-1 text-pretty wrap-break-word text-[clamp(11px,3.2vw,12px)] leading-[1.35] text-card-foreground tablet:text-[14px] tablet:leading-[22px] tall:text-[14px] tall:leading-[22px]"
          style={cardCopyStyle}
        >
          {description}
        </p>
      </div>
      <img
        src={imageSrc}
        alt={imageAlt}
        className={cardImageClass}
        width={80}
        height={80}
      />
    </Card>
  );
}
