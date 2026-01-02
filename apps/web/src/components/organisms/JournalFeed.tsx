"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";
import type { JournalPost, JournalCategory } from "@/app/_content/journal";

const PAGE_SIZE = 3;

export function JournalFeed({ posts }: { posts: JournalPost[] }) {
  const [activeCategory, setActiveCategory] = useState<JournalCategory | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") {
      return posts;
    }
    return posts.filter((post) => post.category === activeCategory);
  }, [activeCategory, posts]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visiblePosts = filteredPosts.slice(startIndex, startIndex + PAGE_SIZE);

  const changeCategory = (category: JournalCategory | "All") => {
    setActiveCategory(category);
    setCurrentPage(1);
    pushAnalyticsEvent({
      name: "filter_change",
      params: { facet: "journal_category", value: category },
    });
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
    pushAnalyticsEvent({ name: "paginate", params: { page } });
  };

  return (
    <div className="space-y-8 md:space-y-10">
      <nav aria-label="Table of contents" className="flex flex-wrap gap-3 text-xs">
        <JournalCategoryPill
          label="All"
          isActive={activeCategory === "All"}
          onClick={() => changeCategory("All")}
        />
        {(["Behind", "Report", "Gear", "Memo"] as const).map((category) => (
          <JournalCategoryPill
            key={category}
            label={category}
            isActive={activeCategory === category}
            onClick={() => changeCategory(category)}
          />
        ))}
      </nav>

      <div className="grid gap-6">
        {visiblePosts.map((post) => (
          <JournalPostCard key={post.slug} post={post} />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-4 text-sm text-[var(--color-muted)]">
          <button
            type="button"
            onClick={() => changePage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-transparent px-4 py-2 uppercase tracking-[0.28em] transition-all duration-200 ease-out disabled:opacity-40 [background:linear-gradient(var(--color-background),var(--color-background))_padding-box,linear-gradient(135deg,rgba(31,154,245,0.55),rgba(10,110,122,0.6))_border-box] hover:-translate-y-[2px] hover:[background:linear-gradient(var(--color-background),var(--color-background))_padding-box,linear-gradient(135deg,rgba(31,154,245,0.72),rgba(10,110,122,0.75))_border-box]"
          >
            Prev
          </button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full border border-transparent px-4 py-2 uppercase tracking-[0.28em] transition-all duration-200 ease-out disabled:opacity-40 [background:linear-gradient(var(--color-background),var(--color-background))_padding-box,linear-gradient(135deg,rgba(31,154,245,0.55),rgba(10,110,122,0.6))_border-box] hover:-translate-y-[2px] hover:[background:linear-gradient(var(--color-background),var(--color-background))_padding-box,linear-gradient(135deg,rgba(31,154,245,0.72),rgba(10,110,122,0.75))_border-box]"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}

function JournalCategoryPill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 uppercase tracking-[0.28em] transition-all duration-200 ease-out ${
        isActive
          ? "border-transparent bg-gradient-accent text-[var(--color-on-accent)] shadow-[0_14px_30px_-20px_rgba(11,110,122,0.55)]"
          : "border border-[var(--surface-card-border)] bg-[var(--surface-card)] text-[var(--color-muted)] hover:border-transparent hover:bg-gradient-accent-soft hover:text-[var(--color-accent)] hover:shadow-[0_14px_30px_-24px_rgba(11,110,122,0.45)]"
      }`}
    >
      {label}
    </button>
  );
}

function JournalPostCard({ post }: { post: JournalPost }) {
  return (
    <article className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
      <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
        {post.category} · {post.date} · {post.readTime}
      </span>
      <h3 className="text-2xl tracking-[-0.01em]">{post.title}</h3>
      <p className="text-sm text-[var(--color-muted)]">{post.excerpt}</p>
      <Link
        href={`/journal/${post.slug}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)]"
        onClick={() => pushAnalyticsEvent({ name: "view_post", params: { slug: post.slug } })}
      >
        記事を読む
        <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
