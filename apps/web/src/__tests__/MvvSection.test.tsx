import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MvvSection } from "@/components/organisms/MvvSection";
import { mvv } from "@/app/_content/about";

describe("MvvSection", () => {
  it("renders mission, vision, and values cards with content", () => {
    render(<MvvSection />);

    expect(screen.getByText("Mission Vision Values")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "現場から生まれる指針" })).toBeInTheDocument();

    mvv.forEach((item) => {
      const card = screen.getByRole("heading", { level: 3, name: item.title }).closest("div");
      expect(card).toBeTruthy();
      if (item.description) {
        expect(within(card as HTMLElement).getByText(item.description)).toBeInTheDocument();
      }
      if (item.points) {
        item.points.forEach((point) => {
          expect(within(card as HTMLElement).getByText(point)).toBeInTheDocument();
        });
      }
    });
  });
});
