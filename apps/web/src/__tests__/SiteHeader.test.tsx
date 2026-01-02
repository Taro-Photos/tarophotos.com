import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { SiteHeader } from "@/components/organisms/SiteHeader";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/contact",
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, onClick, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...rest}
      href={typeof href === "string" ? href : ""}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        event.preventDefault();
      }}
    >
      {children}
    </a>
  ),
}));

vi.mock("@/app/_lib/analytics", () => ({
  pushAnalyticsEvent: vi.fn(),
}));

describe("SiteHeader", () => {
  beforeEach(() => {
    vi.mocked(pushAnalyticsEvent).mockClear();
    document.body.style.overflow = "";
  });

  it("toggles the mobile menu and emits analytics when navigating", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const toggleButton = screen.getByRole("button", { name: "Toggle navigation" });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    expect(document.body.style.overflow).toBe("hidden");

    const mobileNav = screen.getByRole("dialog", { name: "Mobile navigation" });
    const worksLink = within(mobileNav).getByRole("link", { name: "works" });

    await user.click(worksLink);

    expect(pushAnalyticsEvent).toHaveBeenCalledWith({
      name: "cta_click",
      params: { location: "site_header", label: "works" },
    });

    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");
    expect(screen.queryByRole("dialog", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("highlights the active desktop link based on the current path", () => {
    render(<SiteHeader />);

    const contactLink = screen.getAllByRole("link", { name: "contact" })[0];
    expect(contactLink.className).toContain("bg-gradient-accent");
  });
});
