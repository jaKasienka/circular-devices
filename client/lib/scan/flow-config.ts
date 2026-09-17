import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Package,
  Shield,
  Smartphone,
} from "lucide-react";

import type { ScanPhaseId, ScanStepId } from "./types";

export type ScanPhaseConfig = {
  id: ScanPhaseId;
  label: string;
  icon: LucideIcon;
  steps: ScanStepId[];
};

export const SCAN_PHASES: ScanPhaseConfig[] = [
  {
    id: "scan",
    label: "Scan your Device",
    icon: Smartphone,
    steps: [
      "scan-instructions",
      "scan-capture",
      "scan-analysis",
      "scan-result",
    ],
  },
  {
    id: "seal",
    label: "Place the Seal",
    icon: Shield,
    steps: [
      "seal-intro",
      "seal-form",
      "seal-wait",
      "seal-arrived",
    ],
  },
  {
    id: "ship",
    label: "Configure and Ship",
    icon: Package,
    steps: ["ship-configure", "ship-qr", "ship-success"],
  },
  {
    id: "audit",
    label: "Audit, Cashier, Get Certified",
    icon: BadgeCheck,
    steps: ["audit-waiting"],
  },
];

export const STEP_LABELS: Record<ScanStepId, string> = {
  "scan-instructions": "Scan instructions",
  "scan-capture": "Scan capture",
  "scan-analysis": "Device analysis",
  "scan-result": "Scan result",
  "seal-intro": "Seal security overview",
  "seal-form": "Order seal",
  "seal-wait": "Wait for seal delivery",
  "seal-arrived": "Place the seal",
  "ship-configure": "Configure shipment",
  "ship-qr": "Shipment QR code",
  "ship-success": "Shipment confirmed",
  "audit-waiting": "Audit and certification",
};

export function getPhaseForStep(stepId: ScanStepId): ScanPhaseId {
  const phase = SCAN_PHASES.find((entry) => entry.steps.includes(stepId));
  if (!phase) {
    throw new Error(`Unknown scan step: ${stepId}`);
  }
  return phase.id;
}

export function getNextStep(stepId: ScanStepId): ScanStepId | null {
  const flatSteps = SCAN_PHASES.flatMap((phase) => phase.steps);
  const index = flatSteps.indexOf(stepId);
  return index >= 0 && index < flatSteps.length - 1
    ? flatSteps[index + 1]
    : null;
}

export function isPhaseComplete(
  phaseId: ScanPhaseId,
  completedSteps: Partial<Record<ScanStepId, unknown>>,
): boolean {
  const phase = SCAN_PHASES.find((entry) => entry.id === phaseId);
  if (!phase) {
    return false;
  }
  return phase.steps.every((stepId) => Boolean(completedSteps[stepId]));
}

export function getPhaseStatus(
  phaseId: ScanPhaseId,
  activePhase: ScanPhaseId,
  completedSteps: Partial<Record<ScanStepId, unknown>>,
): "pending" | "active" | "completed" {
  if (isPhaseComplete(phaseId, completedSteps)) {
    return "completed";
  }
  if (phaseId === activePhase) {
    return "active";
  }
  return "pending";
}
