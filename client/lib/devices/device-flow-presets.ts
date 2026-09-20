import { DEMO_SCAN_DEVICE } from "@/lib/devices/demo-scan-device";
import type { DeviceRecord } from "@/lib/devices/types";
import { getPhaseForStep } from "@/lib/scan/flow-config";
import type {
  CompletedStepRecord,
  ScanFlowState,
  ScanStepId,
  SealOrder,
} from "@/lib/scan/types";

export const DEFAULT_SEAL_ORDER: SealOrder = {
  fullName: "Alex Morgan",
  street: "12 Circular Way",
  city: "Berlin",
  country: "Germany",
};

function stepDone(summary: string): CompletedStepRecord {
  return { summary, completedAt: Date.now() };
}

function withSteps(
  stepIds: ScanStepId[],
  summaryPrefix: string,
): Partial<Record<ScanStepId, CompletedStepRecord>> {
  return Object.fromEntries(
    stepIds.map((stepId) => [stepId, stepDone(`${summaryPrefix}: ${stepId}`)]),
  ) as Partial<Record<ScanStepId, CompletedStepRecord>>;
}

const SCAN_DONE = withSteps(
  ["scan-instructions", "scan-capture", "scan-analysis"],
  "Completed",
);

function baseForDevice(device: DeviceRecord): ScanFlowState {
  return {
    activePhase: "scan",
    activeStep: "scan-instructions",
    completedSteps: {},
    viewingCompletedPhase: null,
    scanResult: null,
    scanResultMode: device.scanEntry ?? "choice",
    linkedDeviceId: device.id,
    sealOrder: null,
    shipmentPreferences: null,
    sealDeliveryStatus: "idle",
    shipmentStatus: "idle",
    sealDaysRemaining: 30,
    shippedAt: null,
  };
}

/** Default demo entry from device list chevron (refresh restores these). */
export function buildScanBootstrap(device: DeviceRecord): ScanFlowState {
  const base = baseForDevice(device);

  switch (device.id) {
    case DEMO_SCAN_DEVICE.id:
      return {
        ...base,
        activeStep: "audit-waiting",
        activePhase: "audit",
        completedSteps: {
          ...SCAN_DONE,
          "scan-result": stepDone(
            "Accepted recycle quote for Samsung Galaxy S21.",
          ),
          "seal-intro": stepDone("Reviewed seal requirements."),
          "seal-form": stepDone("Delivery address saved."),
          "seal-review": stepDone("Seal order placed."),
          "seal-wait": stepDone("Seal delivered."),
          "seal-arrived": stepDone("Seal applied."),
          "ship-configure": stepDone("Shipment options saved."),
          "ship-review": stepDone("Shipping label generated."),
          "ship-qr": stepDone("Carrier pickup confirmed."),
          "ship-success": stepDone("Awaiting audit video and payout."),
        },
        scanResult: {
          deviceName: device.name,
          quoteUsd: device.quoteUsd ?? DEMO_SCAN_DEVICE.quoteUsd,
          recyclePath: "standard",
        },
        sealOrder: { ...DEFAULT_SEAL_ORDER },
        sealDeliveryStatus: "delivered",
        shipmentStatus: "picked_up",
        shippedAt: "2/8/26",
      };

    case "device-2":
      return {
        ...base,
        activeStep: "seal-arrived",
        activePhase: "seal",
        completedSteps: {
          ...SCAN_DONE,
          "scan-result": stepDone("Accepted recycle quote for iPhone 13 mini."),
          "seal-intro": stepDone("Reviewed seal requirements."),
          "seal-form": stepDone("Delivery address saved."),
          "seal-review": stepDone("Seal order placed."),
          "seal-wait": stepDone("Seal delivered."),
        },
        scanResult: {
          deviceName: device.name,
          quoteUsd: device.quoteUsd ?? 100,
          recyclePath: "standard",
        },
        sealOrder: { ...DEFAULT_SEAL_ORDER },
        sealDeliveryStatus: "delivered",
        sealDaysRemaining: device.daysRemaining ?? 24,
      };

    case "device-3":
      return {
        ...base,
        activeStep: "scan-result",
        activePhase: getPhaseForStep("scan-result"),
        completedSteps: { ...SCAN_DONE },
        scanResult: {
          deviceName: device.name,
          quoteUsd: device.quoteUsd ?? 325,
          recyclePath: "memory-deletion",
        },
        scanResultMode: "deletion-only",
      };

    case "device-4":
      return {
        ...base,
        activeStep: "seal-wait",
        activePhase: "seal",
        completedSteps: {
          ...SCAN_DONE,
          "scan-result": stepDone("Accepted recycle quote for Motorola Edge 40."),
          "seal-intro": stepDone("Reviewed seal requirements."),
          "seal-form": stepDone("Delivery address saved."),
          "seal-review": stepDone("Seal order placed."),
        },
        scanResult: {
          deviceName: device.name,
          quoteUsd: device.quoteUsd ?? 75,
          recyclePath: "standard",
        },
        sealOrder: { ...DEFAULT_SEAL_ORDER },
        sealDeliveryStatus: "ordered",
      };

    default:
      return base;
  }
}

/** Home “Scan now” replay for device-1 (same device, from the top). */
export function buildFreshScanBootstrap(device: DeviceRecord): ScanFlowState {
  return {
    ...baseForDevice(device),
    scanResultMode: device.scanEntry ?? "choice",
    linkedDeviceId: device.id,
  };
}

export function buildScanEntryState(
  device: DeviceRecord,
  freshEntry: boolean,
): ScanFlowState {
  if (freshEntry) {
    return buildFreshScanBootstrap(device);
  }
  return buildScanBootstrap(device);
}
