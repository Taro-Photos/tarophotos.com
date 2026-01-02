import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Hero from "@/components/organisms/Hero";

describe("Hero", () => {
  it("renders hero with title, subtitle and image", () => {
    render(
      <Hero
        title="Test Title"
        subtitle="Test Subtitle"
        imageSrc="https://example.com/image.jpg"
        imageAlt="Test Image"
      />
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Title");
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Test Image" })).toHaveAttribute(
      "src",
      expect.stringContaining("image.jpg")
    );
  });
});
