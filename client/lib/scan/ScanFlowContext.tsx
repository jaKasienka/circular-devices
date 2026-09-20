import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  buildFreshScanBootstrap,
  buildScanBootstrap,
} from "@/lib/devices/device-flow-presets";
import { MOCK_DEVICES } from "@/lib/devices/mock-devices";
import {
  getNextStep,
  getPhaseForStep,
  isPhaseComplete,
  SCAN_PHASES,
} from "./flow-config";
import {
  clearAllDeviceFlows,
  clearDeviceFlow,
  readDeviceFlow,
  writeDeviceFlow,
} from "./flow-storage";
import {
  formatShippedDate,
  getNextSealDeliveryStatus,
  getSealDeliveryDelayMs,
  getShipmentPickupDelayMs,
} from "./logistics-mock";
import type {
  CompletedStepRecord,
  ScanFlowState,
  ScanPhaseId,
  ScanResult,
  ScanStepId,
  SealDeliveryStatus,
  SealOrder,
  ShipmentPreferences,
  ShipmentStatus,
} from "./types";

const LEGACY_STORAGE_KEY = "circular-scan-flow";

function clearStoredFlowsOnPageReload() {
  if (typeof window === "undefined") {
    return;
  }

  const [navigation] = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];

  if (navigation?.type === "reload") {
    clearAllDeviceFlows();
  }
}

const INITIAL_STATE: ScanFlowState = {
  activePhase: "scan",
  activeStep: "scan-instructions",
  completedSteps: {},
  viewingCompletedPhase: null,
  scanResult: null,
  scanResultMode: "choice",
  linkedDeviceId: null,
  sealOrder: null,
  shipmentPreferences: null,
  sealDeliveryStatus: "idle",
  shipmentStatus: "idle",
  sealDaysRemaining: 30,
  shippedAt: null,
};

function normalizeStoredState(raw: Partial<ScanFlowState>): ScanFlowState {
  const merged = { ...INITIAL_STATE, ...raw };

  if (merged.activeStep === ("seal-ordered" as ScanStepId)) {
    merged.activeStep = "seal-form";
  }

  if (
    merged.activeStep === "seal-wait" &&
    !merged.completedSteps["seal-review"] &&
    !merged.sealOrder
  ) {
    merged.activeStep = "seal-form";
    merged.sealDeliveryStatus = "idle";
  }

  if (
    merged.activeStep === "seal-wait" &&
    merged.sealOrder &&
    !merged.completedSteps["seal-review"]
  ) {
    merged.activeStep = "seal-review";
    merged.sealDeliveryStatus = "idle";
  }

  if (
    (merged.activeStep === "ship-qr" || merged.activeStep === "ship-success") &&
    merged.shipmentPreferences &&
    !merged.completedSteps["ship-review"]
  ) {
    merged.activeStep = "ship-review";
    merged.shipmentStatus = "idle";
  }

  if (merged.activeStep === ("audit-complete" as ScanStepId)) {
    merged.activeStep = "audit-waiting";
  }
  if (merged.activeStep === ("seal-instructions" as ScanStepId)) {
    merged.activeStep = "seal-arrived";
  }

  if (merged.scanResultMode === undefined) {
    merged.scanResultMode = "choice";
  }
  if (merged.linkedDeviceId === undefined) {
    merged.linkedDeviceId = null;
  }

  if (
    merged.shipmentPreferences &&
    !("handlingConsents" in merged.shipmentPreferences)
  ) {
    const legacy = merged.shipmentPreferences as ShipmentPreferences & {
      logisticsConsent?: boolean;
    };
    merged.shipmentPreferences = {
      pickupSameAsSeal: true,
      pickup: legacy.pickup,
      notifyLivestream: legacy.notifyLivestream,
      paymentMethod: legacy.paymentMethod,
      handlingConsents: {
        logisticsHandling: legacy.logisticsConsent ?? false,
        recordHandlingVideo: legacy.notifyLivestream ?? false,
        certifiedDataErasure: false,
        deviceRecycling: true,
      },
    };
  }

  return merged;
}

function resolveEntryState(
  bootstrapDeviceId: string | null,
  freshEntry: boolean,
): ScanFlowState {
  if (!bootstrapDeviceId) {
    return INITIAL_STATE;
  }

  const device = MOCK_DEVICES.find((entry) => entry.id === bootstrapDeviceId);
  if (!device || device.status === "completed") {
    return INITIAL_STATE;
  }

  if (freshEntry) {
    clearDeviceFlow(device.id);
    return buildFreshScanBootstrap(device);
  }

  const saved = readDeviceFlow(bootstrapDeviceId);
  if (saved) {
    return normalizeStoredState(saved);
  }

  return buildScanBootstrap(device);
}

type ScanFlowContextValue = {
  state: ScanFlowState;
  completeStep: (stepId: ScanStepId, summary: string) => void;
  goToStep: (stepId: ScanStepId) => void;
  selectPhase: (phaseId: ScanPhaseId) => void;
  clearCompletedView: () => void;
  setScanResult: (result: ScanResult) => void;
  setSealOrder: (order: SealOrder) => void;
  setShipmentPreferences: (preferences: ShipmentPreferences) => void;
  startSealDeliveryTracking: () => void;
  continueFromSealIntro: () => void;
  saveSealDeliveryAddress: (order: SealOrder) => void;
  placeSealOrder: () => void;
  editSealDeliveryAddress: () => void;
  saveShipmentDraft: (preferences: ShipmentPreferences) => void;
  generateShippingLabel: () => void;
  editShipmentConfiguration: () => void;
  startShipmentTracking: () => void;
  resetFlow: () => void;
  finishToDevices: () => void;
};

const ScanFlowContext = createContext<ScanFlowContextValue | null>(null);

function persistState(state: ScanFlowState) {
  if (state.linkedDeviceId) {
    writeDeviceFlow(state.linkedDeviceId, state);
  }
}

type ScanFlowProviderProps = {
  children: ReactNode;
  bootstrapDeviceId?: string | null;
  freshEntry?: boolean;
};

export function ScanFlowProvider({
  children,
  bootstrapDeviceId = null,
  freshEntry = false,
}: ScanFlowProviderProps) {
  const navigate = useNavigate();
  const [state, setState] = useState<ScanFlowState>(() => {
    sessionStorage.removeItem(LEGACY_STORAGE_KEY);
    clearStoredFlowsOnPageReload();
    return resolveEntryState(bootstrapDeviceId, freshEntry);
  });
  const sealTimerRef = useRef<number | null>(null);
  const shipmentTimerRef = useRef<number | null>(null);
  const entryKeyRef = useRef<string | null>(null);

  const updateState = useCallback(
    (updater: (current: ScanFlowState) => ScanFlowState) => {
      setState((current) => {
        const next = updater(current);
        persistState(next);
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    if (!bootstrapDeviceId) {
      return;
    }

    const entryKey = `${bootstrapDeviceId}:${freshEntry ? "fresh" : "resume"}`;
    if (entryKeyRef.current === entryKey) {
      return;
    }

    entryKeyRef.current = entryKey;
    const next = resolveEntryState(bootstrapDeviceId, freshEntry);
    setState(next);
    persistState(next);
  }, [bootstrapDeviceId, freshEntry]);

  const clearSealTimer = useCallback(() => {
    if (sealTimerRef.current !== null) {
      window.clearTimeout(sealTimerRef.current);
      sealTimerRef.current = null;
    }
  }, []);

  const clearShipmentTimer = useCallback(() => {
    if (shipmentTimerRef.current !== null) {
      window.clearTimeout(shipmentTimerRef.current);
      shipmentTimerRef.current = null;
    }
  }, []);

  const scheduleSealAdvance = useCallback(
    (status: SealDeliveryStatus) => {
      clearSealTimer();
      const nextStatus = getNextSealDeliveryStatus(status);
      if (!nextStatus) {
        return;
      }

      const delay = getSealDeliveryDelayMs(status);
      sealTimerRef.current = window.setTimeout(() => {
        updateState((current) => {
          const nextState: ScanFlowState = {
            ...current,
            sealDeliveryStatus: nextStatus,
          };

          if (
            nextStatus === "delivered" &&
            current.activeStep === "seal-wait"
          ) {
            nextState.completedSteps = {
              ...current.completedSteps,
              "seal-wait": {
                summary: "Logistics confirmed seal delivery.",
                completedAt: Date.now(),
              },
            };
            nextState.activeStep = "seal-arrived";
            nextState.activePhase = "seal";
            nextState.sealDaysRemaining = 24;
          }

          return nextState;
        });

        if (nextStatus !== "delivered") {
          scheduleSealAdvance(nextStatus);
        }
      }, delay);
    },
    [clearSealTimer, updateState],
  );

  const startSealDeliveryTracking = useCallback(() => {
    updateState((current) => ({
      ...current,
      sealDeliveryStatus: "ordered",
    }));
    scheduleSealAdvance("ordered");
  }, [scheduleSealAdvance, updateState]);

  const continueFromSealIntro = useCallback(() => {
    updateState((current) => {
      const now = Date.now();
      const completedSteps: Partial<
        Record<ScanStepId, CompletedStepRecord>
      > = {
        ...current.completedSteps,
        "seal-intro": {
          summary: "Reviewed tamper-evident seal requirements.",
          completedAt: now,
        },
      };

      if (!current.sealOrder) {
        delete completedSteps["seal-form"];
        delete completedSteps["seal-review"];
        delete completedSteps["seal-wait"];
      }

      return {
        ...current,
        completedSteps,
        activeStep: "seal-form",
        activePhase: "seal",
        sealDeliveryStatus: "idle",
        viewingCompletedPhase: null,
      };
    });
  }, [updateState]);

  const saveSealDeliveryAddress = useCallback(
    (order: SealOrder) => {
      const now = Date.now();
      updateState((current) => ({
        ...current,
        sealOrder: order,
        sealDeliveryStatus: "idle",
        completedSteps: {
          ...current.completedSteps,
          "seal-intro":
            current.completedSteps["seal-intro"] ?? {
              summary: "Reviewed tamper-evident seal requirements.",
              completedAt: now,
            },
          "seal-form": {
            summary: `Delivery address saved for ${order.city}, ${order.country}.`,
            completedAt: now,
          },
        },
        activeStep: "seal-review",
        activePhase: "seal",
        viewingCompletedPhase: null,
      }));
    },
    [updateState],
  );

  const editSealDeliveryAddress = useCallback(() => {
    updateState((current) => ({
      ...current,
      activeStep: "seal-form",
      activePhase: "seal",
      viewingCompletedPhase: null,
    }));
  }, [updateState]);

  const placeSealOrder = useCallback(() => {
    updateState((current) => {
      if (!current.sealOrder) {
        return current;
      }

      const now = Date.now();
      const order = current.sealOrder;

      return {
        ...current,
        sealDeliveryStatus: "ordered",
        completedSteps: {
          ...current.completedSteps,
          "seal-review": {
            summary: `Seal order placed — shipping to ${order.city}, ${order.country}.`,
            completedAt: now,
          },
        },
        activeStep: "seal-wait",
        activePhase: "seal",
        viewingCompletedPhase: null,
      };
    });
    scheduleSealAdvance("ordered");
  }, [scheduleSealAdvance, updateState]);

  const startShipmentTracking = useCallback(() => {
    clearShipmentTimer();
    updateState((current) => ({
      ...current,
      shipmentStatus: "awaiting_pickup",
    }));

    shipmentTimerRef.current = window.setTimeout(() => {
      updateState((current) => ({
        ...current,
        shipmentStatus: "picked_up",
      }));
      shipmentTimerRef.current = null;
    }, getShipmentPickupDelayMs());
  }, [clearShipmentTimer, updateState]);

  useEffect(
    () => () => {
      clearSealTimer();
      clearShipmentTimer();
    },
    [clearSealTimer, clearShipmentTimer],
  );

  useEffect(() => {
    const { sealDeliveryStatus, shipmentStatus } = state;

    if (
      sealDeliveryStatus !== "idle" &&
      sealDeliveryStatus !== "delivered" &&
      sealTimerRef.current === null
    ) {
      scheduleSealAdvance(sealDeliveryStatus);
    }

    if (shipmentStatus === "awaiting_pickup" && shipmentTimerRef.current === null) {
      shipmentTimerRef.current = window.setTimeout(() => {
        updateState((current) => ({
          ...current,
          shipmentStatus: "picked_up",
        }));
        shipmentTimerRef.current = null;
      }, getShipmentPickupDelayMs());
    }
  }, [scheduleSealAdvance, state.sealDeliveryStatus, state.shipmentStatus, updateState]);

  const completeStep = useCallback(
    (stepId: ScanStepId, summary: string) => {
      updateState((current) => {
        const completedSteps: Partial<Record<ScanStepId, CompletedStepRecord>> =
          {
            ...current.completedSteps,
            [stepId]: { summary, completedAt: Date.now() },
          };

        const nextStep = getNextStep(stepId);
        const activeStep = nextStep ?? stepId;
        const activePhase = nextStep
          ? getPhaseForStep(nextStep)
          : getPhaseForStep(stepId);

        const nextState: ScanFlowState = {
          ...current,
          completedSteps,
          activeStep,
          activePhase,
          viewingCompletedPhase: null,
        };

        if (stepId === "ship-qr") {
          nextState.shippedAt = formatShippedDate(new Date());
        }

        return nextState;
      });
    },
    [updateState],
  );

  const goToStep = useCallback(
    (stepId: ScanStepId) => {
      updateState((current) => ({
        ...current,
        activeStep: stepId,
        activePhase: getPhaseForStep(stepId),
        viewingCompletedPhase: null,
      }));
    },
    [updateState],
  );

  const selectPhase = useCallback(
    (phaseId: ScanPhaseId) => {
      updateState((current) => {
        if (isPhaseComplete(phaseId, current.completedSteps)) {
          return {
            ...current,
            viewingCompletedPhase: phaseId,
          };
        }

        const phase = SCAN_PHASES.find((entry) => entry.id === phaseId);
        const firstIncomplete =
          phase?.steps.find((stepId) => !current.completedSteps[stepId]) ??
          phase?.steps[0];

        if (!firstIncomplete) {
          return current;
        }

        return {
          ...current,
          activePhase: phaseId,
          activeStep: firstIncomplete,
          viewingCompletedPhase: null,
        };
      });
    },
    [updateState],
  );

  const clearCompletedView = useCallback(() => {
    updateState((current) => ({
      ...current,
      viewingCompletedPhase: null,
    }));
  }, [updateState]);

  const setScanResult = useCallback(
    (scanResult: ScanResult) => {
      updateState((current) => ({ ...current, scanResult }));
    },
    [updateState],
  );

  const setSealOrder = useCallback(
    (sealOrder: SealOrder) => {
      updateState((current) => ({ ...current, sealOrder }));
    },
    [updateState],
  );

  const setShipmentPreferences = useCallback(
    (shipmentPreferences: ShipmentPreferences) => {
      updateState((current) => ({ ...current, shipmentPreferences }));
    },
    [updateState],
  );

  const saveShipmentDraft = useCallback(
    (preferences: ShipmentPreferences) => {
      const now = Date.now();
      updateState((current) => ({
        ...current,
        shipmentPreferences: preferences,
        shipmentStatus: "idle",
        completedSteps: {
          ...current.completedSteps,
          "ship-configure": {
            summary: `Shipment options saved — pickup at ${preferences.pickup.city}.`,
            completedAt: now,
          },
        },
        activeStep: "ship-review",
        activePhase: "ship",
        viewingCompletedPhase: null,
      }));
    },
    [updateState],
  );

  const editShipmentConfiguration = useCallback(() => {
    updateState((current) => ({
      ...current,
      activeStep: "ship-configure",
      activePhase: "ship",
      viewingCompletedPhase: null,
    }));
  }, [updateState]);

  const generateShippingLabel = useCallback(() => {
    updateState((current) => {
      if (!current.shipmentPreferences) {
        return current;
      }

      const now = Date.now();
      const pickup = current.shipmentPreferences.pickup;

      return {
        ...current,
        shipmentStatus: "awaiting_pickup",
        completedSteps: {
          ...current.completedSteps,
          "ship-review": {
            summary: `Shipping label generated — pickup at ${pickup.city}.`,
            completedAt: now,
          },
        },
        activeStep: "ship-qr",
        activePhase: "ship",
        viewingCompletedPhase: null,
      };
    });

    clearShipmentTimer();
    shipmentTimerRef.current = window.setTimeout(() => {
      updateState((current) => ({
        ...current,
        shipmentStatus: "picked_up",
      }));
      shipmentTimerRef.current = null;
    }, getShipmentPickupDelayMs());
  }, [clearShipmentTimer, updateState]);

  const resetFlow = useCallback(() => {
    clearSealTimer();
    clearShipmentTimer();
    clearAllDeviceFlows();
    setState(INITIAL_STATE);
  }, [clearSealTimer, clearShipmentTimer]);

  const finishToDevices = useCallback(() => {
    navigate("/devices");
  }, [navigate]);

  const value = useMemo(
    () => ({
      state,
      completeStep,
      goToStep,
      selectPhase,
      clearCompletedView,
      setScanResult,
      setSealOrder,
      setShipmentPreferences,
      startSealDeliveryTracking,
      continueFromSealIntro,
      saveSealDeliveryAddress,
      placeSealOrder,
      editSealDeliveryAddress,
      saveShipmentDraft,
      generateShippingLabel,
      editShipmentConfiguration,
      startShipmentTracking,
      resetFlow,
      finishToDevices,
    }),
    [
      state,
      completeStep,
      goToStep,
      selectPhase,
      clearCompletedView,
      setScanResult,
      setSealOrder,
      setShipmentPreferences,
      startSealDeliveryTracking,
      continueFromSealIntro,
      saveSealDeliveryAddress,
      placeSealOrder,
      editSealDeliveryAddress,
      saveShipmentDraft,
      generateShippingLabel,
      editShipmentConfiguration,
      startShipmentTracking,
      resetFlow,
      finishToDevices,
    ],
  );

  return (
    <ScanFlowContext.Provider value={value}>{children}</ScanFlowContext.Provider>
  );
}

export function useScanFlow() {
  const context = useContext(ScanFlowContext);
  if (!context) {
    throw new Error("useScanFlow must be used within ScanFlowProvider");
  }
  return context;
}
