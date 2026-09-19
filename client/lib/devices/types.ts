export type DeviceStatus =
  | "scanned"
  | "seal_ordered"
  | "ready_shipment"
  | "shipped"
  | "paid"
  | "audit"
  | "completed";

export type DeviceScanEntry = "choice" | "deletion-only";

export type DeviceRecord = {
  id: string;
  name: string;
  status: DeviceStatus;
  quoteUsd?: number;
  adjustmentUsd?: number;
  daysRemaining?: number;
  showPricePill?: boolean;
  /** How scan re-entry presents the post-scan decision (device-3 = deletion-only). */
  scanEntry?: DeviceScanEntry;
  /** Completed-device summary (Devices2 lo-fi). */
  soldDateLabel?: string;
  completedPayoutUsd?: number;
};

export type DeviceStatusLegendItem = {
  status: DeviceStatus;
  label: string;
};
