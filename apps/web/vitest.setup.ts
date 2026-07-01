import "@testing-library/jest-dom/vitest";
import React from "react";
import type { ImageProps } from "next/image";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImageProps) =>
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { src, alt, priority, fill, ...rest } = props;
    const resolvedSrc =
      typeof src === "string"
        ? src
        : typeof src === "object" && src !== null && "src" in src
          ? (src as { src: string }).src
          : "";
    return React.createElement("img", { ...rest, src: resolvedSrc, alt });
  },
}));

if (typeof window !== "undefined" && !window.matchMedia)
{
  // Provide a minimal matchMedia implementation for components that query media features.
  window.matchMedia = ((query: string) =>
  {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: (listener: (event: MediaQueryListEvent) => void) =>
      {
        listeners.add(listener);
      },
      removeListener: (listener: (event: MediaQueryListEvent) => void) =>
      {
        listeners.delete(listener);
      },
      addEventListener: (_: "change", listener: (event: MediaQueryListEvent) => void) =>
      {
        listeners.add(listener);
      },
      removeEventListener: (_: "change", listener: (event: MediaQueryListEvent) => void) =>
      {
        listeners.delete(listener);
      },
      dispatchEvent: () => false,
    };
  }) as typeof window.matchMedia;
}

if (typeof window !== "undefined" && !window.IntersectionObserver)
{
  class MockIntersectionObserver implements IntersectionObserver
  {
    readonly root: Element | Document | null = null;
    readonly rootMargin = "0px";
    readonly thresholds: ReadonlyArray<number> = [0];

    constructor(private readonly callback: IntersectionObserverCallback) { }

    observe(target: Element)
    {
      this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this);
    }

    unobserve() { }

    disconnect() { }

    takeRecords(): IntersectionObserverEntry[]
    {
      return [];
    }
  }

  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
