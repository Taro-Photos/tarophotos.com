"use client";

import { forwardRef } from "react";
import { TrackedLink, type TrackedLinkProps } from "@/components/atoms/TrackedLink";

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3 uppercase transition-transform duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-soft)]";

const sizeClasses: Record<CtaLinkSize, string> = {
  md: "gap-3 text-sm tracking-[0.12em]",
  sm: "gap-2 text-xs tracking-[0.28em]",
};

const variantClasses: Record<CtaLinkVariant, string> = {
  accent:
    "bg-gradient-accent text-[var(--color-on-accent)] shadow-[0_18px_36px_-20px_rgba(7,75,100,0.55)] hover:-translate-y-[2px] hover:brightness-110",
  surface:
    "bg-gradient-accent-soft text-[var(--cta-surface-foreground)] shadow-[0_12px_30px_-24px_rgba(12,87,101,0.4)] hover:-translate-y-[2px] hover:text-[var(--cta-surface-foreground)] hover:brightness-105",
  outline:
    "relative border border-transparent text-[var(--color-foreground)] hover:-translate-y-[2px] hover:text-[var(--color-foreground)] [background:linear-gradient(var(--color-surface),var(--color-surface))_padding-box,linear-gradient(135deg,rgba(31,154,245,0.55),rgba(11,117,106,0.6))_border-box] hover:[background:linear-gradient(var(--color-surface),var(--color-surface))_padding-box,linear-gradient(135deg,rgba(31,154,245,0.72),rgba(11,117,106,0.78))_border-box]",
  outlineOnAccent:
    "border border-transparent text-[var(--color-on-accent)] hover:-translate-y-[2px] hover:text-[var(--color-on-accent)] [background:linear-gradient(transparent,transparent)_padding-box,linear-gradient(135deg,rgba(255,255,255,0.7),rgba(242,253,250,0.3))_border-box] hover:[background:linear-gradient(transparent,transparent)_padding-box,linear-gradient(135deg,rgba(255,255,255,0.82),rgba(242,253,250,0.52))_border-box]",
};

type CtaLinkVariant = "accent" | "surface" | "outline" | "outlineOnAccent";
type CtaLinkSize = "md" | "sm";

export type CtaLinkProps = TrackedLinkProps & {
  fullWidth?: boolean;
  size?: CtaLinkSize;
  variant?: CtaLinkVariant;
};

export const CtaLink = forwardRef<HTMLAnchorElement, CtaLinkProps>(
  ({ children, className, fullWidth = false, size = "sm", variant = "accent", ...rest }, ref) => {
    const composedClassName = mergeClasses(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      fullWidth ? "w-full" : "w-fit",
      className,
    );

    return (
      <TrackedLink ref={ref} className={composedClassName} {...rest}>
        {children}
      </TrackedLink>
    );
  },
);

CtaLink.displayName = "CtaLink";

function mergeClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
