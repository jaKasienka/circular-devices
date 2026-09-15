export type DeviceStatus =
  | "scanned"
  | "seal_ordered"
  | "ready_shipment"
  | "shipped"
  | "paid"
  | "audit"
  | "completed";

export type DeviceRecord = {
  id: string;
  name: string;
  status: DeviceStatus;
  quoteUsd?: number;
  adjustmentUsd?: number;
  daysRemaining?: number;
  showPricePill?: boolean;
};

export type DeviceStatusLegendItem = {
  status: DeviceStatus;
  label: string;
};
