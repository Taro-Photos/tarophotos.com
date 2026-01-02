import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import JournalList from "@/components/organisms/JournalList";

const mockPosts = [
  {
    slug: "post-1",
    title: "First Post",
    date: "2024-01-15",
    excerpt: "This is the first post excerpt",
  },
  {
    slug: "post-2",
    title: "Second Post",
    date: "2024-01-20",
    excerpt: "This is the second post excerpt",
  },
];

describe("JournalList", () => {
  it("renders all posts", () => {
    render(<JournalList posts={mockPosts} />);

    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });

  it("renders post dates and excerpts", () => {
    render(<JournalList posts={mockPosts} />);

    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    expect(screen.getByText("This is the first post excerpt")).toBeInTheDocument();
  });

  it("links to individual post pages", () => {
    render(<JournalList posts={mockPosts} />);

    const links = screen.getAllByRole("link");
    // Each post has 2 links (image + title)
    expect(links.length).toBeGreaterThanOrEqual(mockPosts.length);
    expect(links[0]).toHaveAttribute("href", "/journal/post-1");
  });

  it("renders empty list when no posts provided", () => {
    const { container } = render(<JournalList posts={[]} />);

    const articles = container.querySelectorAll("article");
    expect(articles).toHaveLength(0);
  });
});
