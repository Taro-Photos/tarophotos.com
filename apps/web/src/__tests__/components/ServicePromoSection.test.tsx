import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ServicePromoSection from "@/components/organisms/ServicePromoSection";

describe("ServicePromoSection", () => {
  it("renders section heading and CTA link", () => {
    render(<ServicePromoSection />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Professional");
    expect(screen.getByRole("link", { name: /View Services/i })).toHaveAttribute(
      "href",
      "/services"
    );
  });

  it("renders services label", () => {
    render(<ServicePromoSection />);

    expect(screen.getByText("Services")).toBeInTheDocument();
  });

  it("renders service image", () => {
    render(<ServicePromoSection />);

    const img = screen.getByAltText("Services");
    expect(img).toBeInTheDocument();
  });
});
