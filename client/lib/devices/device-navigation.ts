import type { DeviceRecord } from "@/lib/devices/types";

const ACTION_REQUIRED_STATUSES = ["scanned", "ready_shipment", "audit"] as const;

export function deviceCompletedPath(deviceId: string): string {
  return `/devices/${deviceId}/completed`;
}

export function deviceDetailPath(device: DeviceRecord): string {
  if (device.status === "completed") {
    return deviceCompletedPath(device.id);
  }

  return `/devices/${device.id}`;
}

export function deviceScanPath(deviceId: string): string {
  return `/scan?device=${encodeURIComponent(deviceId)}`;
}

/** Chevron / continue: completed summary or scan re-entry for in-progress devices. */
export function deviceContinuePath(device: DeviceRecord): string {
  if (device.status === "completed") {
    return deviceCompletedPath(device.id);
  }

  return deviceScanPath(device.id);
}

export function isActionRequiredDevice(device: DeviceRecord): boolean {
  return ACTION_REQUIRED_STATUSES.includes(
    device.status as (typeof ACTION_REQUIRED_STATUSES)[number],
  );
}

export function isInProgressDevice(device: DeviceRecord): boolean {
  return device.status !== "completed";
}
