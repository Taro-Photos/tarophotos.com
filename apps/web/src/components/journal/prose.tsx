import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./journal.module.css";

type Lang = "ja" | "en";

/** 本文段落。既定は和字（明朝）。英文段落は lang="en"。 */
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
