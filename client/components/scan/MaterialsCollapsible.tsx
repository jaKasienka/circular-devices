import { ChevronDown } from "lucide-react";

import MaterialsDonut from "@/components/scan/MaterialsDonut";
import { cn } from "@/lib/utils";
import { typography } from "@/tokens/design-tokens";

type MaterialsCollapsibleProps = {
  defaultOpen?: boolean;
};

export default function MaterialsCollapsible({
  defaultOpen = false,
}: MaterialsCollapsibleProps) {
  return (
    <details
      className="group rounded-lg border border-border bg-secondary/20"
      open={defaultOpen}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3",
          "[&::-webkit-details-marker]:hidden",
        )}
      >
        <span className="text-foreground" style={typography.status}>
          Material breakdown
        </span>
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-border px-4 pb-4 pt-3">
        <MaterialsDonut />
      </div>
    </details>
  );
}
