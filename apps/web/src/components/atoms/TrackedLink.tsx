"use client";

import Link, { type LinkProps } from "next/link";
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { pushAnalyticsEvent, type AnalyticsEvent } from "@/app/_lib/analytics";

type AnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

export type TrackedLinkProps = LinkProps &
  AnchorProps & {
    children: ReactNode;
    analytics?: AnalyticsEvent;
  };

export const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>((props, ref) => {
  const {
    href,
    children,
    analytics,
    onClick,
    prefetch,
    replace,
    scroll,
    shallow,
    passHref,
    locale,
    legacyBehavior,
    ...anchorProps
  } = props;

  const isStringHref = typeof href === "string";
  const isRoutableLink = !isStringHref || (href as string).startsWith("/") || (href as string).startsWith("#");

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (analytics) {
      pushAnalyticsEvent(analytics);
    }

    if (onClick) {
      onClick(event);
    }
  };

  if (!isRoutableLink && isStringHref) {
    const { target, rel, ...restAnchorProps } = anchorProps;
    const isExternalHttp = /^https?:\/\//.test(href);

    const computedTarget = isExternalHttp ? target ?? "_blank" : target;

    let computedRel = rel;
    if (isExternalHttp) {
      const relTokens = new Set((rel ?? "").split(/\s+/).filter(Boolean));
      relTokens.add("noopener");
      relTokens.add("noreferrer");
      computedRel = Array.from(relTokens).join(" ") || undefined;
    }

    return (
      <a
        href={href}
        onClick={handleClick}
        target={computedTarget}
        rel={computedRel}
        ref={ref}
        {...restAnchorProps}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      locale={locale}
      legacyBehavior={legacyBehavior}
      ref={ref}
      {...anchorProps}
    >
      {children}
    </Link>
  );
});

TrackedLink.displayName = "TrackedLink";
