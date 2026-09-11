import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { typography } from "@/tokens/design-tokens";

type FeatureCardProps = {
  iconSrc: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  className?: string;
};

export default function FeatureCard({
  iconSrc,
  imageSrc,
  imageAlt,
  description,
  className,
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "flex h-20 w-68 items-center overflow-hidden rounded-lg shadow-none",
        className,
      )}
    >
      <div className="flex h-full w-48 items-center gap-2 py-3 pr-4 pl-2">
        <img
          src={iconSrc}
          alt=""
          className="h-10 w-11.25 shrink-0"
          width={45}
          height={40}
        />
        <p
          className="flex-1 whitespace-pre-line text-card-foreground"
          style={typography.bodySmall}
        >
          {description}
        </p>
      </div>
      <img
        src={imageSrc}
        alt={imageAlt}
        className="h-full w-20 shrink-0 object-cover object-bottom"
        width={80}
        height={80}
      />
    </Card>
  );
}
