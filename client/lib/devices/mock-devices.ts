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
    label: "Fully Recycled - Please Audit the Video we sent you!",
  },
  {
    status: "completed",
    label: "Fully Recycled - You can revisit the Details",
  },
];

export const MOCK_DEVICES: DeviceRecord[] = [
  {
    id: "device-1",
    name: "phone",
    status: "scanned",
    quoteUsd: 175,
    showPricePill: true,
  },
  {
    id: "device-2",
    name: "phone",
    status: "seal_ordered",
    quoteUsd: 100,
    daysRemaining: 24,
  },
  {
    id: "device-3",
    name: "phone",
    status: "ready_shipment",
    quoteUsd: 325,
    adjustmentUsd: -25,
  },
  {
    id: "device-4",
    name: "phone",
    status: "shipped",
    quoteUsd: 75,
  },
  {
    id: "device-5",
    name: "phone",
    status: "completed",
    quoteUsd: 175,
    showPricePill: true,
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
  return devices.filter((device) =>
    ["scanned", "ready_shipment", "audit"].includes(device.status),
  ).length;
}
