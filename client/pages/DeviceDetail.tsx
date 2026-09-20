import { Link, Navigate, useParams } from "react-router-dom";

import DeviceStatusIcon from "@/components/devices/DeviceStatusIcon";
import { MEMORY_DELETION_SERVICE_USD } from "@/lib/devices/constants";
import {
  deviceAuditPath,
  deviceCompletedPath,
  deviceContinuePath,
  deviceScanPath,
  isInProgressDevice,
} from "@/lib/devices/device-navigation";
import {
  DEVICE_STATUS_LEGEND,
  MOCK_DEVICES,
} from "@/lib/devices/mock-devices";
import { Button } from "@/components/ui/button";
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

  if (device.status === "completed") {
    return <Navigate to={deviceCompletedPath(device.id)} replace />;
  }

  const continuePath = deviceContinuePath(device);
  const auditPath = deviceAuditPath(device.id);
  const deletionOnly = device.scanEntry === "deletion-only";
  const isAuditStatus = device.status === "audit";

  return (
    <section className="flex min-h-full w-full min-w-0 flex-col gap-6 px-4 py-4 tablet:px-8">
      <header className="flex flex-col gap-3">
        <Button asChild variant="ghost" className="w-fit px-0">
          <Link to="/devices">← All Devices</Link>
        </Button>
        <div className="flex items-center gap-3">
          <DeviceStatusIcon status={device.status} className="size-8" />
          <h1 className="min-w-0 text-foreground" style={typography.headlineSmall}>
            {device.name}
          </h1>
        </div>
      </header>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
        {statusLabel ? (
          <p className="text-pretty text-card-foreground" style={typography.bodyMedium}>
            {statusLabel}
          </p>
        ) : null}

        {deletionOnly ? (
          <p className="text-muted-foreground" style={typography.bodySmall}>
            Premium condition — recycling is not offered. Continue with certified
            data erasure ({MEMORY_DELETION_SERVICE_USD} $ service) and device
            return after audit.
          </p>
        ) : null}

        {device.quoteUsd !== undefined ? (
          <p className="text-card-foreground" style={typography.bodyLarge}>
            {deletionOnly
              ? `Appraised value: ${device.quoteUsd} $`
              : `Quote: ${device.quoteUsd} $`}
          </p>
        ) : null}
        {deletionOnly ? (
          <p className="text-muted-foreground" style={typography.bodyMedium}>
            Erasure service: {MEMORY_DELETION_SERVICE_USD} $ (not a recycle
            payout)
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

        {isAuditStatus && !deletionOnly ? (
          <p className="text-muted-foreground" style={typography.bodySmall}>
            Video ready — your {device.quoteUsd ?? 0} $ PayPal payout is on the
            way (typically within 4 hours). Watch the audit video anytime; review
            is optional, not required to get paid.
          </p>
        ) : null}
      </div>

      {isAuditStatus ? (
        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="mobile-action mobile-action-primary h-14 rounded-full"
            style={typography.button}
          >
            <Link to={auditPath}>Watch audit video (optional)</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="mobile-action mobile-action-secondary h-14 rounded-full border border-secondary-button-stroke"
            style={typography.button}
          >
            <Link to={deviceScanPath(device.id)}>Open full scan timeline</Link>
          </Button>
        </div>
      ) : isInProgressDevice(device) ? (
        <Button
          asChild
          className="mobile-action mobile-action-primary h-14 rounded-full"
          style={typography.button}
        >
          <Link to={continuePath}>Continue in scan flow</Link>
        </Button>
      ) : null}
    </section>
  );
}
