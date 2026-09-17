export type MaterialSegment = {
  id: string;
  label: string;
  percent: number;
  color: string;
};

export const DEVICE_MATERIALS: MaterialSegment[] = [
  { id: "plastics", label: "Plastics", percent: 40, color: "var(--color-primary)" },
  {
    id: "glass",
    label: "Glass / Ceramics",
    percent: 20,
    color: "color-mix(in srgb, var(--color-primary) 55%, white)",
  },
  {
    id: "metals",
    label: "Base Metals",
    percent: 20,
    color: "color-mix(in srgb, var(--color-primary) 35%, white)",
  },
  {
    id: "battery",
    label: "Battery",
    percent: 15,
    color: "color-mix(in srgb, var(--color-primary) 75%, black)",
  },
  {
    id: "rare-earths",
    label: "Rare Earths",
    percent: 5,
    color: "var(--color-muted-foreground)",
  },
];
