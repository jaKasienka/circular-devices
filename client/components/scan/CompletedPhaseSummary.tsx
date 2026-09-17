import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SCAN_PHASES, STEP_LABELS } from "@/lib/scan/flow-config";
import { useScanFlow } from "@/lib/scan/ScanFlowContext";
import type { ScanPhaseId } from "@/lib/scan/types";
import { typography } from "@/tokens/design-tokens";

export default function CompletedPhaseSummary() {
  const { state, clearCompletedView } = useScanFlow();
  const phaseId = state.viewingCompletedPhase;

  if (!phaseId) {
    return null;
  }

  const phase = SCAN_PHASES.find((entry) => entry.id === phaseId);
  if (!phase) {
    return null;
  }

  const completedEntries = phase.steps
    .filter((stepId) => state.completedSteps[stepId])
    .map((stepId) => ({
      stepId,
      label: STEP_LABELS[stepId],
      summary: state.completedSteps[stepId]?.summary ?? "",
    }));

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4 rounded-lg border border-border bg-card p-4"
      aria-labelledby="completed-phase-title"
    >
      <header className="flex flex-col gap-2">
        <h2
          id="completed-phase-title"
          className="text-foreground"
          style={typography.subtitle}
        >
          {phase.label}
        </h2>
        <p className="text-muted-foreground" style={typography.bodySmall}>
          Completed steps are read-only. Return to the active step to continue.
        </p>
      </header>

      <ol className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {completedEntries.map((entry) => (
          <li
            key={entry.stepId}
            className="rounded-md bg-secondary/40 px-4 py-3"
          >
            <p
              className="text-foreground"
              style={typography.status}
            >
              {entry.label}
            </p>
            <p
              className="mt-1 text-muted-foreground"
              style={typography.bodyMedium}
            >
              {entry.summary}
            </p>
          </li>
        ))}
      </ol>

      <PhaseExtras phaseId={phaseId} />

      <Button
        type="button"
        variant="secondary"
        className="mobile-action h-12 w-full shrink-0 rounded-full"
        style={typography.button}
        onClick={clearCompletedView}
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to current step
      </Button>
    </section>
  );
}

function PhaseExtras({ phaseId }: { phaseId: ScanPhaseId }) {
  const { state } = useScanFlow();

  if (phaseId === "scan" && state.scanResult) {
    return (
      <div className="rounded-md border border-primary/30 bg-primary/10 px-4 py-3">
        <p className="text-foreground" style={typography.status}>
          {state.scanResult.deviceName}
        </p>
        <p className="text-primary" style={typography.headlineSmall}>
          {state.scanResult.quoteUsd} $
        </p>
      </div>
    );
  }

  if (phaseId === "seal" && state.sealOrder) {
    return (
      <div className="rounded-md border border-border bg-secondary/30 px-4 py-3">
        <p className="text-foreground" style={typography.bodyMedium}>
          {state.sealOrder.fullName}
        </p>
        <p className="text-muted-foreground" style={typography.bodySmall}>
          {state.sealOrder.street}, {state.sealOrder.city},{" "}
          {state.sealOrder.country}
        </p>
      </div>
    );
  }

  if (phaseId === "ship" && state.shippedAt) {
    return (
      <p className="text-muted-foreground" style={typography.bodyMedium}>
        Shipped {state.shippedAt}. Waiting for video, money, and certificate.
      </p>
    );
  }

  return null;
}
