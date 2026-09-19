import { useEffect, useState } from "react";
import {
  Camera,
  CheckCircle2,
  CirclePlay,
  Loader2,
  Package,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { DEMO_SCAN_DEVICE } from "@/lib/devices/demo-scan-device";
import { MEMORY_DELETION_SERVICE_USD } from "@/lib/devices/constants";
import DeliveryTracker from "@/components/scan/DeliveryTracker";
import { cn } from "@/lib/utils";
import MaterialsCollapsible from "@/components/scan/MaterialsCollapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  isSealDelivered,
  isShipmentPickedUp,
} from "@/lib/scan/logistics-mock";
import { useScanFlow } from "@/lib/scan/ScanFlowContext";
import type { ScanStepId, SealOrder, ShipmentPreferences } from "@/lib/scan/types";
import { typography } from "@/tokens/design-tokens";

export default function ScanStepContent() {
  const { state } = useScanFlow();

  if (state.viewingCompletedPhase) {
    return null;
  }

  return (
    <div className="pb-4 transition-opacity duration-300">
      <StepPanel stepId={state.activeStep} />
    </div>
  );
}

function StepPanel({ stepId }: { stepId: ScanStepId }) {
  switch (stepId) {
    case "scan-instructions":
      return <ScanInstructionsStep />;
    case "scan-capture":
      return <ScanCaptureStep />;
    case "scan-analysis":
      return <ScanAnalysisStep />;
    case "scan-result":
      return <ScanResultStep />;
    case "seal-intro":
      return <SealIntroStep />;
    case "seal-form":
      return <SealFormStep />;
    case "seal-wait":
      return <SealWaitStep />;
    case "seal-arrived":
      return <SealArrivedStep />;
    case "ship-configure":
      return <ShipConfigureStep />;
    case "ship-qr":
      return <ShipQrStep />;
    case "ship-success":
      return <ShipSuccessStep />;
    case "audit-waiting":
      return <AuditWaitingStep />;
    default:
      return null;
  }
}

function StepShell({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <header className="flex flex-col gap-2">
        <h2 className="text-foreground" style={typography.subtitle}>
          {title}
        </h2>
        {lead ? (
          <p className="text-muted-foreground" style={typography.bodyMedium}>
            {lead}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function ScanInstructionsStep() {
  return (
    <StepShell
      title="How to scan"
      lead="Place the device on a flat surface with good lighting. Keep the camera steady while Circular reads the hardware diagnostics."
    >
      <ol
        className="flex flex-col gap-3 text-muted-foreground"
        style={typography.bodyMedium}
      >
        {[
          "Remove cases or accessories that block ports or sensors.",
          "Align the device within the camera frame.",
          "Hold still while diagnostics run automatically.",
        ].map((text, index) => (
          <li key={text} className="flex gap-3">
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
              style={typography.status}
            >
              {index + 1}
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ol>

      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-secondary/50">
        <Smartphone
          aria-hidden
          className="size-16 text-muted-foreground/60"
          strokeWidth={1.25}
        />
      </div>
    </StepShell>
  );
}

function ScanCaptureStep() {
  return (
    <StepShell
      title="Scan your device"
      lead="Center the device in the frame. Tap capture when the outline turns cyan."
    >
      <div className="relative flex aspect-[3/4] max-h-[min(52vh,420px)] items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-primary/40 bg-secondary/40">
        <div
          className="absolute inset-6 rounded-lg border-2 border-primary/70"
          aria-hidden
        />
        <Camera
          aria-hidden
          className="size-12 text-primary/70"
          strokeWidth={1.5}
        />
      </div>
    </StepShell>
  );
}

function ScanAnalysisStep() {
  const { completeStep, setScanResult } = useScanFlow();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setScanResult({
        deviceName: DEMO_SCAN_DEVICE.name,
        quoteUsd: DEMO_SCAN_DEVICE.quoteUsd,
        recyclePath: "standard",
      });
      completeStep(
        "scan-analysis",
        "Diagnostics complete — Galaxy S21 graded for recycling.",
      );
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [completeStep, setScanResult]);

  return (
    <StepShell
      title="Analyzing device"
      lead="Running battery, display, and memory checks. This usually takes a few seconds."
    >
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <Loader2 aria-hidden className="size-14 animate-spin text-primary" />
        <p
          className="text-center text-muted-foreground"
          style={typography.bodyMedium}
        >
          Checking hardware health…
        </p>
      </div>
    </StepShell>
  );
}

function ScanResultStep() {
  const { state, setScanResult, completeStep } = useScanFlow();
  const result = state.scanResult;
  const deletionOnly = state.scanResultMode === "deletion-only";

  if (!result) {
    return (
      <StepShell title="Scan result" lead="No scan result available yet." />
    );
  }

  const chooseMemoryDeletion = () => {
    setScanResult({ ...result, recyclePath: "memory-deletion" });
    completeStep(
      "scan-result",
      `Chose certified memory deletion ($${MEMORY_DELETION_SERVICE_USD}) for ${result.deviceName}.`,
    );
  };

  if (deletionOnly) {
    return (
      <StepShell
        title="Scan successful!"
        lead={`${result.deviceName} is in premium condition.`}
      >
        <div
          className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-center"
          role="status"
        >
          <p className="text-accent" style={typography.status}>
            Too good to recycle
          </p>
          <p className="mt-1 text-muted-foreground" style={typography.bodySmall}>
            Full recycling is not offered for this device. Continue with
            certified data erasure and device return.
          </p>
        </div>

        <div className="flex justify-center py-1">
          <Smartphone
            aria-hidden
            className="size-24 text-muted-foreground/50"
            strokeWidth={1.1}
          />
        </div>

        <p className="text-center text-muted-foreground" style={typography.bodyMedium}>
          Appraised value {result.quoteUsd} $ — hardware return after audit
        </p>
      </StepShell>
    );
  }

  return (
    <StepShell
      title="Scan successful!"
      lead={`${result.deviceName}. Recycle and earn, or choose certified data erasure.`}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-primary" style={typography.headlineLarge}>
          {result.quoteUsd} $
        </p>
        <p className="text-muted-foreground" style={typography.bodySmall}>
          worth: {result.quoteUsd} $ — material information
        </p>
      </div>

      <div className="flex justify-center py-1">
        <Smartphone
          aria-hidden
          className="size-24 text-muted-foreground/50"
          strokeWidth={1.1}
        />
      </div>

      <MaterialsCollapsible />

      <button
        type="button"
        className={cn(
          "mobile-action mobile-action-secondary w-full rounded-lg border border-secondary-button-stroke bg-secondary px-4 py-3 text-left",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          result.recyclePath === "memory-deletion" && "ring-2 ring-primary",
        )}
        onClick={chooseMemoryDeletion}
      >
        <p className="text-secondary-foreground" style={typography.button}>
          Only erase my data
        </p>
        <p className="mt-1 text-muted-foreground" style={typography.bodySmall}>
          Certified erasure ({MEMORY_DELETION_SERVICE_USD} $ service). Keep your
          device — receive audit video and removal certificate. Same trust
          standard as recycling.
        </p>
      </button>

      <p className="text-muted-foreground" style={typography.bodySmall}>
        Certified Data Destruction: Secure & Verifiable
      </p>
    </StepShell>
  );
}

function SealIntroStep() {
  return (
    <StepShell
      title="Tamper-evident seal"
      lead="The Circular seal locks the device until it reaches our audit facility. Do not remove it after application."
    >
      <div className="flex items-start gap-3 rounded-md bg-secondary/40 px-4 py-3">
        <ShieldCheck aria-hidden className="mt-0.5 size-6 shrink-0 text-primary" />
        <p className="text-muted-foreground" style={typography.bodyMedium}>
          Seals include a unique ID tied to your scan. Breaking the seal before
          audit voids the quote.
        </p>
      </div>
      <div className="flex aspect-video items-center justify-center rounded-lg bg-secondary/50">
        <ShieldCheck
          aria-hidden
          className="size-16 text-muted-foreground/50"
          strokeWidth={1.25}
        />
      </div>
    </StepShell>
  );
}

const DEFAULT_SEAL_ORDER: SealOrder = {
  fullName: "Alex Morgan",
  street: "12 Circular Way",
  city: "Berlin",
  country: "Germany",
};

function SealFormStep() {
  const { setSealOrder, startSealDeliveryTracking, completeStep } = useScanFlow();
  const [order, setOrder] = useState<SealOrder>(DEFAULT_SEAL_ORDER);

  const updateField = (field: keyof SealOrder, value: string) => {
    setOrder((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSealOrder(order);
    startSealDeliveryTracking();
    completeStep(
      "seal-form",
      `Seal order submitted — shipping to ${order.city}, ${order.country}.`,
    );
  };

  return (
    <StepShell
      title="Delivery address"
      lead="We ship the tamper-evident seal to you. Confirm or edit the address below."
    >
      <form
        id="seal-order-form"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <Field
          id="seal-name"
          label="Full name"
          value={order.fullName}
          onChange={(value) => updateField("fullName", value)}
        />
        <Field
          id="seal-street"
          label="Street"
          value={order.street}
          onChange={(value) => updateField("street", value)}
        />
        <Field
          id="seal-city"
          label="City"
          value={order.city}
          onChange={(value) => updateField("city", value)}
        />
        <Field
          id="seal-country"
          label="Country"
          value={order.country}
          onChange={(value) => updateField("country", value)}
        />
      </form>
    </StepShell>
  );
}

function SealWaitStep() {
  const { state } = useScanFlow();

  return (
    <StepShell
      title="Wait for the seal"
      lead="Status: Wait for the Seal — please wait for delivery before placement and shipment."
    >
      <div className="flex flex-col items-center gap-4 py-2">
        <Package aria-hidden className="size-14 text-primary" strokeWidth={1.5} />
        <DeliveryTracker status={state.sealDeliveryStatus} />
        <p className="text-center text-muted-foreground" style={typography.bodyMedium}>
          {isSealDelivered(state.sealDeliveryStatus)
            ? "Delivery confirmed — continuing automatically…"
            : "Seal ordered — please wait for the seal…"}
        </p>
      </div>

      <p className="text-muted-foreground" style={typography.bodySmall}>
        The seal expires in 30 days after delivery. Waiting too long before
        shipment may delay your next seal order.
      </p>
    </StepShell>
  );
}

function SealArrivedStep() {
  const { state } = useScanFlow();

  return (
    <StepShell
      title="Your seal arrived — place it!"
      lead={`Our system confirmed delivery. ${state.sealDaysRemaining} days left to ship after placement.`}
    >
      <DeliveryTracker status={state.sealDeliveryStatus} />

      <div className="relative flex aspect-video max-h-56 items-center justify-center rounded-lg bg-secondary/50">
        <CirclePlay
          aria-hidden
          className="size-16 text-primary/80"
          strokeWidth={1.25}
        />
      </div>

      <p className="text-muted-foreground" style={typography.bodyMedium}>
        Follow the instructions in the video. Apply the tamper-evident seal
        across the device closure before configuring shipment.
      </p>
    </StepShell>
  );
}

function ShipConfigureStep() {
  const {
    state,
    setShipmentPreferences,
    startShipmentTracking,
    completeStep,
  } = useScanFlow();

  const defaultPickup = state.sealOrder ?? DEFAULT_SEAL_ORDER;
  const [pickup, setPickup] = useState<SealOrder>(defaultPickup);
  const [notifyLivestream, setNotifyLivestream] = useState(true);
  const [logisticsConsent, setLogisticsConsent] = useState(false);

  const updatePickupField = (field: keyof SealOrder, value: string) => {
    setPickup((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!logisticsConsent) {
      return;
    }

    const preferences: ShipmentPreferences = {
      pickup,
      notifyLivestream,
      logisticsConsent,
      paymentMethod: "paypal",
    };

    setShipmentPreferences(preferences);
    startShipmentTracking();
    completeStep(
      "ship-configure",
      `Shipment configured — pickup at ${pickup.city}, payout via PayPal.`,
    );
  };

  return (
    <StepShell
      title="Configure shipment"
      lead="Confirm pickup, logistics consent, and how you want to receive your video and payout."
    >
      <form
        id="ship-configure-form"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-3">
          <p className="text-foreground" style={typography.status}>
            Pickup address
          </p>
          <Field
            id="pickup-name"
            label="Full name"
            value={pickup.fullName}
            onChange={(value) => updatePickupField("fullName", value)}
          />
          <Field
            id="pickup-street"
            label="Street"
            value={pickup.street}
            onChange={(value) => updatePickupField("street", value)}
          />
          <Field
            id="pickup-city"
            label="City"
            value={pickup.city}
            onChange={(value) => updatePickupField("city", value)}
          />
          <Field
            id="pickup-country"
            label="Country"
            value={pickup.country}
            onChange={(value) => updatePickupField("country", value)}
          />
        </div>

        <div className="rounded-md border border-border bg-secondary/30 px-4 py-3">
          <p className="text-foreground" style={typography.status}>
            Payout method
          </p>
          <p className="mt-1 text-muted-foreground" style={typography.bodyMedium}>
            PayPal —{" "}
            {state.scanResult ? `${state.scanResult.quoteUsd} $` : "pending quote"}
          </p>
        </div>

        <ConsentRow
          id="notify-livestream"
          label="Notify me to join the certified device handling livestream"
          checked={notifyLivestream}
          onCheckedChange={setNotifyLivestream}
        />

        <ConsentRow
          id="logistics-consent"
          label="I consent to logistics handling and insurance for this sealed shipment"
          checked={logisticsConsent}
          onCheckedChange={setLogisticsConsent}
          required
        />

        <p className="text-muted-foreground" style={typography.bodySmall}>
          Video will be sent to you as evidence of secure data handling.
        </p>
      </form>
    </StepShell>
  );
}

function ShipQrStep() {
  const { state } = useScanFlow();
  const [labelCode] = useState(
    () => `CD-SEAL-${Math.floor(Math.random() * 9000 + 1000)}`,
  );

  return (
    <StepShell
      title="Ship your device"
      lead="Show this QR code at the partner drop-off location to register your sealed device."
    >
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="flex size-44 items-center justify-center rounded-xl border border-border bg-background">
          <QrCode aria-hidden className="size-28 text-foreground" strokeWidth={1} />
        </div>
        <p className="text-muted-foreground" style={typography.bodySmall}>
          {labelCode}
        </p>
      </div>

      {!isShipmentPickedUp(state.shipmentStatus) ? (
        <p className="text-center text-muted-foreground" style={typography.bodySmall}>
          Waiting for carrier scan at drop-off…
        </p>
      ) : null}
    </StepShell>
  );
}

function ShipSuccessStep() {
  const { state } = useScanFlow();

  return (
    <StepShell
      title="You successfully shipped your device!"
      lead={`Status: Shipped ${state.shippedAt ?? "today"} — your part is done. Waiting for video, money, and certificate.`}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2
          aria-hidden
          className="size-20 text-primary"
          strokeWidth={1.25}
        />
        <p className="text-primary" style={typography.headlineLarge}>
          Thank you!
        </p>
        <p className="text-muted-foreground" style={typography.bodyMedium}>
          Thank you for helping save materials through responsible recycling.
        </p>
      </div>

      {state.scanResult ? (
        <div className="rounded-lg bg-primary/10 px-4 py-4 text-center">
          <p className="text-primary" style={typography.headlineLarge}>
            {state.scanResult.quoteUsd} $
          </p>
          <p className="text-muted-foreground" style={typography.bodySmall}>
            Pending payout via PayPal
          </p>
        </div>
      ) : null}

      <ul className="list-inside list-disc text-muted-foreground" style={typography.bodyMedium}>
        <li>Video of device handling</li>
        <li>Money to your chosen payout method</li>
        <li>Certificate of data safety and recycling</li>
      </ul>

      <p className="text-muted-foreground" style={typography.bodySmall}>
        One hour after you receive the video, you&apos;ll get your money and
        certificate.
      </p>
    </StepShell>
  );
}

function AuditWaitingStep() {
  const { state } = useScanFlow();

  return (
    <StepShell
      title="Audit, Cashier, Get Certified"
      lead={`Shipped ${state.shippedAt ?? "today"} — deliverables will appear below as they become available.`}
    >
      <WaitingDeliverable
        title="Your Video"
        placeholder="Video will appear here soon"
      />
      <WaitingDeliverable
        title="Your Money"
        placeholder={
          state.scanResult
            ? `PayPal — ${state.scanResult.quoteUsd} $ — Status: pending`
            : "Status: pending"
        }
      />
      <WaitingDeliverable
        title="Your Certificate"
        placeholder="Certificate will appear here soon (PDF)"
      />

      <p className="text-muted-foreground" style={typography.bodySmall}>
        Stored in My Devices — revisit anytime from the bottom bar.
      </p>
    </StepShell>
  );
}

function WaitingDeliverable({
  title,
  placeholder,
}: {
  title: string;
  placeholder: string;
}) {
  return (
    <div className="rounded-md border border-border bg-secondary/30 px-4 py-3">
      <p className="text-foreground" style={typography.status}>
        {title}
      </p>
      <p className="mt-1 text-muted-foreground" style={typography.bodyMedium}>
        {placeholder}
      </p>
    </div>
  );
}

function ConsentRow({
  id,
  label,
  checked,
  onCheckedChange,
  required = false,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        className="mt-0.5"
        required={required}
      />
      <Label htmlFor={id} className="text-muted-foreground" style={typography.bodyMedium}>
        {label}
      </Label>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} style={typography.bodySmall}>
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-lg border-border bg-background"
        style={typography.bodyMedium}
      />
    </div>
  );
}
