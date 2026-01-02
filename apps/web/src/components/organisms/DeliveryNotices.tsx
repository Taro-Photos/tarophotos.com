import type { DeliveryNotice } from "@/app/_content/clients";

export function DeliveryNotices({ notices }: { notices: DeliveryNotice[] }) {
  return (
    <section className="page-container py-12 md:py-16">
      <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 md:p-8">
        <h2 className="text-2xl tracking-[-0.01em]">利用ガイドライン</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {notices.map((notice) => (
            <div key={notice.title} className="space-y-2">
              <h3 className="text-sm font-medium tracking-[-0.005em]">{notice.title}</h3>
              <p className="text-sm text-[var(--color-muted)]">{notice.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
