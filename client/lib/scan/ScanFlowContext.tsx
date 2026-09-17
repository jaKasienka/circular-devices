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
  getNextStep,
  getPhaseForStep,
  isPhaseComplete,
  SCAN_PHASES,
} from "./flow-config";
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

const STORAGE_KEY = "circular-scan-flow";

const INITIAL_STATE: ScanFlowState = {
  activePhase: "scan",
  activeStep: "scan-instructions",
  completedSteps: {},
  viewingCompletedPhase: null,
  scanResult: null,
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
    merged.activeStep = "seal-wait";
  }
  if (merged.activeStep === ("audit-complete" as ScanStepId)) {
    merged.activeStep = "audit-waiting";
  }
  if (merged.activeStep === ("seal-instructions" as ScanStepId)) {
    merged.activeStep = "seal-arrived";
  }

  return merged;
}

function readStoredState(): ScanFlowState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_STATE;
    }
    return normalizeStoredState(JSON.parse(raw) as Partial<ScanFlowState>);
  } catch {
    return INITIAL_STATE;
  }
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
  startShipmentTracking: () => void;
  resetFlow: () => void;
  finishToDevices: () => void;
};

const ScanFlowContext = createContext<ScanFlowContextValue | null>(null);

function persistState(state: ScanFlowState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function ScanFlowProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<ScanFlowState>(() => readStoredState());
  const sealTimerRef = useRef<number | null>(null);
  const shipmentTimerRef = useRef<number | null>(null);

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

  const resetFlow = useCallback(() => {
    clearSealTimer();
    clearShipmentTimer();
    sessionStorage.removeItem(STORAGE_KEY);
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
