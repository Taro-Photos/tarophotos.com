import Image from "next/image";
import Link from "next/link";
import {
  journalEssays,
  journalNews,
  journalHref,
  isExternalHref,
  type JournalMeta,
} from "@/app/_content/journal";
import styles from "./journal.module.css";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}

// 随筆＝主役。大判カバーの editorial カード。
function EssayCard({ post }: { post: JournalMeta }) {
  return (
    <Link className={styles.card} href={`/journal/${post.slug}`}>
      {post.cover ? (
        <div className={styles.cardCover}>
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(max-width: 720px) 100vw, 560px"
          />
        </div>
      ) : (
        <div className={styles.cardCover} aria-hidden />
      )}
      <div>
        <span className={styles.cardEyebrow}>{formatDate(post.date)}</span>
        <h2 className={styles.cardTitle} lang="ja">
          {post.title}
        </h2>
        <p className={styles.cardExcerpt} lang="ja">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}

// お知らせ＝時々。日付＋一行の簡潔な行。
function NewsRow({ post }: { post: JournalMeta }) {
  const href = journalHref(post);
  const external = isExternalHref(href);
  const inner = (
    <>
      <span className={styles.newsDate}>{formatDate(post.date)}</span>
      <span className={styles.newsTitle} lang="ja">
        {post.title}
      </span>
      <span className={styles.newsArrow} aria-hidden>
        {external ? "↗" : "→"}
      </span>
    </>
  );
  return external ? (
    <a className={styles.newsRow} href={href} target="_blank" rel="noreferrer">
      {inner}
    </a>
  ) : (
    <Link className={styles.newsRow} href={href}>
      {inner}
    </Link>
  );
}

export function JournalIndex() {
  return (
    <section className={styles.indexWrap}>
      <div className="ds-wrap">
        <div className={styles.indexHead}>
          <h1 className={styles.indexTitle} lang="en">
            Journal
            <span className={styles.ja} lang="ja">
              随筆
            </span>
          </h1>
          <p className={styles.indexLede} lang="ja">
            撮ることの前後にある、待つ時間のこと。風景と、境目と、余白をめぐるノート。
          </p>
        </div>

        {journalNews.length > 0 ? (
          <div className={styles.news}>
            <div className={styles.newsLabel}>
              News
              <span className={styles.newsLabelJa} lang="ja">
                お知らせ
              </span>
            </div>
            <ul className={styles.newsList}>
              {journalNews.map((post) => (
                <li key={post.slug}>
                  <NewsRow post={post} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={styles.list}>
          {journalEssays.map((post) => (
            <EssayCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
