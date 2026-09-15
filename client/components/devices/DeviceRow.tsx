import { Bell, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import DeviceStatusIcon from "@/components/devices/DeviceStatusIcon";
import type { DeviceRecord } from "@/lib/devices/types";
import { typography } from "@/tokens/design-tokens";

type DeviceRowProps = {
  device: DeviceRecord;
};

function formatUsd(amount: number): string {
  return `${amount} $`;
}

export default function DeviceRow({ device }: DeviceRowProps) {
  const showBell =
    device.daysRemaining !== undefined ||
    ["scanned", "ready_shipment", "audit"].includes(device.status);

  return (
    <li className="list-none">
      <div className="flex h-12 w-full min-w-0 items-center gap-2 rounded-full border border-border bg-card px-1">
        <div className="flex size-12 shrink-0 items-center justify-center">
          <DeviceStatusIcon status={device.status} />
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className="shrink-0 capitalize text-card-foreground"
            style={typography.bodyMedium}
          >
            {device.name}
          </span>

          {device.quoteUsd !== undefined && device.showPricePill ? (
            <span
              className="shrink-0 rounded-full bg-secondary px-2 py-1 text-secondary-foreground"
              style={typography.bodyMedium}
            >
              {formatUsd(device.quoteUsd)}
            </span>
          ) : null}

          {device.quoteUsd !== undefined && !device.showPricePill ? (
            <div className="flex min-w-0 flex-col">
              <span className="text-card-foreground" style={typography.bodyMedium}>
                {formatUsd(device.quoteUsd)}
              </span>
              {device.adjustmentUsd !== undefined ? (
                <span className="text-card-foreground" style={typography.bodyMedium}>
                  {formatUsd(device.adjustmentUsd)}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1 pr-1">
          {showBell ? (
            <div className="relative flex size-12 flex-col items-center justify-center">
              <Bell
                aria-hidden
                className="size-5 text-muted-foreground"
                strokeWidth={2}
              />
              {device.daysRemaining !== undefined ? (
                <span
                  className="mt-0.5 text-center text-muted-foreground"
                  style={typography.bodySmall}
                >
                  {device.daysRemaining} days left
                </span>
              ) : null}
            </div>
          ) : null}

          <Link
            to={`/devices/${device.id}`}
            className="mobile-action mobile-action-primary flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Open ${device.name} details`}
          >
            <ChevronRight aria-hidden className="size-5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </li>
  );
}
