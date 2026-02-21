"use client";

import * as React from "react";
import { TOUR_STEPS, type TourStep } from "../tour-steps";

function toSubdomain(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export type SignupPhase = "instruction" | "active";

type TourContextValue = {
  stepIndex: number;
  step: TourStep | null;
  totalSteps: number;
  canGoBack: boolean;
  canGoNext: boolean;
  goNext: () => void;
  goBack: () => void;
  setStepIndex: (index: number) => void;
  /** Step 1: user-typed club name (mock); background form shows this */
  tourClubName: string;
  setTourClubName: (name: string) => void;
  /** Derived from tourClubName for display */
  tourSubdomain: string;
  /** Signup step: 'instruction' = modal with Next; 'active' = modal closed, form interactive */
  signupPhase: SignupPhase;
  setSignupPhase: (phase: SignupPhase) => void;
};

const TourContext = React.createContext<TourContextValue | null>(null);

export function TourProvider({
  children,
  steps = TOUR_STEPS,
}: {
  children: React.ReactNode;
  steps?: TourStep[];
}) {
  const [stepIndex, setStepIndexState] = React.useState(0);
  const [tourClubName, setTourClubNameState] = React.useState("");
  const [signupPhase, setSignupPhaseState] = React.useState<SignupPhase>("instruction");
  const prevStepIndexRef = React.useRef(stepIndex);
  const totalSteps = steps.length;
  const step = steps[stepIndex] ?? null;
  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < totalSteps - 1;
  const tourSubdomain = React.useMemo(
    () => (tourClubName.trim() ? toSubdomain(tourClubName.trim()) : ""),
    [tourClubName]
  );

  const setTourClubName = React.useCallback((name: string) => {
    setTourClubNameState(name);
  }, []);

  const setSignupPhase = React.useCallback((phase: SignupPhase) => {
    setSignupPhaseState(phase);
  }, []);

  // When navigating back onto the signup step, show the instruction modal again.
  React.useEffect(() => {
    if (stepIndex === 1 && prevStepIndexRef.current !== 1) {
      setSignupPhaseState("instruction");
    }
    prevStepIndexRef.current = stepIndex;
  }, [stepIndex]);

  const goNext = React.useCallback(() => {
    setStepIndexState((i) => Math.min(i + 1, totalSteps - 1));
  }, [totalSteps]);

  const goBack = React.useCallback(() => {
    setStepIndexState((i) => Math.max(i - 1, 0));
  }, []);

  const setStepIndex = React.useCallback((index: number) => {
    setStepIndexState((i) => Math.max(0, Math.min(index, totalSteps - 1)));
  }, [totalSteps]);

  const value: TourContextValue = React.useMemo(
    () => ({
      stepIndex,
      step,
      totalSteps,
      canGoBack,
      canGoNext,
      goNext,
      goBack,
      setStepIndex,
      tourClubName,
      setTourClubName,
      tourSubdomain,
      signupPhase,
      setSignupPhase,
    }),
    [
      stepIndex,
      step,
      totalSteps,
      canGoBack,
      canGoNext,
      goNext,
      goBack,
      setStepIndex,
      tourClubName,
      setTourClubName,
      tourSubdomain,
      signupPhase,
      setSignupPhase,
    ]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour() {
  const ctx = React.useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}
