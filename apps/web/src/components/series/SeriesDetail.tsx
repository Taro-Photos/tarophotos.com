import Image from "next/image";
import Link from "next/link";
import type { SeriesDetails } from "@/app/_content/series";
import styles from "./SeriesDetail.module.css";

export function SeriesDetail({ data }: { data: SeriesDetails }) {
  return (
    <article className={styles.article}>
      <div className="ds-wrap">
        <div className={styles.top}>
          <Link className={styles.back} href="/works">
            ← Index
          </Link>
          <span className={styles.topMeta}>
            {data.year} · {data.location}
          </span>
        </div>

        <header>
          <span className={styles.eyebrow} lang="en">
            {data.focus} · {data.palette}
          </span>
          <h1 className={styles.title} lang="en">
            {data.title}
          </h1>
          {data.synopsisEn ? (
            <p className={styles.synopsis} lang="en">
              {data.synopsisEn}
            </p>
          ) : null}
          <p className={`${styles.synopsis} ${styles.synopsisJa}`} lang="ja">
            {data.synopsis}
          </p>
        </header>

        <figure className={styles.hero}>
          <Image
            src={data.heroImage.src}
            alt={data.heroImage.alt}
            width={data.heroImage.width}
            height={data.heroImage.height}
            priority
            sizes="(max-width: 1440px) 100vw, 1200px"
          />
        </figure>

        <p className={styles.lead} lang="ja">
          {data.lead}
        </p>
      </div>

      <div className="ds-wrap">
        <div className={styles.gallery}>
          {data.gallery.map((img, i) => (
            <div className={styles.plate} key={img.src}>
              <span className={styles.plateNo}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <figure className={styles.plateFig}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="(max-width: 900px) 100vw, 1100px"
                  />
                </figure>
                <div className={styles.plateMeta}>
                  <div>
                    {img.caption ? (
                      <p className={styles.caption} lang="ja">
                        {img.caption}
                      </p>
                    ) : null}
                    <span className={styles.captionExif}>
                      {img.contentLocation} · {img.datePublished}
                    </span>
                  </div>
                  {img.statement ? (
                    <p className={styles.statement} lang="ja">
                      {img.statement}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.metaBlock}>
          <div className={styles.exifList}>
            {data.exif.map((e) => (
              <div className={styles.exifItem} key={e.label}>
                <div className={styles.k}>{e.label}</div>
                <div className={styles.v}>{e.value}</div>
              </div>
            ))}
          </div>
          <p className={styles.story} lang="ja">
            {data.story}
          </p>
        </div>

        <div className={styles.cta}>
          <div>
            <h2 className={styles.ctaHeading} lang="en">
              Continue through the index.
            </h2>
            <p className={styles.ctaBody} lang="ja">
              他のシリーズも、同じ閾（しきい）のそばで待っています。プリント・撮影のご相談も歓迎します。
            </p>
          </div>
          <div className={styles.ctaLinks}>
            <Link className={styles.ctaLink} href="/works">
              All Works →
            </Link>
            <Link className={styles.ctaLink} href="/#contact">
              Contact →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
