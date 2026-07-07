import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getJournalPost } from "@/app/_content/journal";
import { JournalNav } from "./JournalNav";
import styles from "./journal.module.css";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}

/**
 * Journal 記事の共通フレーム。見出し・カバー・前後ナビはレジストリ（journal.ts）から
 * 自動導出。本文だけを children（<Lead>/<P>/<Photo>/<H2> 等）で渡す。
 */
export function JournalArticle({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const post = getJournalPost(slug);
  if (!post) {
    return null;
  }

  return (
    <article className={styles.article}>
      <div className="ds-wrap">
        <div className={styles.top}>
          <Link className={styles.back} href="/journal">
            ← Journal
          </Link>
          <span className={styles.topMeta}>
            {formatDate(post.date)}
            {post.kind ? ` · ${post.kind}` : ""}
          </span>
        </div>

        <header className={styles.header}>
          <span className={styles.eyebrow} lang="en">
            {post.kind ?? "Journal"}
          </span>
          <h1 className={styles.title} lang="ja">
            {post.title}
          </h1>
          {post.titleEn ? (
            <span className={styles.subEn} lang="en">
              {post.titleEn}
            </span>
          ) : null}
        </header>

        {post.cover ? (
          <figure className={styles.cover}>
            <Image
              src={post.cover.src}
              alt={post.cover.alt}
              width={post.cover.width}
              height={post.cover.height}
              priority
              sizes="(max-width: 1200px) 100vw, 1120px"
            />
          </figure>
        ) : null}

        <div className={styles.prose}>{children}</div>

        <JournalNav slug={slug} />
      </div>
    </article>
  );
}
