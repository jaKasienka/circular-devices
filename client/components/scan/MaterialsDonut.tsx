import { DEVICE_MATERIALS } from "@/lib/scan/materials-data";
import { typography } from "@/tokens/design-tokens";

function buildConicGradient(): string {
  let cursor = 0;
  const stops = DEVICE_MATERIALS.map((segment) => {
    const start = cursor;
    cursor += segment.percent;
    return `${segment.color} ${start}% ${cursor}%`;
  });
  return `conic-gradient(from -90deg, ${stops.join(", ")})`;
}

export default function MaterialsDonut() {
  return (
    <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
      <div
        className="relative size-44 shrink-0 rounded-full"
        style={{ background: buildConicGradient() }}
        role="img"
        aria-label="Material composition chart"
      >
        <div className="absolute inset-[18%] rounded-full bg-card" />
      </div>

      <ul className="flex min-w-0 flex-1 flex-col gap-2">
        {DEVICE_MATERIALS.map((segment) => (
          <li key={segment.id} className="flex items-start gap-2">
            <span
              className="mt-1.5 size-3 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
              aria-hidden
            />
            <span className="text-muted-foreground" style={typography.bodySmall}>
              <span className="text-foreground" style={typography.status}>
                {segment.percent}%
              </span>
              {" — "}
              {segment.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
