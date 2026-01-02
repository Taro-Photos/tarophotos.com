import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FeaturedSection from "@/components/organisms/FeaturedSection";

const mockItems = [
  {
    title: "NAMIBIA",
    subtitle: "SERIES",
    imageSrc: "https://example.com/namibia.jpg",
    imageAlt: "Namibia Series",
    link: "/works/namibia",
    isTextLeft: true,
  },
  {
    title: "NEW YORK CITY",
    subtitle: "SERIES",
    imageSrc: "https://example.com/nyc.jpg",
    imageAlt: "New York City Series",
    link: "/works/nyc",
    isTextLeft: false,
  },
];

describe("FeaturedSection", () => {
  it("renders all featured items", () => {
    render(<FeaturedSection items={mockItems} />);

    expect(screen.getByText("NAMIBIA")).toBeInTheDocument();
    expect(screen.getByText("NEW YORK CITY")).toBeInTheDocument();
  });

  it("renders images with correct alt text", () => {
    render(<FeaturedSection items={mockItems} />);

    expect(screen.getByAltText("Namibia Series")).toBeInTheDocument();
    expect(screen.getByAltText("New York City Series")).toBeInTheDocument();
  });

  it("renders links to work series", () => {
    render(<FeaturedSection items={mockItems} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(mockItems.length);
    expect(links[0]).toHaveAttribute("href", "/works/namibia");
    expect(links[1]).toHaveAttribute("href", "/works/nyc");
  });
});
