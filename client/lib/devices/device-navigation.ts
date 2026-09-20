import { DEMO_SCAN_DEVICE } from "@/lib/devices/demo-scan-device";
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

export function deviceScanPath(deviceId: string, fresh = false): string {
  const params = new URLSearchParams({ device: deviceId });
  if (fresh) {
    params.set("fresh", "1");
  }
  return `/scan?${params.toString()}`;
}

export function deviceFreshScanPath(
  deviceId: string = DEMO_SCAN_DEVICE.id,
): string {
  return deviceScanPath(deviceId, true);
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
