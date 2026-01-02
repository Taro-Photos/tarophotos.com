import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageHero } from "@/components/organisms/PageHero";

describe("PageHero", () => {
  it("renders eyebrow, title, and string description", () => {
    render(<PageHero eyebrow="Services" title="撮る前から" description="説明テキスト" />);

    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "撮る前から" })).toBeInTheDocument();
    const description = screen.getByText("説明テキスト");
    expect(description.tagName.toLowerCase()).toBe("p");
    expect(description).toHaveClass("mt-4");
  });

  it("accepts React nodes for description and renders children", () => {
    render(
      <PageHero
        eyebrow="About"
        title={<span data-testid="rich-title">Taro Photos</span>}
        description={<div data-testid="rich-description">Rich</div>}
      >
        <div data-testid="hero-child">Child content</div>
      </PageHero>,
    );

    expect(screen.getByTestId("rich-title")).toBeInTheDocument();
    expect(screen.getByTestId("rich-description")).toBeInTheDocument();
    expect(screen.getByTestId("hero-child")).toBeInTheDocument();
  });
});
