import DeviceStatusIcon from "@/components/devices/DeviceStatusIcon";
import {
  ALREADY_EARNED_USD,
  DEVICE_STATUS_LEGEND,
  getActionRequiredCount,
  MOCK_DEVICES,
} from "@/lib/devices/mock-devices";
import { typography } from "@/tokens/design-tokens";

export default function DeviceLegend() {
  const actionRequiredCount = getActionRequiredCount(MOCK_DEVICES);

  return (
    <section
      className="flex w-full min-w-0 flex-col gap-3"
      aria-labelledby="device-legend-title"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex items-center gap-2">
          <AlertBadge count={actionRequiredCount} />
          <h2
            id="device-legend-title"
            className="text-foreground"
            style={typography.bodySmall}
          >
            Action required!
          </h2>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-foreground" style={typography.bodySmall}>
            Already Earned!
          </span>
          <span
            className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground"
            style={typography.bodySmall}
          >
            {ALREADY_EARNED_USD} $
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {DEVICE_STATUS_LEGEND.map((item) => (
          <li
            key={item.status}
            className="flex items-start gap-3 text-muted-foreground"
          >
            <DeviceStatusIcon status={item.status} className="size-6" />
            <p className="min-w-0 flex-1 text-pretty" style={typography.bodySmall}>
              {item.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AlertBadge({ count }: { count: number }) {
  if (count <= 0) {
    return (
      <DeviceStatusIcon status="scanned" className="size-6" aria-hidden />
    );
  }

  return (
    <span
      className="flex size-6 shrink-0 items-center justify-center rounded-full border border-accent text-accent"
      aria-hidden
    >
      <span style={typography.bodySmall}>{count}</span>
    </span>
  );
}
