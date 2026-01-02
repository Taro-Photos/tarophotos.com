import type { SeriesDetails } from "@/app/_content/series";

export function SeriesMeta({ series }: { series: SeriesDetails }) {
  const staticExif = series.exif.filter((item) =>
    !["Settings", "Shutter Speed", "Aperture", "ISO", "Focal Length"].includes(item.label),
  );

  return (
    <section className="page-container grid gap-6 py-12 md:gap-8 md:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
      <div className="space-y-4">
        <h2 className="text-2xl tracking-[-0.01em]">Behind the Shot</h2>
        <p className="max-w-[60ch] text-sm text-[var(--color-muted)]">{series.story}</p>
      </div>
      <div
        className="space-y-4 rounded-[var(--radius-card)] border p-5 md:p-6"
        style={{ background: "var(--surface-card)", borderColor: "var(--surface-card-border)" }}
      >
        <h3 className="text-xs uppercase tracking-[0.36em] text-[var(--color-muted)]">Shooting Info</h3>
        <p className="text-sm text-[var(--color-muted)]">
          各カットのカメラボディやISO・シャッタースピードは、ギャラリーの画像を開くとオーバーレイに表示されます。
          {staticExif.length ? " シリーズ共通の使用機材は以下のとおりです。" : ""}
        </p>
        {staticExif.length ? (
          <dl className="grid gap-3 text-sm">
            {staticExif.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted)]">{item.label}</dt>
                <dd className="font-medium tracking-[-0.01em] text-[var(--color-foreground)]">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
