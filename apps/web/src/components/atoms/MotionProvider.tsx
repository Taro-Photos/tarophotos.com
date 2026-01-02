"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { usePrefersReducedMotion } from "@/app/_hooks/usePrefersReducedMotion";

type MotionProviderProps = {
  children: ReactNode;
};

export function MotionProvider({ children }: MotionProviderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"}>{children}</MotionConfig>
  );
}
