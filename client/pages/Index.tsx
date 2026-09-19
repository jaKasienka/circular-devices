import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { CircleDollarSign, ShieldCheck } from "lucide-react";

import FeatureCard from "@/components/home/FeatureCard";
import { Button } from "@/components/ui/button";
import { typography } from "@/tokens/design-tokens";

const FEATURE_CARDS = [
  {
    description: "Get Money for your old/ broken Devices",
    icon: CircleDollarSign,
    imageSrc: "/assets/card-phone.png",
    imageAlt: "Smartphone on a wooden table",
    align: "start",
  },
  {
    description: "Certified Data Deletion: Secure & Verifiable",
    icon: ShieldCheck,
    imageSrc: "/assets/card-laptop.png",
    imageAlt: "Person working on a laptop",
    align: "end",
  },
] as const;

function fluidType(
  style: CSSProperties,
  minPx: number,
  vw: number,
): CSSProperties {
  return {
    ...style,
    fontSize: `clamp(${minPx}px, ${vw}vw, ${style.fontSize})`,
  };
}

export default function Index() {
  return (
    <section
      className="flex min-h-full w-full min-w-0 flex-col items-center gap-3 sm:gap-4 tablet:gap-5 tall:gap-6"
      aria-labelledby="home-title"
    >
      <header className="flex w-full shrink-0 flex-col items-center px-3 text-center sm:px-4 tablet:px-8">
        <h1
          id="home-title"
          className="max-w-full text-balance text-brand-name"
          style={fluidType(typography.brandName, 22, 8)}
        >
          Circular Devices
        </h1>
        <p
          className="mt-2 max-w-full text-pretty wrap-break-word text-accent uppercase"
          style={fluidType(typography.subtitle, 12, 4)}
        >
          RECYCLING - CERTIFIED DATA DELETION
        </p>
      </header>

      <div className="flex min-h-0 w-full min-w-0 max-w-80 flex-1 items-start justify-center tablet:max-w-96 tall:max-w-[min(100%,32rem)]">
        <img
          src="/assets/logo.png"
          alt="Circular Devices logo"
          className="max-h-full w-auto max-w-full object-contain object-top"
          width={341}
          height={340}
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />
      </div>

      <div className="flex w-full min-w-0 shrink-0 flex-col gap-2 px-3 sm:px-4 tablet:gap-3 tablet:px-8 tall:min-h-0 tall:flex-1 tall:justify-center tall:gap-4">
        {FEATURE_CARDS.map((card) => (
          <FeatureCard
            key={card.description}
            icon={card.icon}
            imageSrc={card.imageSrc}
            imageAlt={card.imageAlt}
            description={card.description}
            className={
              card.align === "end"
                ? "w-[min(100%,17rem)] self-end tablet:w-[min(100%,28rem)] tablet:mr-[10%] tall:w-[min(100%,38rem)]"
                : "w-[min(100%,17rem)] self-start tablet:w-[min(100%,28rem)] tablet:ml-[10%] tall:w-[min(100%,38rem)]"
            }
          />
        ))}
      </div>

      <p
        className="flex w-full shrink-0 items-center justify-center px-3 text-center text-pretty text-muted-foreground sm:px-4 tablet:px-8"
        style={fluidType(typography.bodyLarge, 14, 4.2)}
      >
        Curious? Scan your Device and see how much it&rsquo;s worth!
      </p>

      <div className="flex min-h-14 w-full shrink-0 items-stretch gap-3 px-3 sm:gap-4 sm:px-4 tablet:px-8">
        <Button
          asChild
          variant="secondary"
          className="mobile-action mobile-action-secondary h-14 shrink-0 rounded-full border border-secondary-button-stroke px-4 text-secondary-foreground focus-visible:ring-offset-background sm:px-6"
          style={fluidType(typography.button, 14, 4)}
        >
          <Link to="/devices">DEVICES</Link>
        </Button>
        <Button
          asChild
          className="mobile-action mobile-action-primary h-14 min-w-0 flex-1 rounded-full px-4 focus-visible:ring-offset-background sm:px-6"
          style={fluidType(typography.button, 14, 4)}
        >
          <Link to="/scan">SCAN NOW</Link>
        </Button>
      </div>
      <div className="h-8 w-full shrink-0" aria-hidden />
    </section>
  );
}
