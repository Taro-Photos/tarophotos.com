import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const ctaRenderSpy = vi.fn();

vi.mock("@/components/atoms/CtaLink", () => ({
  CtaLink: ({ children, href, analytics }: { children: ReactNode; href: string; analytics?: unknown }) => {
    ctaRenderSpy({ href, analytics });
    return (
      <a href={href} data-analytics={JSON.stringify(analytics)}>
        {children}
      </a>
    );
  },
}));

import { CtaBanner } from "@/components/organisms/CtaBanner";

describe("CtaBanner", () => {
  afterEach(() => {
    ctaRenderSpy.mockClear();
  });

  it("renders primary CTA and forwards analytics props", async () => {
    const user = userEvent.setup();

    render(
      <CtaBanner
        eyebrow="Contact"
        heading="テストCTA"
        copy="説明"
        primaryCta={{ label: "相談する", href: "/booking" }}
      />,
    );

    expect(screen.getByText("テストCTA")).toBeInTheDocument();
    const primary = screen.getByRole("link", { name: "相談する" });
    expect(primary).toHaveAttribute("href", "/booking");
    expect(ctaRenderSpy).toHaveBeenCalledWith({
      href: "/booking",
      analytics: {
        name: "cta_click",
        params: { location: "cta_banner_primary", label: "相談する" },
      },
    });

    await user.click(primary);
  });

  it("optionally renders secondary CTA", () => {
    render(
      <CtaBanner
        eyebrow="Contact"
        heading="二次CTA"
        copy="説明"
        primaryCta={{ label: "相談する", href: "/booking" }}
        secondaryCta={{ label: "Worksを見る", href: "/works" }}
      />,
    );

    expect(screen.getByRole("link", { name: "Worksを見る" })).toHaveAttribute("href", "/works");
    expect(ctaRenderSpy).toHaveBeenCalledWith({
      href: "/works",
      analytics: {
        name: "cta_click",
        params: { location: "cta_banner_secondary", label: "Worksを見る" },
      },
    });
  });
});
