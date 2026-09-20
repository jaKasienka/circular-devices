import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";

import DeviceListSummary from "@/components/devices/DeviceListSummary";
import DeviceRow from "@/components/devices/DeviceRow";
import { Button } from "@/components/ui/button";
import { deviceFreshScanPath } from "@/lib/devices/device-navigation";
import { DEVICE_LIST_CLASS } from "@/lib/devices/device-row-layout";
import { MOCK_DEVICES } from "@/lib/devices/mock-devices";
import { typography } from "@/tokens/design-tokens";

function pageTitleStyle(): CSSProperties {
  return typography.headlineSmall;
}

export default function Devices() {
  return (
    <section
      className="flex min-h-full w-full min-w-0 flex-col gap-4 px-4 pb-4 pt-2 tablet:px-8"
      aria-labelledby="devices-title"
    >
      <header className="flex w-full shrink-0 flex-col gap-2 rounded-lg bg-secondary/40 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <h1
            id="devices-title"
            className="min-w-0 flex-1 text-center text-foreground"
            style={pageTitleStyle()}
          >
            All Devices
          </h1>

          <button
            type="button"
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Device filters"
          >
            <SlidersHorizontal aria-hidden className="size-5" strokeWidth={2} />
          </button>
        </div>

        <p
          className="text-center text-muted-foreground"
          style={typography.bodySmall}
        >
          sorting filter: urgency
        </p>
      </header>

      <DeviceListSummary />

      <ul className={DEVICE_LIST_CLASS}>
        {MOCK_DEVICES.map((device) => (
          <DeviceRow key={device.id} device={device} />
        ))}
      </ul>

      <Button
        asChild
        className="mobile-action mobile-action-primary mt-2 h-14 w-full shrink-0 rounded-full focus-visible:ring-offset-background"
        style={typography.button}
      >
        <Link to={deviceFreshScanPath()}>Scan a new Device</Link>
      </Button>
    </section>
  );
}
