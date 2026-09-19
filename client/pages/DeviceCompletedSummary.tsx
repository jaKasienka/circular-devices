import { Link, useParams } from "react-router-dom";
import { Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { MOCK_DEVICES } from "@/lib/devices/mock-devices";
import { typography } from "@/tokens/design-tokens";

function demoToast(label: string) {
  toast.message("Portfolio demo", {
    description: `${label} will connect to archived audit assets in a production build.`,
  });
}

export default function DeviceCompletedSummary() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const device = MOCK_DEVICES.find((entry) => entry.id === deviceId);

  if (!device || device.status !== "completed") {
    return (
      <section className="flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-foreground" style={typography.headlineSmall}>
          Summary not available
        </h1>
        <Button asChild variant="secondary">
          <Link to="/devices">Back to All Devices</Link>
        </Button>
      </section>
    );
  }

  const payout = device.completedPayoutUsd ?? device.quoteUsd ?? 0;

  return (
    <section className="flex min-h-full w-full min-w-0 flex-col gap-6 px-4 py-4 tablet:px-8">
      <header className="flex flex-col gap-3">
        <Button asChild variant="ghost" className="w-fit px-0">
          <Link to="/devices">← All Devices</Link>
        </Button>
        <h1 className="text-center text-foreground" style={typography.headlineSmall}>
          Device
        </h1>
      </header>

      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-card-foreground" style={typography.bodyLarge}>
          Status: {device.soldDateLabel ?? "Fully recycled"}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex size-48 items-center justify-center rounded-xl border border-border bg-secondary/30">
          <Smartphone
            aria-hidden
            className="size-32 text-muted-foreground/60"
            strokeWidth={1.1}
          />
        </div>
        <p className="text-foreground" style={typography.headlineSmall}>
          {device.name}
        </p>
        <p className="text-primary" style={typography.bodyLarge}>
          you got {payout} $
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="secondary"
          className="mobile-action mobile-action-secondary h-14 w-full rounded-full border border-secondary-button-stroke"
          style={typography.button}
          onClick={() => demoToast("Material description")}
        >
          Show Material Description
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="mobile-action mobile-action-secondary h-14 w-full rounded-full border border-secondary-button-stroke"
          style={typography.button}
          onClick={() => demoToast("Audit video")}
        >
          Show Video
        </Button>
        <Button
          type="button"
          className="mobile-action mobile-action-primary h-14 w-full rounded-full"
          style={typography.button}
          onClick={() => demoToast("Recycling certificate")}
        >
          Show Certificate
        </Button>
      </div>
    </section>
  );
}
