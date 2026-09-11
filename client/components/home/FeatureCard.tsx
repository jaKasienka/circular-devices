import { cn } from "@/lib/utils";

type FeatureCardProps = {
  iconSrc: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  className?: string;
  imageClassName?: string;
};

export default function FeatureCard({
  iconSrc,
  imageSrc,
  imageAlt,
  description,
  className,
  imageClassName,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex items-center overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center gap-3.25 py-3 pr-5 pl-1.25">
        <div className="relative h-10 w-11.25 shrink-0 overflow-clip">
          <img src={iconSrc} alt="" className="size-full" />
        </div>
        <p className="w-27 whitespace-pre-line font-sans text-[11px] leading-3.25 font-normal tracking-[0.22px] text-muted-foreground">
          {description}
        </p>
      </div>
      <div
        className={cn(
          "relative h-16 w-16 shrink-0 self-stretch overflow-hidden",
          imageClassName,
        )}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="size-full object-cover object-bottom"
        />
      </div>
    </div>
  );
}
