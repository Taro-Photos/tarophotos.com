import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WorkListItem from "@/components/molecules/WorkListItem";
import type { WorkSeries } from "@/app/_content/works";

const mockSeries: WorkSeries = {
  slug: "test-series",
  title: "Test Series",
  year: 2024,
  location: "Tokyo",
  cover: {
    src: "https://example.com/cover.jpg",
    alt: "Test Cover",
    width: 1200,
    height: 800,
  },
  category: "Commercial",
  palette: "color",
  focus: "urban",
  synopsis: "Test synopsis",
};

describe("WorkListItem", () => {
  it("renders series title and metadata", () => {
    render(<WorkListItem series={mockSeries} index={0} categoryLabel="COMMERCIAL" />);

    expect(screen.getByText("Test Series")).toBeInTheDocument();
    expect(screen.getByText(/2024/)).toBeInTheDocument();
    expect(screen.getByText(/Tokyo/)).toBeInTheDocument();
  });

  it("renders category label", () => {
    render(<WorkListItem series={mockSeries} index={0} categoryLabel="COMMERCIAL" />);

    expect(screen.getByText("COMMERCIAL")).toBeInTheDocument();
  });

  it("renders cover image with correct alt text", () => {
    render(<WorkListItem series={mockSeries} index={0} categoryLabel="COMMERCIAL" />);

    const img = screen.getByAltText("Test Cover");
    expect(img).toBeInTheDocument();
  });

  it("links to series detail page", () => {
    render(<WorkListItem series={mockSeries} index={0} categoryLabel="COMMERCIAL" />);

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/works/test-series");
  });
});
