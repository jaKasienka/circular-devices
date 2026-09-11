import { Link } from "react-router-dom";

import FeatureCard from "@/components/home/FeatureCard";
import { Button } from "@/components/ui/button";
import { typography } from "@/tokens/design-tokens";

const FEATURE_CARDS = [
  {
    description: "Get Money for your old/ broken Devices",
    iconSrc: "/assets/icon-money.svg",
    imageSrc: "/assets/card-phone.png",
    imageAlt: "Smartphone on a wooden table",
    className: "absolute top-0 left-0",
  },
  {
    description: "Certified Data\nDeletion: Secure\n& Verifiable",
    iconSrc: "/assets/icon-shield.svg",
    imageSrc: "/assets/card-laptop.png",
    imageAlt: "Person working on a laptop",
    className: "absolute top-22 left-18",
  },
] as const;

export default function Index() {
  return (
    <section
      className="flex h-165 w-full flex-col items-center gap-4"
      aria-labelledby="home-title"
    >
      <header className="flex h-14 w-full flex-col items-center justify-start text-center">
        <h1
          id="home-title"
          className="flex h-8 items-center whitespace-nowrap text-brand-name"
          style={typography.brandName}
        >
          Circular Devices
        </h1>
        <p
          className="mt-4.5 whitespace-nowrap text-accent uppercase"
          style={typography.subtitle}
        >
          RECYCLING - CERTIFIED DATA DELETION
        </p>
      </header>

      <div className="relative h-65.5 w-85.25 max-w-full overflow-hidden">
        <img
          src="/assets/logo.png"
          alt="Circular Devices logo"
          className="absolute top-[-10%] left-0 h-[130%] w-full max-w-none"
          width={341}
          height={340}
        />
      </div>

      <div className="relative h-42 w-86 max-w-full">
        {FEATURE_CARDS.map((card) => (
          <FeatureCard key={card.description} {...card} />
        ))}
      </div>

      <p
        className="flex h-12 w-full items-center justify-center px-4 text-center text-muted-foreground"
        style={typography.bodyLarge}
      >
        Curious? Scan your Device and see how much it&rsquo;s worth!
      </p>

      <div className="flex h-14 w-full items-center gap-4 px-4">
        <Button
          asChild
          variant="secondary"
          className="mobile-action mobile-action-secondary h-14 shrink-0 rounded-full border border-secondary-button-stroke px-6 text-secondary-foreground focus-visible:ring-offset-background"
          style={typography.button}
        >
          <Link to="/devices">DEVICES</Link>
        </Button>
        <Button
          asChild
          className="mobile-action mobile-action-primary h-14 min-w-0 flex-1 rounded-full px-6 focus-visible:ring-offset-background"
          style={typography.button}
        >
          <Link to="/scan">SCAN NOW</Link>
        </Button>
      </div>
    </section>
  );
}
