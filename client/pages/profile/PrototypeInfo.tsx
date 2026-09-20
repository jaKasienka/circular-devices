import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { typography } from "@/tokens/design-tokens";

export default function PrototypeInfo() {
  return (
    <section className="flex min-h-full w-full min-w-0 flex-col gap-6 px-4 py-4 tablet:px-8">
      <header className="flex flex-col gap-3">
        <Button asChild variant="ghost" className="w-fit px-0">
          <Link to="/profile">← Profile</Link>
        </Button>
        <h1 className="text-foreground" style={typography.headlineSmall}>
          Prototype & case study
        </h1>
      </header>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
        <p className="text-card-foreground" style={typography.bodyMedium}>
          Circular Devices is a mobile-first UX prototype for hardware
          lifecycle diagnostics and certified recycling or data erasure. This
          public build uses simulated scans, carriers, and payouts.
        </p>
        <p className="text-muted-foreground" style={typography.bodySmall}>
          No personal data is collected in this demo. Images, quotes, and device
          names are fixtures. Payment and logistics consent copy illustrates
          intended production flows only.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-secondary/20 p-4">
        <h2 className="text-foreground" style={typography.status}>
          Case study highlights
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground" style={typography.bodySmall}>
          <li>
            Dual post-scan path: recycle for payout vs emphasized certified
            erase ({`$25`} service, device return) — erase is a full-width
            secondary-style control on the scan result screen.
          </li>
          <li>
            Five mock rows: Galaxy S21 (audit wait), iPhone 13 mini (seal
            arrived → ship), Pixel 8 (deletion-only scan), Motorola Edge 40
            (seal delivery wait), iPhone XR (completed summary). Chevron
            resumes each story; Home “Scan now” starts a fresh Galaxy S21 run
            via <code className="text-foreground">fresh=1</code>.
          </li>
          <li>
            Seal order: address → review → place order. Shipment: configure +
            consents → review overview → generate label → QR drop-off → carrier
            pickup confirmation.
          </li>
          <li>
            Simulated seal delivery and carrier pickup use short delays (~3–5s)
            for live demos. Refresh the page to restore the default device list
            script; closing the scan with ✕ saves progress until you reload.
          </li>
          <li>Brandcyan design tokens, 375px-first layout, WCAG-oriented patterns.</li>
        </ul>
      </div>
    </section>
  );
}
