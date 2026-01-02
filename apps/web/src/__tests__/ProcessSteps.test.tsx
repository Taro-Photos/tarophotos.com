import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProcessSteps } from "@/components/molecules/ProcessSteps";

const steps = [
  {
    title: "ヒアリング",
    description: "ゴールと制約を整理",
    duration: "1 week",
  },
  {
    title: "撮影",
    description: "現地でのディレクション",
    duration: "1 day",
  },
];

describe("ProcessSteps", () => {
  it("renders numbered list with provided content", () => {
    render(<ProcessSteps steps={steps} />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(steps.length);
    expect(screen.getByText("ヒアリング")).toBeInTheDocument();
    expect(screen.getByText("1 week")).toBeInTheDocument();
    expect(screen.getByText("撮影")).toBeInTheDocument();

    const numbers = items.map((item) => item.querySelector("span"));
    expect(numbers[0]?.textContent).toBe("01");
    expect(numbers[1]?.textContent).toBe("02");
  });
});
