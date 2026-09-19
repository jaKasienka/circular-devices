import { Bell, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import DeviceStatusIcon from "@/components/devices/DeviceStatusIcon";
import {
  deviceContinuePath,
  deviceDetailPath,
  isActionRequiredDevice,
} from "@/lib/devices/device-navigation";
import {
  DEVICE_ROW_GRID_TEMPLATE,
  DEVICE_ROW_SURFACE_CLASS,
} from "@/lib/devices/device-row-layout";
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
    device.daysRemaining !== undefined || isActionRequiredDevice(device);

  const hasQuote = device.quoteUsd !== undefined;
  const hasAdjustment = device.adjustmentUsd !== undefined;
  const detailPath = deviceDetailPath(device);
  const continuePath = deviceContinuePath(device);
  const actionRequired = isActionRequiredDevice(device);

  return (
    <li
      className={`list-none ${DEVICE_ROW_GRID_TEMPLATE} ${DEVICE_ROW_SURFACE_CLASS}`}
    >
      <Link
        to={detailPath}
        className="col-span-4 grid grid-cols-subgrid items-stretch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        aria-label={`View ${device.name} status and details`}
      >
        <div className="flex items-center justify-center self-stretch pl-0.5">
          <DeviceStatusIcon status={device.status} className="size-6" />
        </div>

        <div className="flex min-w-0 items-center justify-start self-stretch pr-1">
          <p
            className="line-clamp-2 min-w-0 text-pretty text-left text-card-foreground"
            style={typography.bodyMedium}
          >
            {device.name}
          </p>
        </div>

        <div className="flex items-center justify-center self-stretch px-0.5">
          {hasQuote ? (
            <div className="flex flex-col items-end justify-center gap-0.5">
              {device.showPricePill ? (
                <span
                  className="whitespace-nowrap rounded-full bg-secondary px-2 py-1 text-secondary-foreground"
                  style={typography.bodyMedium}
                >
                  {formatUsd(device.quoteUsd!)}
                </span>
              ) : (
                <span
                  className="whitespace-nowrap text-card-foreground"
                  style={typography.bodyMedium}
                >
                  {formatUsd(device.quoteUsd!)}
                </span>
              )}
              {hasAdjustment ? (
                <span
                  className="whitespace-nowrap text-card-foreground"
                  style={typography.bodyMedium}
                >
                  {formatUsd(device.adjustmentUsd!)}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-center self-stretch">
          {showBell ? (
            device.daysRemaining !== undefined ? (
              <div className="flex flex-col items-center justify-center gap-1">
                <Bell
                  aria-hidden
                  className="size-5 shrink-0 text-muted-foreground"
                  strokeWidth={2}
                />
                <span
                  className="whitespace-nowrap text-center text-muted-foreground"
                  style={typography.bodySmall}
                >
                  {device.daysRemaining} d left
                </span>
              </div>
            ) : (
              <Bell
                aria-hidden
                className="size-5 shrink-0 text-muted-foreground"
                strokeWidth={2}
              />
            )
          ) : null}
        </div>
      </Link>

      <Link
        to={continuePath}
        className="mobile-action mobile-action-primary flex items-center justify-center self-stretch rounded-none rounded-r-full bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={
          actionRequired
            ? `Continue ${device.name} in scan flow`
            : `Open ${device.name} details`
        }
      >
        <ChevronRight aria-hidden className="size-5" strokeWidth={2.5} />
      </Link>
    </li>
  );
}
