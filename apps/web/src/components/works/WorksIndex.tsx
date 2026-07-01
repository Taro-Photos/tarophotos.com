import Image from "next/image";
import Link from "next/link";
import type { WorkSeries } from "@/app/_content/works";
import styles from "./WorksIndex.module.css";

const COUNT_WORDS = [
  "ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT",
  "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN",
  "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN", "TWENTY",
];

export function WorksIndex({ series }: { series: WorkSeries[] }) {
  const years = series.map((s) => s.year);
  const span = `${Math.min(...years)}—${Math.max(...years)}`;
  const countLabel = COUNT_WORDS[series.length] ?? String(series.length);

  return (
    <section className={styles.index}>
      <div className="ds-wrap">
        <header className={styles.head}>
          <span className={styles.eyebrow}>Index</span>
          <h1 className={styles.title} lang="en">
            Works{" "}
            <span className={styles.ja} lang="ja">
              作品
            </span>
          </h1>
          <div className={styles.count}>
            {countLabel} SERIES · {span}
          </div>
        </header>

        <div className={styles.list}>
          {series.map((s, i) => (
            <Link className={styles.row} href={`/works/${s.slug}`} key={s.slug}>
              <span className={styles.no}>{String(i + 1).padStart(2, "0")}</span>
              <div className={styles.thumb}>
                <Image
                  src={s.cover.src}
                  alt={s.cover.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 300px"
                />
              </div>
              <div className={styles.meta}>
                <div>
                  <h2 className={styles.rowTitle} lang="en">
                    {s.title}
                  </h2>
                  {s.synopsisEn ? (
                    <p className={styles.synopsis} lang="en">
                      {s.synopsisEn}
                    </p>
                  ) : null}
                  <p className={`${styles.synopsis} ${styles.synopsisJa}`} lang="ja">
                    {s.synopsis}
                  </p>
                </div>
                <span className={styles.rowMeta}>
                  {s.year} · {s.location}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
