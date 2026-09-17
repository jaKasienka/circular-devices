import type { SealDeliveryStatus, ShipmentStatus } from "./types";

const SEAL_DELIVERY_SEQUENCE: SealDeliveryStatus[] = [
  "ordered",
  "dispatched",
  "out_for_delivery",
  "delivered",
];

const SEAL_DELIVERY_DELAYS_MS: Record<SealDeliveryStatus, number> = {
  idle: 0,
  ordered: 2500,
  dispatched: 5000,
  out_for_delivery: 8000,
  delivered: 0,
};

export function getNextSealDeliveryStatus(
  current: SealDeliveryStatus,
): SealDeliveryStatus | null {
  const index = SEAL_DELIVERY_SEQUENCE.indexOf(current);
  if (index < 0 || index >= SEAL_DELIVERY_SEQUENCE.length - 1) {
    return null;
  }
  return SEAL_DELIVERY_SEQUENCE[index + 1];
}

export function getSealDeliveryDelayMs(status: SealDeliveryStatus): number {
  return SEAL_DELIVERY_DELAYS_MS[status] ?? 0;
}

export function getShipmentPickupDelayMs(): number {
  return 9000;
}

export function isSealDelivered(status: SealDeliveryStatus): boolean {
  return status === "delivered";
}

export function isShipmentPickedUp(status: ShipmentStatus): boolean {
  return status === "picked_up";
}

export function formatShippedDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
}
