import { DEMO_SCAN_DEVICE } from "@/lib/devices/demo-scan-device";
import {
  isActionRequiredDevice,
  isDatabaseOnlyScannedDevice,
} from "@/lib/devices/device-navigation";

import type { DeviceRecord, DeviceStatusLegendItem } from "./types";

export const DEVICE_STATUS_LEGEND: DeviceStatusLegendItem[] = [
  {
    status: "scanned",
    label: "Scanned - Move on for Recycling or Deletion!",
  },
  {
    status: "seal_ordered",
    label: "Seal ordered - Please wait for the Seal...",
  },
  {
    status: "ready_shipment",
    label: "Ready for Shipment - Please Send us your Device!",
  },
  {
    status: "shipped",
    label: "Shipped - Please Wait for the Money and the Video...",
  },
  {
    status: "paid",
    label: "Fully Recycled - You got paid!",
  },
  {
    status: "audit",
    label: "Video ready — payout on the way. Review the audit video when you like.",
  },
  {
    status: "completed",
    label: "Fully Recycled - You can revisit the Details",
  },
];

export const MOCK_DEVICES: DeviceRecord[] = [
  {
    id: DEMO_SCAN_DEVICE.id,
    name: DEMO_SCAN_DEVICE.name,
    status: "audit",
    quoteUsd: DEMO_SCAN_DEVICE.quoteUsd,
    showPricePill: true,
  },
  {
    id: "device-2",
    name: "iPhone 13 mini",
    status: "ready_shipment",
    quoteUsd: 100,
    daysRemaining: 24,
  },
  {
    id: "device-3",
    name: "Google Pixel 8",
    status: "scanned",
    quoteUsd: 325,
    scanEntry: "deletion-only",
  },
  {
    id: "device-4",
    name: "Motorola Edge 40",
    status: "seal_ordered",
    quoteUsd: 75,
  },
  {
    id: "device-5",
    name: "iPhone XR",
    status: "completed",
    quoteUsd: 175,
    showPricePill: true,
    completedPayoutUsd: 175,
    soldDateLabel: "Sold 2/2/26",
  },
];

/** Matches lo-fi Devices1 legend total. */
export const ALREADY_EARNED_USD = 350;

export function getEarnedTotal(devices: DeviceRecord[]): number {
  return devices.reduce((total, device) => {
    if (device.status !== "paid" && device.status !== "completed") {
      return total;
    }

    const quote = device.quoteUsd ?? 0;
    const adjustment = device.adjustmentUsd ?? 0;
    return total + quote + adjustment;
  }, 0);
}

export function getActionRequiredCount(devices: DeviceRecord[]): number {
  return devices.filter((device) => isActionRequiredDevice(device)).length;
}

/** Detail / legend copy — erasure-only scan is past scan, not “move on to recycle”. */
export function getDeviceStatusLabel(device: DeviceRecord): string | undefined {
  if (isDatabaseOnlyScannedDevice(device)) {
    return "Scan complete — continue certified data erasure when you're ready.";
  }

  return DEVICE_STATUS_LEGEND.find((entry) => entry.status === device.status)
    ?.label;
}
