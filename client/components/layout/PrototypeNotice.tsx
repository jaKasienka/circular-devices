import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

import { typography } from "@/tokens/design-tokens";

const STORAGE_KEY = "circular-prototype-notice-dismissed";

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function PrototypeNotice() {
  const [dismissed, setDismissed] = useState(() => readDismissed());

  if (dismissed) {
    return null;
  }

  return (
    <div
      className="mx-4 mt-2 flex shrink-0 items-start gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 tablet:mx-8"
      role="status"
    >
      <p className="min-w-0 flex-1 text-pretty text-muted-foreground" style={typography.bodySmall}>
        <span className="text-foreground">Work in progress — portfolio prototype.</span>{" "}
        Mock devices, logistics, and payments.{" "}
        <Link
          to="/profile/prototype"
          className="text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Demo notice & case study
        </Link>
      </p>
      <button
        type="button"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Dismiss prototype notice"
        onClick={() => {
          window.localStorage.setItem(STORAGE_KEY, "1");
          setDismissed(true);
        }}
      >
        <X aria-hidden className="size-4" />
      </button>
    </div>
  );
}
