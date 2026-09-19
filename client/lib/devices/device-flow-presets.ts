import { DEMO_SCAN_DEVICE } from "@/lib/devices/demo-scan-device";
import type { DeviceRecord } from "@/lib/devices/types";
import { getPhaseForStep } from "@/lib/scan/flow-config";
import type {
  CompletedStepRecord,
  ScanFlowState,
  ScanStepId,
} from "@/lib/scan/types";

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

export function buildScanBootstrap(device: DeviceRecord): ScanFlowState {
  const base: ScanFlowState = {
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
    sealDaysRemaining: device.daysRemaining ?? 30,
    shippedAt: null,
  };

  switch (device.id) {
    case DEMO_SCAN_DEVICE.id:
      return {
        ...base,
        activeStep: "scan-result",
        activePhase: getPhaseForStep("scan-result"),
        completedSteps: { ...SCAN_DONE },
        scanResult: {
          deviceName: device.name,
          quoteUsd: device.quoteUsd ?? DEMO_SCAN_DEVICE.quoteUsd,
          recyclePath: "standard",
        },
        scanResultMode: "choice",
      };

    case "device-2":
      return {
        ...base,
        activeStep: "seal-wait",
        activePhase: "seal",
        completedSteps: {
          ...SCAN_DONE,
          "scan-result": stepDone("Accepted recycle quote for iPhone 13 mini."),
          "seal-intro": stepDone("Reviewed seal requirements."),
          "seal-form": stepDone("Seal order submitted."),
        },
        scanResult: {
          deviceName: device.name,
          quoteUsd: device.quoteUsd ?? 100,
          recyclePath: "standard",
        },
        sealDeliveryStatus: "dispatched",
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
        activeStep: "audit-waiting",
        activePhase: "audit",
        completedSteps: {
          ...SCAN_DONE,
          "scan-result": stepDone("Accepted recycle quote for Motorola Edge 40."),
          "seal-intro": stepDone("Reviewed seal requirements."),
          "seal-form": stepDone("Seal order submitted."),
          "seal-wait": stepDone("Seal delivered."),
          "seal-arrived": stepDone("Seal applied."),
          "ship-configure": stepDone("Shipment configured."),
          "ship-qr": stepDone("Carrier pickup confirmed."),
          "ship-success": stepDone("Shipment complete."),
        },
        scanResult: {
          deviceName: device.name,
          quoteUsd: device.quoteUsd ?? 75,
          recyclePath: "standard",
        },
        sealDeliveryStatus: "delivered",
        shipmentStatus: "picked_up",
        shippedAt: "Feb 12, 2026",
      };

    default:
      return base;
  }
}
