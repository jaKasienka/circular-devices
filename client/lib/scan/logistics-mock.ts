import type { SealDeliveryStatus, ShipmentStatus } from "./types";

const SEAL_DELIVERY_SEQUENCE: SealDeliveryStatus[] = [
  "ordered",
  "dispatched",
  "out_for_delivery",
  "delivered",
];

/** Short delays for portfolio demos (~3.5s seal delivery total). */
const SEAL_DELIVERY_DELAYS_MS: Record<SealDeliveryStatus, number> = {
  idle: 0,
  ordered: 900,
  dispatched: 900,
  out_for_delivery: 1200,
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
  return 5000;
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
