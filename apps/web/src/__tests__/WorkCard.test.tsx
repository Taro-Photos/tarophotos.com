import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MouseEvent, ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { WorkCard } from "@/components/molecules/WorkCard";
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

describe("WorkCard", () => {
  beforeEach(() => {
    vi.mocked(pushAnalyticsEvent).mockReset();
  });

  const series = {
    slug: "night-trails",
    title: "Night Trails",
    year: 2025,
    location: "Tokyo",
    palette: "color",
    focus: "urban",
    synopsis: "City lights",
    cover: { src: "/cover.jpg", alt: "Cover", width: 1200, height: 900 },
  } as const;

  it("tracks series views and tag filter clicks", async () => {
    const user = userEvent.setup();
    render(<WorkCard series={series} />);

    await user.click(screen.getByRole("link", { name: /シリーズを見る/ }));
    expect(pushAnalyticsEvent).toHaveBeenCalledWith({ name: "view_series", params: { series_slug: "night-trails" } });

    await user.click(screen.getByRole("link", { name: "Color" }));
    expect(pushAnalyticsEvent).toHaveBeenCalledWith({ name: "filter_change", params: { facet: "palette", value: "color" } });

    await user.click(screen.getByRole("link", { name: "Urban" }));
    expect(pushAnalyticsEvent).toHaveBeenLastCalledWith({ name: "filter_change", params: { facet: "focus", value: "urban" } });
  });
});
