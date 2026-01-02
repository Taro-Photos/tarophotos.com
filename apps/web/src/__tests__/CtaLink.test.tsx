import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createRef, type MouseEvent, type ReactNode, type Ref } from "react";

import { CtaLink } from "@/components/atoms/CtaLink";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, onClick, ref, ...rest }: { href: string; children: ReactNode; onClick?: (event: MouseEvent<HTMLAnchorElement>) => void } & Record<string, unknown>) => {
    return (
      <a
        href={href}
        ref={ref as Ref<HTMLAnchorElement> | undefined}
        onClick={(event) => {
          event.preventDefault();
          onClick?.(event);
        }}
        {...(rest as Record<string, unknown>)}
      >
        {children}
      </a>
    );
  },
}));

vi.mock("@/app/_lib/analytics", () => ({
  pushAnalyticsEvent: vi.fn(),
}));

describe("CtaLink", () => {
  it("fires analytics events and forwards click handlers", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <CtaLink
        href="/works"
        fullWidth
        analytics={{ name: "cta_click", params: { location: "footer", label: "Works" } }}
        onClick={onClick}
      >
        Worksを見る
      </CtaLink>,
    );

    const link = screen.getByRole("link", { name: "Worksを見る" });
    expect(link).toHaveClass("w-full");

    await user.click(link);

    expect(pushAnalyticsEvent).toHaveBeenCalledWith({
      name: "cta_click",
      params: { location: "footer", label: "Works" },
    });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards refs to the underlying anchor", () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <CtaLink href="/works" ref={ref}>
        Works
      </CtaLink>,
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current).toHaveAttribute("href", "/works");
  });
});
