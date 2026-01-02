import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MouseEvent, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HeroTrailer } from "@/components/organisms/HeroTrailer";

const series = [
  {
    slug: "night-trails",
    title: "Night Trails",
    location: "Tokyo",
    images: [
      { src: "/night-1.jpg", alt: "Frame 1", width: 1200, height: 800 },
      { src: "/night-2.jpg", alt: "Frame 2", width: 1200, height: 800 },
    ],
  },
  {
    slug: "brisk-dawn",
    title: "Brisk Dawn",
    location: "Osaka",
    images: [
      { src: "/dawn-1.jpg", alt: "Dawn Frame", width: 1200, height: 800 },
    ],
  },
];

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mediaQuery = {
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addListener: (listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeListener: (listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    addEventListener: (_event: "change", listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_event: "change", listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    dispatchEvent: (event: MediaQueryListEvent) => {
      listeners.forEach((listener) => listener(event));
      return true;
  },
} satisfies MediaQueryList;

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue(mediaQuery),
  });

  return mediaQuery;
}

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, onClick, ...rest }: { href: string; children: ReactNode; onClick?: (event: MouseEvent<HTMLAnchorElement>) => void }) => (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </a>
  ),
}));

describe("HeroTrailer", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("rotates hero frames over time when animations are allowed", async () => {
    vi.useFakeTimers();
    mockMatchMedia(false);

    render(
      <HeroTrailer
        series={series}
        primaryCta={{ label: "依頼する", href: "/booking" }}
        secondaryCta={{ label: "作品を見る", href: "/works" }}
      />,
    );

    const firstFrame = screen.getByRole("img", { name: "Frame 1" });
    expect(firstFrame).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5200);
    });
    expect(screen.queryByRole("img", { name: "Frame 2" })).not.toBeNull();
  });

  it("stops rotation when reduced-motion is preferred", async () => {
    vi.useFakeTimers();
    const mediaQuery = mockMatchMedia(true);

    render(
      <HeroTrailer
        series={series}
        primaryCta={{ label: "依頼する", href: "/booking" }}
        secondaryCta={{ label: "作品を見る", href: "/works" }}
      />,
    );

    expect(mediaQuery.matches).toBe(true);
    const initialFrame = screen.getByRole("img", { name: "Frame 1" });
    expect(initialFrame).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5200 * 2);
    });
    expect(screen.queryByRole("img", { name: "Frame 2" })).toBeNull();
  });

  it("switches featured series on hover", async () => {
    mockMatchMedia(false);
    const user = userEvent.setup();

    render(
      <HeroTrailer
        series={series}
        primaryCta={{ label: "依頼する", href: "/booking" }}
        secondaryCta={{ label: "作品を見る", href: "/works" }}
      />,
    );

    const secondButton = screen.getByRole("button", { name: /Brisk Dawn/ });
    await user.hover(secondButton);

    const dawnFrame = await screen.findByRole("img", { name: "Dawn Frame" });
    expect(dawnFrame).toBeInTheDocument();
  });
});
