import { Link, useParams } from "react-router-dom";
import { CirclePlay, Clock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { MEMORY_DELETION_SERVICE_USD } from "@/lib/devices/constants";
import { DEMO_SCAN_DEVICE } from "@/lib/devices/demo-scan-device";
import { MOCK_DEVICES } from "@/lib/devices/mock-devices";
import { typography } from "@/tokens/design-tokens";

const PAYOUT_ETA_HOURS = 4;

export default function DeviceAuditReview() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const device = MOCK_DEVICES.find((entry) => entry.id === deviceId);
  const deletionOnly = device?.scanEntry === "deletion-only";
  const payoutUsd = device?.quoteUsd ?? DEMO_SCAN_DEVICE.quoteUsd;

  if (!device) {
    return (
      <section className="flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-foreground" style={typography.headlineSmall}>
          Audit not available
        </h1>
        <Button asChild variant="secondary">
          <Link to="/devices">Back to My Devices</Link>
        </Button>
      </section>
    );
  }

  const confirmReview = () => {
    toast.message("Review recorded (demo)", {
      description: deletionOnly
        ? `Certificate and return tracking typically follow within ${PAYOUT_ETA_HOURS} hours.`
        : `Payout and certificate are on their way (typically within ${PAYOUT_ETA_HOURS} hours).`,
    });
  };

  return (
    <section className="flex min-h-full w-full min-w-0 flex-col gap-6 px-4 py-4 tablet:px-8">
      <header className="flex flex-col gap-3">
        <Button asChild variant="ghost" className="w-fit px-0">
          <Link to={`/devices/${device.id}`}>← {device.name}</Link>
        </Button>
        <h1 className="text-foreground" style={typography.headlineSmall}>
          Audit video ready
        </h1>
        <p className="text-muted-foreground" style={typography.bodyMedium}>
          {deletionOnly
            ? "Your erasure certificate and return tracking are processing. Watch the video if you want proof of handling."
            : "Video ready, money on its way! You can audit the certified handling video anytime — payout is not blocked on review."}
        </p>
      </header>

      <div className="relative flex aspect-video max-h-56 items-center justify-center rounded-lg border border-border bg-secondary/50">
        <CirclePlay
          aria-hidden
          className="size-16 text-primary/80"
          strokeWidth={1.25}
        />
        <p
          className="absolute bottom-3 left-3 right-3 text-center text-muted-foreground"
          style={typography.bodySmall}
        >
          Certified handling recording — portfolio placeholder
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-md border border-border bg-secondary/30 px-4 py-3">
        <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="text-foreground" style={typography.status}>
            What happens next
          </p>
          <p className="mt-1 text-muted-foreground" style={typography.bodySmall}>
            {deletionOnly
              ? `Certificate and return tracking typically arrive within ${PAYOUT_ETA_HOURS} hours. Video review is optional.`
              : `PayPal payout and your recycling certificate typically arrive within ${PAYOUT_ETA_HOURS} hours (max), whether or not you watch first.`}
          </p>
        </div>
      </div>

      {deletionOnly ? (
        <div className="rounded-lg border border-border bg-card px-4 py-4">
          <p className="text-foreground" style={typography.status}>
            Erasure service
          </p>
          <p className="mt-1 text-muted-foreground" style={typography.bodyMedium}>
            {MEMORY_DELETION_SERVICE_USD} $ — confirmed at shipment. Certificate
            of secure data removal pending.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-4">
          <p className="text-foreground" style={typography.status}>
            Payout confirmation
          </p>
          <p className="mt-1 text-primary" style={typography.headlineSmall}>
            {payoutUsd} $ via PayPal
          </p>
          <p className="mt-2 text-muted-foreground" style={typography.bodySmall}>
            Status: processing — on its way via PayPal. Allow up to{" "}
            {PAYOUT_ETA_HOURS} hours for payout and certificate delivery.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          className="mobile-action mobile-action-primary h-14 w-full rounded-full"
          style={typography.button}
          onClick={confirmReview}
        >
          I&apos;ve watched the video (optional)
        </Button>
        <Button
          asChild
          variant="secondary"
          className="mobile-action mobile-action-secondary h-14 w-full rounded-full border border-secondary-button-stroke"
          style={typography.button}
        >
          <Link to="/devices">Back to My Devices</Link>
        </Button>
      </div>
    </section>
  );
}
