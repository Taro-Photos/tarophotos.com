"use client";

import { useEffect, useState } from "react";
import type { FaqItem } from "@/app/_content/services";

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(() => (items.length ? 0 : null));

  useEffect(() => {
    if (!items.length) {
      setOpenIndex(null); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }

    setOpenIndex((previous) => {
      if (previous === null || previous >= items.length) {
        return 0;
      }
      return previous;
    });
  }, [items.length]);

  return (
    <section className="page-container py-12 md:py-16">
      <header className="mb-10 space-y-3">
        <p className="text-xs uppercase tracking-[0.36em] text-[var(--color-muted)]">FAQ</p>
        <h2 className="text-3xl tracking-[-0.02em]">よくあるご質問</h2>
        <p className="max-w-[60ch] text-sm text-[var(--color-muted)]">
          ご不明点はチャットまたはメールでもお気軽にお問い合わせください。
        </p>
      </header>
      <div className="space-y-4">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const buttonId = `faq-trigger-${index}`;
          const panelId = `faq-panel-${index}`;
          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]"
            >
              <button
                type="button"
                id={buttonId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="text-base font-medium tracking-[-0.01em]">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border)] text-xs transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
                className={`grid border-t border-[var(--color-border)] transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div
                  className={`overflow-hidden px-6 text-sm text-[var(--color-muted)] transition-[padding] duration-300 ${
                    isOpen ? "py-4" : "py-0"
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
