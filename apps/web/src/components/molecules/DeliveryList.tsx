import type { Delivery } from "@/app/_content/clients";
import { CtaLink } from "@/components/atoms/CtaLink";

type DeliveryListProps = {
  deliveries: Delivery[];
};

export function DeliveryList({ deliveries }: DeliveryListProps) {
  return (
    <section className="page-container py-12 md:py-16">
      <header className="mb-8 space-y-3 md:mb-10">
        <p className="text-xs uppercase tracking-[0.36em] text-[var(--color-muted)]">
          Deliveries
        </p>
        <h2 className="text-3xl tracking-[-0.02em]">案件ごとの納品リンク</h2>
        <p className="max-w-[60ch] text-sm text-[var(--color-muted)]">
          各ギャラリーは外部サービスでホストされ、安全なパスワードと有効期限を設定しています。期限前のダウンロードをお願いします。
        </p>
      </header>
      <div className="grid gap-5 md:gap-6">
        {deliveries.map((delivery) => (
          <article
            key={delivery.id}
            className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 md:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-xl tracking-[-0.01em]">{delivery.project}</h3>
                <p className="text-sm text-[var(--color-muted)]">{delivery.client}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-1 text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                {delivery.service}
              </span>
            </div>
            <p className="text-sm text-[var(--color-muted)]">{delivery.description}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                <span>Passcode</span>
                <span className="font-mono text-sm text-[var(--color-foreground)]">{delivery.passcode ?? "N/A"}</span>
              </div>
              <span className="text-xs text-[var(--color-muted)]">有効期限: {delivery.expiresOn}</span>
            </div>
            <CtaLink
              href={delivery.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="accent"
              analytics={{
                name: "delivery_open",
                params: { client: delivery.client, gallery: delivery.service },
              }}
            >
              ギャラリーを開く
              <span aria-hidden>→</span>
            </CtaLink>
          </article>
        ))}
      </div>
    </section>
  );
}
