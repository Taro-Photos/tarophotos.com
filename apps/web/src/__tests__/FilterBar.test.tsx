import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { FilterBar } from "@/components/molecules/FilterBar";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

vi.mock("@/app/_lib/analytics", () => ({
  pushAnalyticsEvent: vi.fn(),
}));

describe("FilterBar", () => {
  beforeEach(() => {
    vi.mocked(pushAnalyticsEvent).mockClear();
  });

  it("emits analytics events when filters change", async () => {
    const user = userEvent.setup();
    render(
      <FilterBar
        years={[2025, 2024]}
        selectedYear="2025"
        selectedPalette="color"
        selectedFocus="urban"
      />,
    );

    const yearSelect = screen.getByLabelText(/Year/i);
    await user.selectOptions(yearSelect, "2024");
    expect(pushAnalyticsEvent).toHaveBeenNthCalledWith(1, {
      name: "filter_change",
      params: { facet: "year", value: "2024" },
    });

    await user.click(screen.getByText("Monochrome"));
    expect(pushAnalyticsEvent).toHaveBeenNthCalledWith(2, {
      name: "filter_change",
      params: { facet: "palette", value: "monochrome" },
    });

    const [paletteAll] = screen.getAllByText("All", { selector: "label" });
    await user.click(paletteAll);
    expect(pushAnalyticsEvent).toHaveBeenNthCalledWith(3, {
      name: "filter_change",
      params: { facet: "palette", value: "all" },
    });

    await user.click(screen.getByText("Nature"));
    expect(pushAnalyticsEvent).toHaveBeenNthCalledWith(4, {
      name: "filter_change",
      params: { facet: "focus", value: "nature" },
    });
  });

  it("renders reset link and update button", () => {
    render(<FilterBar years={[2025]} />);

    expect(screen.getByRole("button", { name: "Update" })).toBeEnabled();
    expect(screen.getByRole("link", { name: "Reset" })).toHaveAttribute("href", "/works");
  });
});
