"use client";

import type { ElementType, ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";

/* eslint-disable react-hooks/static-components */

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealSectionProps<T extends ElementType = "div"> = {
  as?: T;
  className?: string;
  children: ReactNode;
  delay?: number;
  margin?: RevealMargin;
  once?: boolean;
};

type RevealMarginUnit = `${number}${"px" | "%"}`;
type RevealMargin =
  | RevealMarginUnit
  | `${RevealMarginUnit} ${RevealMarginUnit}`
  | `${RevealMarginUnit} ${RevealMarginUnit} ${RevealMarginUnit}`
  | `${RevealMarginUnit} ${RevealMarginUnit} ${RevealMarginUnit} ${RevealMarginUnit}`;

export function RevealSection<T extends ElementType = "div">({
  as,
  className,
  children,
  delay = 0,
  margin = "0px 0px -10% 0px",
  once = true,
}: RevealSectionProps<T>) {
  const Component = as ?? "div";
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once, margin });

  const MotionComponent = useMemo(() => motion.create(Component), [Component]);

  const initial = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 12 };

  const animate = prefersReducedMotion || isInView
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 12 };

  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial={initial}
      animate={animate}
      transition={{
        duration: prefersReducedMotion ? 0.2 : 0.6,
        ease: EASE,
        delay: prefersReducedMotion ? 0 : delay,
      }}
    >
      {children}
    </MotionComponent>
  );
}
