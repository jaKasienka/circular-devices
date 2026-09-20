import {
  AlertCircle,
  BadgeCheck,
  CircleDollarSign,
  LoaderCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { DeviceStatus } from "@/lib/devices/types";

type DeviceStatusIconProps = {
  status: DeviceStatus;
  className?: string;
};

export default function DeviceStatusIcon({
  status,
  className,
}: DeviceStatusIconProps) {
  const iconClass = cn("size-6 shrink-0", className);

  switch (status) {
    case "scanned":
    case "ready_shipment":
      return (
        <AlertCircle
          aria-hidden
          className={cn(iconClass, "text-accent")}
          strokeWidth={2}
        />
      );
    case "seal_ordered":
    case "shipped":
    case "audit":
      return (
        <LoaderCircle
          aria-hidden
          className={cn(iconClass, "text-muted-foreground")}
          strokeWidth={2}
        />
      );
    case "paid":
      return (
        <CircleDollarSign
          aria-hidden
          className={cn(iconClass, "text-primary")}
          strokeWidth={2}
        />
      );
    case "completed":
      return (
        <BadgeCheck
          aria-hidden
          className={cn(iconClass, "text-primary")}
          strokeWidth={2}
        />
      );
  }
}
