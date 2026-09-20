import DeviceStatusIcon from "@/components/devices/DeviceStatusIcon";
import {
  ALREADY_EARNED_USD,
  getActionRequiredCount,
  MOCK_DEVICES,
} from "@/lib/devices/mock-devices";
import { typography } from "@/tokens/design-tokens";

export default function DeviceListSummary() {
  const actionCount = getActionRequiredCount(MOCK_DEVICES);

  return (
    <div
      className="mb-2 mt-2 flex w-full min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg border border-border bg-secondary/20 px-4 py-3"
      aria-labelledby="device-summary-action"
    >
      <div className="flex min-w-0 items-center gap-3">
        <DeviceStatusIcon
          status={actionCount > 0 ? "scanned" : "audit"}
          className="size-6 shrink-0"
        />
        <p
          id="device-summary-action"
          className="text-foreground"
          style={typography.bodySmall}
        >
          {actionCount > 0
            ? `Action required (${actionCount})`
            : "No shipments blocking you — optional audit videos when ready"}
        </p>
      </div>

      <div className="flex items-center gap-2">
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
  );
}
