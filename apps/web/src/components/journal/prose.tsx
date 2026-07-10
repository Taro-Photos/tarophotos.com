import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./journal.module.css";

type Lang = "ja" | "en";

/** 本文段落。既定は和字（明朝）。英文段落は lang="en"。
 *  リンク・強調を入れたい段落はこれを使い、children に JSX を混ぜる。 */
export function P({
  children,
  lang = "ja",
}: {
  children: ReactNode;
  lang?: Lang;
}) {
  return (
    <p className={styles.p} lang={lang}>
      {children}
    </p>
  );
}

/** 長文を「つらつら」書くための塊。空行で段落に自動分割される（note と同じ感覚）。
 *  例: <Prose>{`一段落目。\n\n二段落目。\n\n三段落目。`}</Prose>
 *  リンクや強調が必要な段落だけ <P> を併用する。 */
export function Prose({
  children,
  lang = "ja",
}: {
  children: string;
  lang?: Lang;
}) {
  const paragraphs = children
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  return (
    <>
      {paragraphs.map((text, i) => (
        <p className={styles.p} lang={lang} key={i}>
          {text}
        </p>
      ))}
    </>
  );
}

/** 冒頭のリード文（やや大きめ）。 */
export function Lead({
  children,
  lang = "ja",
}: {
  children: ReactNode;
  lang?: Lang;
}) {
  return (
    <p className={styles.lead} lang={lang}>
      {children}
    </p>
  );
}

/** 小見出し。 */
export function H2({
  children,
  lang = "ja",
}: {
  children: ReactNode;
  lang?: Lang;
}) {
  return (
    <h2 className={styles.h2} lang={lang}>
      {children}
    </h2>
  );
}

/** 引用・強調の一節。 */
export function Quote({
  children,
  lang = "ja",
}: {
  children: ReactNode;
  lang?: Lang;
}) {
  return (
    <blockquote className={styles.quote} lang={lang}>
      {children}
    </blockquote>
  );
}

/** 箇条書き。 */
export function Ul({ children }: { children: ReactNode }) {
  return <ul className={styles.ul}>{children}</ul>;
}

/** 番号付きリスト。 */
export function Ol({ children }: { children: ReactNode }) {
  return <ol className={`${styles.ul} ${styles.ol}`}>{children}</ol>;
}

/** リスト項目。 */
export function Li({
  children,
  lang = "ja",
}: {
  children: ReactNode;
  lang?: Lang;
}) {
  return (
    <li className={styles.li} lang={lang}>
      {children}
    </li>
  );
}

/** 作品（シリーズ）への本文中リンク。作品集について書くときに使う。 */
export function WorkLink({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <Link className={styles.workLink} href={`/works/${slug}`}>
      {children}
    </Link>
  );
}

/** 本文中の汎用リンク。内部（"/concept" 等）と外部（"https://…"）の両対応。
 *  外部は新しいタブで開く。見た目は WorkLink と同じ。 */
export function A({ href, children }: { href: string; children: ReactNode }) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a className={styles.workLink} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={styles.workLink} href={href}>
      {children}
    </Link>
  );
}

/** 節の区切り（短い罫）。 */
export function Rule() {
  return <hr className={styles.rule} />;
}

/** 本文中の写真。caption（和字）と meta（撮影地・日付など）は任意。 */
export function Photo({
  src,
  alt,
  width,
  height,
  caption,
  meta,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  meta?: string;
  priority?: boolean;
}) {
  return (
    <figure className={styles.photo}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 860px) 100vw, 832px"
        priority={priority}
      />
      {caption || meta ? (
        <figcaption>
          {caption ? (
            <span className={styles.caption} lang="ja">
              {caption}
            </span>
          ) : null}
          {meta ? <span className={styles.captionMeta}>{meta}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
