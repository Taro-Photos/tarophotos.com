import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { createRef, type ReactNode, type Ref } from "react";

const linkSpy = vi.fn();
const analyticsSpy = vi.fn();

vi.mock("next/link", () => ({
  __esModule: true,
  default: (props: { children: ReactNode } & Record<string, unknown>) => {
    const { children, ...rest } = props;
    const { passHref, legacyBehavior, ref, ...filtered } = rest;
    void passHref;
    void legacyBehavior;
    linkSpy(filtered);
    return (
      <a
        data-role="next-link"
        ref={ref as Ref<HTMLAnchorElement> | undefined}
        {...(filtered as Record<string, unknown>)}
      >
        {children}
      </a>
    );
  },
}));

vi.mock("@/app/_lib/analytics", () => ({
  pushAnalyticsEvent: (...args: unknown[]) => analyticsSpy(...args),
}));

import { TrackedLink } from "@/components/atoms/TrackedLink";

describe("TrackedLink", () => {
  beforeEach(() => {
    linkSpy.mockClear();
    analyticsSpy.mockClear();
  });

  it("uses Next.js Link for internal hrefs and emits analytics", async () => {
    const user = userEvent.setup();

    render(
      <TrackedLink href="/works" analytics={{ name: "cta_click", params: { location: "hero", label: "Works" } }}>
        Works
      </TrackedLink>,
    );

    const link = screen.getByRole("link", { name: "Works" });
    expect(link).toHaveAttribute("href", "/works");
    expect(linkSpy).toHaveBeenCalledTimes(1);

    await user.click(link);
    expect(analyticsSpy).toHaveBeenCalledWith({
      name: "cta_click",
      params: { location: "hero", label: "Works" },
    });
  });

  it("falls back to native anchor for external hrefs", () => {
    render(
      <TrackedLink href="https://example.com" target="_blank" rel="noopener">
        External
      </TrackedLink>,
    );

    const link = screen.getByRole("link", { name: "External" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).not.toHaveAttribute("data-role");
    expect(linkSpy).not.toHaveBeenCalled();
  });

  it("forwards refs to the rendered element", () => {
    const internalRef = createRef<HTMLAnchorElement>();
    const externalRef = createRef<HTMLAnchorElement>();

    render(
      <>
        <TrackedLink href="/services" ref={internalRef}>
          Internal
        </TrackedLink>
        <TrackedLink href="https://example.com" ref={externalRef}>
          External
        </TrackedLink>
      </>,
    );

    expect(internalRef.current).toBeInstanceOf(HTMLAnchorElement);
    expect(internalRef.current).toHaveAttribute("href", "/services");
    expect(externalRef.current).toBeInstanceOf(HTMLAnchorElement);
    expect(externalRef.current).toHaveAttribute("href", "https://example.com");
  });
});
