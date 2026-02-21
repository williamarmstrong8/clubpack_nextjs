"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { recordTourLead } from "../actions";
import { useTour } from "../context/tour-context";

export function TourModal() {
  const {
    step,
    stepIndex,
    totalSteps,
    canGoBack,
    canGoNext,
    goBack,
    goNext,
    signupPhase,
    setSignupPhase,
  } = useTour();

  const [isExiting, setIsExiting] = React.useState(false);
  const pendingActionRef = React.useRef<(() => void) | null>(null);
  const fadeInDelayRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [welcomeName, setWelcomeName] = React.useState("");
  const [welcomeEmail, setWelcomeEmail] = React.useState("");

  // Match background transition (tour-background uses 0.35s exit then enter) — applied to all steps
  const FADE_DURATION = 0.35;
  const BACKGROUND_EXIT_DURATION_MS = 350;

  React.useEffect(() => {
    return () => {
      if (fadeInDelayRef.current) clearTimeout(fadeInDelayRef.current);
    };
  }, []);

  if (!step) return null;

  // Signup step, active phase: modal is closed so they can use the form on the page.
  const isSignupStepActive = step.view === "signup" && signupPhase === "active";
  if (isSignupStepActive) return null;

  const isLastStep = !canGoNext;
  const isSignupStep = step.view === "signup";
  const isWelcomeStep = step.id === "welcome";
  const nextLabel = isWelcomeStep ? "Begin tour" : "Next";

  const handleNext = async () => {
    if (isSignupStep) {
      setSignupPhase("active");
    } else {
      if (isWelcomeStep) {
        await recordTourLead(welcomeName, welcomeEmail);
      }
      pendingActionRef.current = goNext;
      setIsExiting(true);
    }
  };

  const handleBack = () => {
    pendingActionRef.current = goBack;
    setIsExiting(true);
  };

  const handleFadeOutComplete = () => {
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
    // Delay modal fade-in so it syncs with the new background view on every step
    fadeInDelayRef.current = setTimeout(() => {
      fadeInDelayRef.current = null;
      setIsExiting(false);
    }, BACKGROUND_EXIT_DURATION_MS);
  };

  return (
    <motion.div
      className={`relative z-50 mx-4 w-full max-w-lg shrink-0 ${isExiting ? "pointer-events-none" : "pointer-events-auto"}`}
      initial={false}
      animate={{
        opacity: isExiting ? 0 : 1,
        scale: isExiting ? 0.98 : 1,
      }}
      transition={{ duration: FADE_DURATION, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (pendingActionRef.current) {
          handleFadeOutComplete();
        }
      }}
    >
      <Card className="rounded-xl border-2 shadow-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="text-xs font-medium text-muted-foreground">
            Step {stepIndex + 1} of {totalSteps}
          </div>
          <CardTitle className="text-xl">{step.title}</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {step.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {isWelcomeStep && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tour-welcome-name">Name</Label>
                <Input
                  id="tour-welcome-name"
                  type="text"
                  placeholder="Your name"
                  value={welcomeName}
                  onChange={(e) => setWelcomeName(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tour-welcome-email">Email</Label>
                <Input
                  id="tour-welcome-email"
                  type="email"
                  placeholder="you@example.com"
                  value={welcomeEmail}
                  onChange={(e) => setWelcomeEmail(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={!canGoBack}
            className="gap-1.5"
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <span className="text-sm text-muted-foreground">
            {stepIndex + 1} / {totalSteps}
          </span>
          {isLastStep ? (
            <Button asChild className="gap-1.5">
              <Link href="https://my.joinclubpack.com/signup">Get started</Link>
            </Button>
          ) : (
            <Button type="button" onClick={handleNext} className="gap-1.5">
              {nextLabel}
              <ChevronRight className="size-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
