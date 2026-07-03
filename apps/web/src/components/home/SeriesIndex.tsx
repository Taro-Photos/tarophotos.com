import Image from "next/image";
import Link from "next/link";
import { featuredSeries, type FeaturedWork } from "./featured-series";
import styles from "./SeriesIndex.module.css";

function Work({ work }: { work: FeaturedWork }) {
  return (
    <Link className={styles.work} href={`/works/${work.slug}`}>
      <div className={styles.workNo}>
        <span className={styles.num}>{work.no}</span>
      </div>
      <div className={styles.body}>
        <figure className={styles.figure}>
          <Image
            src={work.image}
            alt={work.alt}
            fill
            sizes="(max-width: 900px) 100vw, 760px"
          />
        </figure>
        <div className={styles.meta}>
          <span className={styles.eyebrow} lang="en">
            {work.eyebrow}
          </span>
          <h3 lang="en">
            {work.title} {work.titleEm ? <em>{work.titleEm}</em> : null}
          </h3>
          <div className={styles.h3ja} lang="ja">
            {work.titleJa}
          </div>
          <div className={styles.stamp}>{work.stamp}</div>
          {work.placeEn ? (
            <div className={styles.place} lang="en">
              {work.placeEn}
            </div>
          ) : null}
          <div className={`${styles.place} ${styles.placeJa}`} lang="ja">
            {work.place}
          </div>
          <div className={styles.exifLine}>
            <span className={styles.exif}>{work.exif}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Pause() {
  return (
    <div className={styles.pause}>
      <div />
      <div className={styles.pauseBody}>
        <div className={styles.tate} lang="ja">
          余白に、想いが宿る
          <small>{'　'}観る人のための場所</small>
        </div>
        <div className={styles.pauseText}>
          <p lang="en">
            I do not show you the beautiful.
            <br />I leave the <span className={styles.warm}>space</span> where the
            beautiful might find you.
          </p>
          <div className={styles.sig} lang="en">
            — working notes
          </div>
        </div>
      </div>
    </div>
  );
}

export function SeriesIndex() {
  const first = featuredSeries.slice(0, 3);
  const rest = featuredSeries.slice(3);
  return (
    <section className={styles.series} id="series">
      <div className="ds-wrap">
        <div className={styles.head}>
          <h2 lang="en">
            Selected Series{" "}
            <span className={styles.ja} lang="ja">
              作品
            </span>
          </h2>
          <Link className={styles.headNum} href="/works">
            Index · All Works →
          </Link>
        </div>

        <div className={styles.list}>
          {first.map((w) => (
            <Work key={w.no} work={w} />
          ))}
          <Pause />
          {rest.map((w) => (
            <Work key={w.no} work={w} />
          ))}
        </div>
      </div>
    </section>
  );
}
