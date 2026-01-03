import { render, screen } from "@testing-library/react";
import ContactForm from "./index";
import { describe, it, expect, vi } from "vitest";

// Mock next/navigation if needed
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("ContactForm", () => {
  it("renders the privacy policy link in the agreement checkbox", () => {
    render(<ContactForm />);

    // Find the link by text "Privacy Policy"
    // The label text is "I agree to the Privacy Policy", but the link text is just "Privacy Policy"
    const link = screen.getByRole("link", { name: "Privacy Policy" });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/legal#privacy");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
