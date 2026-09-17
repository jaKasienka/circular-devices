import { useState } from "react";

import { Button } from "@/components/ui/button";
import { isShipmentPickedUp } from "@/lib/scan/logistics-mock";
import { useScanFlow } from "@/lib/scan/ScanFlowContext";
import type { ScanStepId } from "@/lib/scan/types";
import { typography } from "@/tokens/design-tokens";
import ScanBottomAction from "./ScanBottomAction";

export default function ScanStepActionBar() {
  const [capturing, setCapturing] = useState(false);
  const flow = useScanFlow();
  const { state } = flow;

  if (state.viewingCompletedPhase) {
    return null;
  }

  const action = getStepAction(state.activeStep, flow, capturing, setCapturing);
  const secondary = getSecondaryAction(state.activeStep, flow);

  if (!action && !secondary) {
    return <div className="h-8 w-full shrink-0" aria-hidden />;
  }

  if (action && !secondary) {
    return (
      <ScanBottomAction
        label={action.label}
        helperText={action.helperText}
        disabled={action.disabled}
        variant={action.variant}
        type={action.type}
        form={action.form}
        onClick={action.onClick}
      />
    );
  }

  return (
    <div className="flex w-full shrink-0 flex-col gap-2 pt-2">
      {action?.helperText ? (
        <p
          className="px-1 text-center text-muted-foreground"
          style={typography.bodySmall}
        >
          {action.helperText}
        </p>
      ) : null}

      {action ? (
        <Button
          type={action.type ?? "button"}
          form={action.form}
          disabled={action.disabled}
          className="mobile-action mobile-action-primary h-14 min-h-14 w-full shrink-0 rounded-full focus-visible:ring-offset-background"
          style={typography.button}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ) : null}

      {secondary ? (
        <Button
          type="button"
          variant="secondary"
          className="mobile-action mobile-action-secondary h-14 min-h-14 w-full shrink-0 rounded-full border border-secondary-button-stroke focus-visible:ring-offset-background"
          style={typography.button}
          onClick={secondary.onClick}
        >
          {secondary.label}
        </Button>
      ) : null}

      <div className="h-8 w-full shrink-0" aria-hidden />
    </div>
  );
}

type ActionConfig = {
  label: string;
  helperText?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  form?: string;
  onClick?: () => void;
};

type FlowApi = ReturnType<typeof useScanFlow>;

function getStepAction(
  stepId: ScanStepId,
  flow: FlowApi,
  capturing: boolean,
  setCapturing: (value: boolean) => void,
): ActionConfig | null {
  const { state, completeStep, finishToDevices } = flow;

  switch (stepId) {
    case "scan-instructions":
      return {
        label: "Start scan",
        onClick: () =>
          completeStep(
            "scan-instructions",
            "Reviewed scan instructions and camera setup.",
          ),
      };

    case "scan-capture":
      return {
        label: capturing ? "Capturing…" : "Capture scan",
        disabled: capturing,
        onClick: () => {
          setCapturing(true);
          window.setTimeout(() => {
            completeStep(
              "scan-capture",
              "Captured device image and serial metadata.",
            );
            setCapturing(false);
          }, 1200);
        },
      };

    case "scan-analysis":
      return null;

    case "scan-result":
      return {
        label: "Recycle and Earn",
        onClick: () =>
          completeStep(
            "scan-result",
            `Accepted ${state.scanResult?.quoteUsd ?? 0} $ quote for ${state.scanResult?.deviceName ?? "device"}.`,
          ),
      };

    case "seal-intro":
      return {
        label: "Order seal",
        onClick: () =>
          completeStep(
            "seal-intro",
            "Reviewed tamper-evident seal requirements.",
          ),
      };

    case "seal-form":
      return {
        label: "Confirm order",
        type: "submit",
        form: "seal-order-form",
      };

    case "seal-wait":
      return null;

    case "seal-arrived":
      return {
        label: "Seal placed",
        onClick: () =>
          completeStep(
            "seal-arrived",
            "Confirmed tamper-evident seal placement on device.",
          ),
      };

    case "ship-configure":
      return {
        label: "Generate shipping label",
        type: "submit",
        form: "ship-configure-form",
      };

    case "ship-qr":
      return {
        label: "Shipped",
        disabled: !isShipmentPickedUp(state.shipmentStatus),
        helperText: isShipmentPickedUp(state.shipmentStatus)
          ? "Carrier confirmed pickup. Confirm to continue."
          : "The main button will be enabled when you really ship your device.",
        onClick: () =>
          completeStep(
            "ship-qr",
            "Carrier confirmed device pickup at drop-off.",
          ),
      };

    case "ship-success":
      return {
        label: "Continue to audit status",
        onClick: () =>
          completeStep(
            "ship-success",
            "User handoff complete — waiting for video, money, and certificate.",
          ),
      };

    case "audit-waiting":
      return {
        label: "Go to My Devices",
        onClick: finishToDevices,
      };

    default:
      return null;
  }
}

function getSecondaryAction(stepId: ScanStepId, flow: FlowApi): ActionConfig | null {
  const { completeStep, resetFlow } = flow;

  if (stepId === "scan-result") {
    return {
      label: "Only Erase My Data",
      onClick: () =>
        completeStep(
          "scan-result",
          "Chose certified memory deletion path instead of full recycle.",
        ),
    };
  }

  if (stepId === "audit-waiting") {
    return {
      label: "Reset scan flow",
      onClick: resetFlow,
    };
  }

  return null;
}
