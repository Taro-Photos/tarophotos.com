import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutTeaserSection from "@/components/organisms/AboutTeaserSection";

describe("AboutTeaserSection", () => {
  it("renders profile tagline and statement", () => {
    render(<AboutTeaserSection />);

    // Check for profile content (exact text will depend on actual content)
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read more about me/i })).toHaveAttribute(
      "href",
      "/about"
    );
  });

  it("renders background image", () => {
    render(<AboutTeaserSection />);

    const img = screen.getByAltText("About Background");
    expect(img).toBeInTheDocument();
  });
});
