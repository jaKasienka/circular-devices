import { cn } from "@/lib/utils";
import type { SealDeliveryStatus } from "@/lib/scan/types";
import { typography } from "@/tokens/design-tokens";

const TRACKER_STEPS: { id: SealDeliveryStatus; label: string }[] = [
  { id: "ordered", label: "Ordered" },
  { id: "dispatched", label: "Dispatched" },
  { id: "out_for_delivery", label: "Out for delivery" },
  { id: "delivered", label: "Delivered" },
];

const STATUS_ORDER: SealDeliveryStatus[] = [
  "idle",
  "ordered",
  "dispatched",
  "out_for_delivery",
  "delivered",
];

function statusIndex(status: SealDeliveryStatus): number {
  return STATUS_ORDER.indexOf(status);
}

type DeliveryTrackerProps = {
  status: SealDeliveryStatus;
};

export default function DeliveryTracker({ status }: DeliveryTrackerProps) {
  const activeIndex = statusIndex(status);

  return (
    <ol
      className="flex w-full flex-wrap gap-x-2 gap-y-3"
      aria-label="Seal delivery progress"
    >
      {TRACKER_STEPS.map((step, index) => {
        const reached = activeIndex >= statusIndex(step.id);
        const isCurrent =
          status === step.id ||
          (status === "delivered" && step.id === "delivered");

        return (
          <li
            key={step.id}
            className={cn(
              "flex min-w-[calc(50%-0.25rem)] flex-1 flex-col gap-1",
              index === TRACKER_STEPS.length - 1 && "min-w-full",
            )}
          >
            <span
              className={cn(
                "h-1.5 rounded-full transition-colors duration-500",
                reached ? "bg-primary" : "bg-muted",
                isCurrent && "ring-2 ring-primary/30",
              )}
              aria-hidden
            />
            <span
              className={cn(
                reached ? "text-foreground" : "text-muted-foreground",
              )}
              style={typography.bodySmall}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
