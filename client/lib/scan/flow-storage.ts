import type { ScanFlowState } from "@/lib/scan/types";

export const FLOWS_STORAGE_KEY = "circular-scan-flows-v2";

export function readAllDeviceFlows(): Record<string, ScanFlowState> {
  try {
    const raw = sessionStorage.getItem(FLOWS_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as Record<string, ScanFlowState>;
  } catch {
    return {};
  }
}

export function writeDeviceFlow(deviceId: string, state: ScanFlowState) {
  const all = readAllDeviceFlows();
  all[deviceId] = state;
  sessionStorage.setItem(FLOWS_STORAGE_KEY, JSON.stringify(all));
}

export function readDeviceFlow(deviceId: string): ScanFlowState | null {
  return readAllDeviceFlows()[deviceId] ?? null;
}

export function clearAllDeviceFlows() {
  sessionStorage.removeItem(FLOWS_STORAGE_KEY);
}

export function clearDeviceFlow(deviceId: string) {
  const all = readAllDeviceFlows();
  if (!(deviceId in all)) {
    return;
  }
  delete all[deviceId];
  sessionStorage.setItem(FLOWS_STORAGE_KEY, JSON.stringify(all));
}
