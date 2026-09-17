export type ScanPhaseId = "scan" | "seal" | "ship" | "audit";

export type ScanStepId =
  | "scan-instructions"
  | "scan-capture"
  | "scan-analysis"
  | "scan-result"
  | "seal-intro"
  | "seal-form"
  | "seal-wait"
  | "seal-arrived"
  | "ship-configure"
  | "ship-qr"
  | "ship-success"
  | "audit-waiting";

export type StepStatus = "pending" | "active" | "completed";

export type ScanResult = {
  deviceName: string;
  quoteUsd: number;
  recyclePath: "standard" | "memory-deletion";
};

export type SealOrder = {
  fullName: string;
  street: string;
  city: string;
  country: string;
};

export type ShipmentPreferences = {
  pickup: SealOrder;
  notifyLivestream: boolean;
  logisticsConsent: boolean;
  paymentMethod: "paypal";
};

export type SealDeliveryStatus =
  | "idle"
  | "ordered"
  | "dispatched"
  | "out_for_delivery"
  | "delivered";

export type ShipmentStatus =
  | "idle"
  | "label_created"
  | "awaiting_pickup"
  | "picked_up";

export type CompletedStepRecord = {
  summary: string;
  completedAt: number;
};

export type ScanFlowState = {
  activePhase: ScanPhaseId;
  activeStep: ScanStepId;
  completedSteps: Partial<Record<ScanStepId, CompletedStepRecord>>;
  viewingCompletedPhase: ScanPhaseId | null;
  scanResult: ScanResult | null;
  sealOrder: SealOrder | null;
  shipmentPreferences: ShipmentPreferences | null;
  sealDeliveryStatus: SealDeliveryStatus;
  shipmentStatus: ShipmentStatus;
  sealDaysRemaining: number;
  shippedAt: string | null;
};
