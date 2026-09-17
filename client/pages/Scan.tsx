import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

import CompletedPhaseSummary from "@/components/scan/CompletedPhaseSummary";
import ScanPhaseNav from "@/components/scan/ScanPhaseNav";
import ScanStepActionBar from "@/components/scan/ScanStepActionBar";
import ScanStepContent from "@/components/scan/ScanStepContent";
import { ScanFlowProvider } from "@/lib/scan/ScanFlowContext";
import { typography } from "@/tokens/design-tokens";

function pageTitleStyle(): CSSProperties {
  return typography.headlineSmall;
}

function ScanPageContent() {
  return (
    <section
      className="flex min-h-full w-full min-w-0 flex-col px-4 pb-0 pt-2 tablet:px-8"
      aria-labelledby="scan-title"
    >
      <header className="mb-3 flex w-full shrink-0 items-center justify-between gap-3 rounded-lg bg-secondary/40 px-3 py-2">
        <div className="size-10 shrink-0" aria-hidden />

        <h1
          id="scan-title"
          className="min-w-0 flex-1 text-center text-foreground"
          style={pageTitleStyle()}
        >
          New Scan
        </h1>

        <Link
          to="/"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Close scan flow"
        >
          <X aria-hidden className="size-5" strokeWidth={2} />
        </Link>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <ScanPhaseNav />
          <CompletedPhaseSummary />
          <ScanStepContent />
        </div>

        <ScanStepActionBar />
      </div>
    </section>
  );
}

export default function Scan() {
  return (
    <ScanFlowProvider>
      <ScanPageContent />
    </ScanFlowProvider>
  );
}
