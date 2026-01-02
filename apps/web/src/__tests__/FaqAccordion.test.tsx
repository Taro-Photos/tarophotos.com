import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FaqAccordion } from "@/components/molecules/FaqAccordion";

describe("FaqAccordion", () => {
  const items = [
    { question: "撮影前に準備しておくことはありますか？", answer: "ロケ地の許可申請が必要な場合は事前に確認します。" },
    { question: "納期はどのくらいですか？", answer: "通常は撮影から7営業日以内に納品します。" },
  ];

  it("expands the first entry by default", () => {
    render(<FaqAccordion items={items} />);

    const firstToggle = screen.getByRole("button", { name: items[0].question });
    expect(firstToggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(items[0].answer)).toBeVisible();
  });

  it("allows toggling between entries", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);

    const firstToggle = screen.getByRole("button", { name: items[0].question });
    const secondToggle = screen.getByRole("button", { name: items[1].question });
    const firstPanel = firstToggle.nextElementSibling as HTMLElement;
    const secondPanel = secondToggle.nextElementSibling as HTMLElement;

    await user.click(secondToggle);

    expect(firstToggle).toHaveAttribute("aria-expanded", "false");
    expect(secondToggle).toHaveAttribute("aria-expanded", "true");

    expect(screen.getByText(items[1].answer)).toBeVisible();
    expect(firstPanel?.className ?? "").toContain("grid-rows-[0fr]");
    expect(secondPanel?.className ?? "").toContain("grid-rows-[1fr]");

    await user.click(secondToggle);
    expect(secondToggle).toHaveAttribute("aria-expanded", "false");
    expect(secondPanel?.className ?? "").toContain("grid-rows-[0fr]");
  });
});
