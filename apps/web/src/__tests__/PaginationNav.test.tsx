import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { PaginationNav } from "@/components/molecules/PaginationNav";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

vi.mock("@/app/_lib/analytics", () => ({
  pushAnalyticsEvent: vi.fn(),
}));

describe("PaginationNav", () => {
  beforeEach(() => {
    vi.mocked(pushAnalyticsEvent).mockReset();
  });

  it("invokes analytics when navigating prev/next", async () => {
    const user = userEvent.setup();
    render(
      <PaginationNav
        prevHref="/works?page=1"
        nextHref="/works?page=3"
        currentPage={2}
        totalPages={5}
      />,
    );

    await user.click(screen.getByRole("link", { name: "← Prev" }));
    expect(pushAnalyticsEvent).toHaveBeenCalledWith({ name: "paginate", params: { page: 1 } });

    await user.click(screen.getByRole("link", { name: "Next →" }));
    expect(pushAnalyticsEvent).toHaveBeenLastCalledWith({ name: "paginate", params: { page: 3 } });
  });

  it("renders disabled affordances when edge links are missing", () => {
    render(<PaginationNav currentPage={1} totalPages={1} />);

    expect(screen.getByText("← Prev").closest("a")).toBeNull();
    expect(screen.getByText("Next →").closest("a")).toBeNull();
  });
});
