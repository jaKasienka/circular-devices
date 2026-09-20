import { useState, type MouseEvent } from "react";

import { isShipmentPickedUp } from "@/lib/scan/logistics-mock";
import { MEMORY_DELETION_SERVICE_USD } from "@/lib/devices/constants";
import { useScanFlow } from "@/lib/scan/ScanFlowContext";
import type { ScanStepId } from "@/lib/scan/types";
import ScanBottomAction from "./ScanBottomAction";

export default function ScanStepActionBar() {
  const [capturing, setCapturing] = useState(false);
  const flow = useScanFlow();
  const { state } = flow;

  if (state.viewingCompletedPhase) {
    return null;
  }

  const action = getStepAction(state.activeStep, flow, capturing, setCapturing);

  if (!action) {
    return <div className="h-8 w-full shrink-0" aria-hidden />;
  }

  return (
    <ScanBottomAction
      key={state.activeStep}
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

type ActionConfig = {
  label: string;
  helperText?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  form?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

type FlowApi = ReturnType<typeof useScanFlow>;

function getStepAction(
  stepId: ScanStepId,
  flow: FlowApi,
  capturing: boolean,
  setCapturing: (value: boolean) => void,
): ActionConfig | null {
  const {
    state,
    completeStep,
    setScanResult,
    finishToDevices,
    continueFromSealIntro,
    placeSealOrder,
    generateShippingLabel,
  } = flow;

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

    case "scan-result": {
      if (state.scanResultMode === "deletion-only") {
        return {
          label: "Only erase my data",
          onClick: () => {
            const result = state.scanResult;
            if (result) {
              setScanResult({ ...result, recyclePath: "memory-deletion" });
            }
            completeStep(
              "scan-result",
              `Confirmed memory deletion service ($${MEMORY_DELETION_SERVICE_USD}) for ${result?.deviceName ?? "device"}.`,
            );
          },
        };
      }

      return {
        label: "Recycle and Earn",
        onClick: () => {
          const result = state.scanResult;
          if (result) {
            setScanResult({ ...result, recyclePath: "standard" });
          }
          completeStep(
            "scan-result",
            `Accepted ${state.scanResult?.quoteUsd ?? 0} $ quote for ${state.scanResult?.deviceName ?? "device"}.`,
          );
        },
      };
    }

    case "seal-intro":
      return {
        label: "Continue",
        helperText: "Next: enter your delivery address",
        onClick: (event) => {
          event.preventDefault();
          event.stopPropagation();
          continueFromSealIntro();
        },
      };

    case "seal-form":
      return {
        label: "Continue to review",
        type: "submit",
        form: "seal-order-form",
      };

    case "seal-review":
      return {
        label: "Place order",
        helperText: "This starts seal kit delivery tracking",
        onClick: (event) => {
          event.preventDefault();
          event.stopPropagation();
          placeSealOrder();
        },
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
        label: "Continue to review",
        type: "submit",
        form: "ship-configure-form",
      };

    case "ship-review":
      return {
        label: "Generate shipping label",
        helperText: "Next: show QR at partner drop-off",
        onClick: (event) => {
          event.preventDefault();
          event.stopPropagation();
          generateShippingLabel();
        },
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
