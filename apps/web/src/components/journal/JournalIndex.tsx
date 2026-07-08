import Image from "next/image";
import Link from "next/link";
import { journalSorted, type JournalMeta } from "@/app/_content/journal";
import styles from "./journal.module.css";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}

function Card({ post }: { post: JournalMeta }) {
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
        <span className={styles.cardEyebrow}>
          {formatDate(post.date)}
          {post.kind ? ` · ${post.kind}` : ""}
        </span>
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
        <div className={styles.list}>
          {journalSorted.map((post) => (
            <Card key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
