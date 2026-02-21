"use client";

import { useEffect } from "react";
import { TourProvider, useTour } from "./context/tour-context";
import { TourBackground } from "./components/tour-background";
import { TourModal } from "./components/tour-modal";

function TourContentInner() {
  const { stepIndex, signupPhase } = useTour();
  const isSignupInstruction = stepIndex === 1 && signupPhase === "instruction";
  const isSignupActive = stepIndex === 1 && signupPhase === "active";

  // When signup is active, user interacts with the form; otherwise block background.
  const overlayBlocks = !isSignupActive;
  const backgroundInteractive = isSignupActive;

  // Prevent Escape (or other keys) from closing/exiting the tour; only Next/Back and final CTA are valid.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-muted/20">
      {/* Background: when signup active, interactive so they can type and click Create club */}
      <div
        className={`absolute inset-0 select-none ${backgroundInteractive ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <TourBackground />
      </div>

      {/* Overlay: above admin sidebar (z-10) so the same dim covers entire UI; when signup active, hidden and non-blocking */}
      <div
        className={`absolute inset-0 z-[20] transition-opacity duration-200 ${
          isSignupActive ? "pointer-events-none opacity-0" : "pointer-events-auto bg-black/10"
        }`}
        aria-hidden
      />

      {/* Modal: above overlay */}
      <div
        className={`relative z-[30] flex min-h-dvh w-full flex-col p-4 ${
          isSignupInstruction
            ? "items-start justify-center"
            : "items-center justify-center"
        } ${isSignupActive ? "pointer-events-none" : ""}`}
      >
        <TourModal />
      </div>
    </div>
  );
}

export default function TourPage() {
  return (
    <TourProvider>
      <TourContentInner />
    </TourProvider>
  );
}
