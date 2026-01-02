import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/_lib/analytics", () => ({
  pushAnalyticsEvent: vi.fn(),
}));

import { JournalFeed } from "@/components/organisms/JournalFeed";
import type { JournalPost } from "@/app/_content/journal";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

const posts: JournalPost[] = [
  {
    slug: "behind-1",
    title: "Behind the Scenes",
    excerpt: "BTS",
    category: "Behind",
    date: "2025-01-10",
    readTime: "4 min",
  },
  {
    slug: "report-1",
    title: "Event Report",
    excerpt: "Report",
    category: "Report",
    date: "2025-01-11",
    readTime: "6 min",
  },
  {
    slug: "gear-1",
    title: "Gear Notes",
    excerpt: "Gear",
    category: "Gear",
    date: "2025-01-12",
    readTime: "3 min",
  },
  {
    slug: "report-2",
    title: "Second Report",
    excerpt: "Report 2",
    category: "Report",
    date: "2025-01-13",
    readTime: "5 min",
  },
];

describe("JournalFeed", () => {
  beforeEach(() => {
    vi.mocked(pushAnalyticsEvent).mockClear();
  });

  it("filters by category and paginates posts", async () => {
    const user = userEvent.setup();
    render(<JournalFeed posts={posts} />);

    expect(screen.getAllByRole("article")).toHaveLength(3);

    await user.click(screen.getByRole("button", { name: "Report" }));

    expect(pushAnalyticsEvent).toHaveBeenCalledWith({
      name: "filter_change",
      params: { facet: "journal_category", value: "Report" },
    });
    expect(screen.getAllByRole("article")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getAllByRole("article")).toHaveLength(3);

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(pushAnalyticsEvent).toHaveBeenCalledWith({ name: "paginate", params: { page: 2 } });
    expect(screen.getByText("Second Report")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });
});
