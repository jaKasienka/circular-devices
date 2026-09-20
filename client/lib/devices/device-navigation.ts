import { DEMO_SCAN_DEVICE } from "@/lib/devices/demo-scan-device";
import type { DeviceRecord } from "@/lib/devices/types";

const ACTION_REQUIRED_STATUSES = ["scanned", "ready_shipment"] as const;

export function deviceCompletedPath(deviceId: string): string {
  return `/devices/${deviceId}/completed`;
}

export function deviceAuditPath(deviceId: string): string {
  return `/devices/${deviceId}/audit`;
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

  if (device.status === "audit") {
    return deviceAuditPath(device.id);
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

/** Post-handling: video ready, payout in progress — bell “final”, not an alert row. */
export function isAuditReadyDevice(device: DeviceRecord): boolean {
  return device.status === "audit";
}

/** Lower score = higher urgency (matches “sorting filter: urgency” on Devices). */
function deviceUrgencyScore(device: DeviceRecord): number {
  switch (device.status) {
    case "scanned":
      return 0;
    case "ready_shipment":
      return 1 + (device.daysRemaining ?? 0) / 100;
    case "audit":
      return 10;
    case "seal_ordered":
      return 20;
    case "shipped":
      return 25;
    case "paid":
      return 90;
    case "completed":
      return 99;
    default:
      return 50;
  }
}

export function compareDevicesByUrgency(
  a: DeviceRecord,
  b: DeviceRecord,
): number {
  const delta = deviceUrgencyScore(a) - deviceUrgencyScore(b);
  if (delta !== 0) {
    return delta;
  }
  return a.name.localeCompare(b.name);
}
