"use client";

import Link from "next/link";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

type PaginationNavProps = {
  prevHref?: string;
  nextHref?: string;
  currentPage: number;
  totalPages: number;
};

export function PaginationNav({ prevHref, nextHref, currentPage, totalPages }: PaginationNavProps) {
  const handleClick = (page: number) => {
    pushAnalyticsEvent({ name: "paginate", params: { page } });
  };

  return (
    <nav className="page-container flex items-center justify-between text-sm text-[var(--color-muted)]">
      <div>
        {prevHref ? (
          <Link
            href={prevHref}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 uppercase tracking-[0.28em]"
            onClick={() => handleClick(currentPage - 1)}
            rel="prev"
          >
            ← Prev
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 uppercase tracking-[0.28em] opacity-50">
            ← Prev
          </span>
        )}
      </div>
      <span>
        Page {currentPage} / {totalPages}
      </span>
      <div>
        {nextHref ? (
          <Link
            href={nextHref}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 uppercase tracking-[0.28em]"
            onClick={() => handleClick(currentPage + 1)}
            rel="next"
          >
            Next →
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 uppercase tracking-[0.28em] opacity-50">
            Next →
          </span>
        )}
      </div>
    </nav>
  );
}
