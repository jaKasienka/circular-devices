import { Link, useParams } from "react-router-dom";

import DeviceStatusIcon from "@/components/devices/DeviceStatusIcon";
import { Button } from "@/components/ui/button";
import {
  DEVICE_STATUS_LEGEND,
  MOCK_DEVICES,
} from "@/lib/devices/mock-devices";
import { typography } from "@/tokens/design-tokens";

export default function DeviceDetail() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const device = MOCK_DEVICES.find((entry) => entry.id === deviceId);
  const statusLabel = DEVICE_STATUS_LEGEND.find(
    (entry) => entry.status === device?.status,
  )?.label;

  if (!device) {
    return (
      <section className="flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-foreground" style={typography.headlineSmall}>
          Device not found
        </h1>
        <Button asChild variant="secondary">
          <Link to="/devices">Back to My Devices</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="flex min-h-full w-full min-w-0 flex-col gap-6 px-4 py-4 tablet:px-8">
      <header className="flex flex-col gap-3">
        <Button asChild variant="ghost" className="w-fit px-0">
          <Link to="/devices">← All Devices</Link>
        </Button>
        <div className="flex items-center gap-3">
          <DeviceStatusIcon status={device.status} className="size-8" />
          <h1
            className="capitalize text-foreground"
            style={typography.headlineSmall}
          >
            {device.name}
          </h1>
        </div>
      </header>

      <div className="rounded-lg border border-border bg-card p-4">
        {device.quoteUsd !== undefined ? (
          <p className="text-card-foreground" style={typography.bodyLarge}>
            Quote: {device.quoteUsd} $
          </p>
        ) : null}
        {device.adjustmentUsd !== undefined ? (
          <p className="text-card-foreground" style={typography.bodyMedium}>
            Adjustment: {device.adjustmentUsd} $
          </p>
        ) : null}
        {device.daysRemaining !== undefined ? (
          <p className="text-muted-foreground" style={typography.bodyMedium}>
            {device.daysRemaining} days left
          </p>
        ) : null}
        {statusLabel ? (
          <p className="mt-3 text-muted-foreground" style={typography.bodySmall}>
            {statusLabel}
          </p>
        ) : null}
      </div>

      <p className="text-muted-foreground" style={typography.bodyMedium}>
        Device detail flow will connect to the Scan wizard steps in a later
        pass. This screen preserves navigation from the lo-fi prototype.
      </p>

      {["scanned", "ready_shipment", "audit"].includes(device.status) ? (
        <Button asChild className="mobile-action mobile-action-primary h-14 rounded-full">
          <Link to="/scan">Continue scan flow</Link>
        </Button>
      ) : null}
    </section>
  );
}
