import Link from "next/link";
import { getJournalNeighbors } from "@/app/_content/journal";
import styles from "./journal.module.css";

/** 記事末尾の前後ナビ（新しい記事 / 古い記事）＋ 一覧へ戻る。 */
export function JournalNav({ slug }: { slug: string }) {
  const { prev, next } = getJournalNeighbors(slug);

  return (
    <>
      {prev || next ? (
        <nav className={styles.nav} aria-label="Journal navigation">
          {prev ? (
            <Link className={styles.navLink} href={`/journal/${prev.slug}`}>
              <span className={styles.navDir}>← Older</span>
              <span className={styles.navTitle} lang="ja">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              className={`${styles.navLink} ${styles.next}`}
              href={`/journal/${next.slug}`}
            >
              <span className={styles.navDir}>Newer →</span>
              <span className={styles.navTitle} lang="ja">
                {next.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
      <div className={styles.allLink}>
        <Link href="/journal">Index · All entries →</Link>
      </div>
    </>
  );
}
