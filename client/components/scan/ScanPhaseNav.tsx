import { Check, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { getPhaseStatus, SCAN_PHASES } from "@/lib/scan/flow-config";
import { useScanFlow } from "@/lib/scan/ScanFlowContext";
import type { ScanPhaseId } from "@/lib/scan/types";
import { typography } from "@/tokens/design-tokens";

const PHASE_SHORT_LABELS: Record<ScanPhaseId, string> = {
  scan: "Scan",
  seal: "Seal",
  ship: "Ship",
  audit: "Audit",
};

export default function ScanPhaseNav() {
  const { state, selectPhase } = useScanFlow();

  const activePhase = SCAN_PHASES.find((entry) => entry.id === state.activePhase);

  return (
    <nav
      className="mb-4 flex w-full flex-col gap-2.5 rounded-lg bg-secondary/30 p-2.5"
      aria-label="Scan flow phases"
    >
      <ol className="flex w-full gap-2.5">
        {SCAN_PHASES.map((phase) => {
          const status = getPhaseStatus(
            phase.id,
            state.activePhase,
            state.completedSteps,
          );
          const isReviewing = state.viewingCompletedPhase === phase.id;

          return (
            <li key={phase.id} className="min-w-0 flex-1">
              <PhaseChip
                phaseId={phase.id}
                shortLabel={PHASE_SHORT_LABELS[phase.id]}
                icon={phase.icon}
                status={status}
                isReviewing={isReviewing}
                onSelect={() => selectPhase(phase.id)}
              />
            </li>
          );
        })}
      </ol>

      {activePhase ? (
        <p
          className="truncate px-1 text-center text-foreground"
          style={typography.bodySmall}
          aria-live="polite"
        >
          {state.viewingCompletedPhase
            ? `Reviewing: ${SCAN_PHASES.find((entry) => entry.id === state.viewingCompletedPhase)?.label ?? ""}`
            : activePhase.label}
        </p>
      ) : null}
    </nav>
  );
}

type PhaseChipProps = {
  phaseId: ScanPhaseId;
  shortLabel: string;
  icon: LucideIcon;
  status: "pending" | "active" | "completed";
  isReviewing: boolean;
  onSelect: () => void;
};

function PhaseChip({
  phaseId,
  shortLabel,
  icon: Icon,
  status,
  isReviewing,
  onSelect,
}: PhaseChipProps) {
  const isInteractive = status === "completed";
  const isHighlighted = status === "active" || isReviewing;

  const chipClassName = cn(
    "flex min-h-20 w-full min-w-11 flex-col items-center justify-center gap-1.5 rounded-md px-2 py-2.5 transition-colors",
    isHighlighted && "bg-primary/15 ring-1 ring-primary/30",
    isInteractive &&
      "cursor-pointer hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  );

  const content = (
    <>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          isHighlighted
            ? "bg-primary text-primary-foreground"
            : status === "completed"
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground",
        )}
      >
        {status === "completed" ? (
          <Check aria-hidden className="size-5" strokeWidth={2.5} />
        ) : (
          <Icon aria-hidden className="size-5" strokeWidth={2} />
        )}
      </span>
      <span
        className={cn(
          "w-full shrink-0 text-center",
          status === "pending" ? "text-muted-foreground" : "text-foreground",
        )}
        style={typography.navigation}
      >
        {shortLabel}
      </span>
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        className={chipClassName}
        aria-current={isReviewing ? "step" : undefined}
        aria-label={`Review ${shortLabel} phase`}
        onClick={onSelect}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={chipClassName}
      aria-current={status === "active" ? "step" : undefined}
      data-phase={phaseId}
    >
      {content}
    </div>
  );
}
