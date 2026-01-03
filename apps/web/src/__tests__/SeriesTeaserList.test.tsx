import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MouseEvent, ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { SeriesTeaserList } from "@/components/organisms/SeriesTeaserList";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

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

vi.mock("@/app/_lib/analytics", () => ({
  pushAnalyticsEvent: vi.fn(),
}));

describe("SeriesTeaserList", () => {
  beforeEach(() => {
    vi.mocked(pushAnalyticsEvent).mockReset();
  });

  it("emits analytics when a teaser is opened", async () => {
    const user = userEvent.setup();

    render(
      <SeriesTeaserList
        items={[
          {
            slug: "night-trails",
            title: "Night Trails",
            year: "2025",
            location: "Tokyo",
            summary: "City lights",
            cover: { src: "/night.jpg", alt: "Night", width: 1200, height: 900 },
          },
        ]}
      />,
    );

    await user.click(screen.getByRole("link", { name: /Night Trails/ }));
    expect(pushAnalyticsEvent).toHaveBeenCalledWith({ name: "view_series", params: { series_slug: "night-trails" } });
  });
});
