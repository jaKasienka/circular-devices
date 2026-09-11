import { Link } from "react-router-dom";
import FeatureCard from "@/components/home/FeatureCard";

const FEATURE_CARDS = [
  {
    description: "Get Money for your old/ broken Devices",
    iconSrc: "/assets/icon-money.svg",
    imageSrc: "/assets/card-phone.png",
    imageAlt: "Smartphone on a wooden table",
    className: "absolute left-0 top-0 w-[256px]",
    imageClassName: "w-[65px] rounded-xl",
  },
  {
    description: "Certified Data Deletion:\nSecure & Verifiable",
    iconSrc: "/assets/icon-shield.svg",
    imageSrc: "/assets/card-laptop.png",
    imageAlt: "Person working on a laptop",
    className: "absolute left-[76px] top-[73px] w-[255px]",
  },
] as const;

export default function Index() {
  return (
    <div className="flex w-full flex-col items-center gap-6.5 pb-4 pt-8">
      <header className="flex w-full flex-col items-center text-center">
        <h1 className="break-normal font-display text-[32px] leading-none whitespace-nowrap text-white">
          Circular Devices
        </h1>
        <p className="mt-1 break-normal font-heading text-[15px] font-semibold uppercase tracking-[0.6px] whitespace-nowrap text-accent">
          Recycling - Certified Data Deletion
        </p>
      </header>

      <div className="relative h-65.5 w-85.25 max-w-full overflow-hidden">
        <img
          src="/assets/logo.png"
          alt="Circular Devices logo"
          className="absolute left-0 top-[-10%] h-[130%] w-full max-w-none"
        />
      </div>

      <div className="relative h-34.25 w-83 max-w-full">
        {FEATURE_CARDS.map((card) => (
          <FeatureCard key={card.description} {...card} />
        ))}
      </div>

      <p className="min-h-10 w-full px-4 text-center font-sans text-base italic leading-normal tracking-[0.48px] text-muted-foreground">
        Curious? Scan your Device and see how much it&rsquo;s worth!
      </p>

      <div className="flex w-full items-center justify-center gap-4 px-4">
        <Link
          to="/devices"
          className="shrink-0 whitespace-nowrap rounded-full border border-[#004347] bg-secondary px-6 py-4 font-heading text-base font-semibold tracking-[1px] text-secondary-foreground transition hover:opacity-90"
        >
          DEVICES
        </Link>
        <Link
          to="/scan"
          className="flex min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-full bg-primary px-6 py-4 font-heading text-base font-semibold tracking-[1px] text-primary-foreground transition hover:opacity-90"
        >
          SCAN NOW
        </Link>
      </div>
    </div>
  );
}
