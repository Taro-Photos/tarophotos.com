/* ============================================================
   TARO Design System — Primitives
   横断で使う最小の表示プリミティブ。スタイルは base.css の
   .ds-* クラスに委譲（SSOT は CSS 側）。Phase 2 のコンポーネントは
   これらを土台に組む。
   ============================================================ */

import type { ElementType, HTMLAttributes, ReactNode } from "react";

type WithClass = { className?: string; children?: ReactNode };

function cx(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

/** 中央寄せのコンテンツ枠（measure 内・左右 gutter） */
export function Wrap({
  as: Tag = "div",
  className,
  children,
  ...rest
}: WithClass & { as?: ElementType } & HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={cx("ds-wrap", className)} {...rest}>
      {children}
    </Tag>
  );
}

/** ヘアライン区切り */
export function Hairline({ className }: { className?: string }) {
  return <hr className={cx("ds-hair", className)} />;
}

/** 小見出しラベル（UI sans・広トラッキング・大文字） */
export function Eyebrow({
  as: Tag = "span",
  className,
  children,
  ...rest
}: WithClass & { as?: ElementType } & HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={cx("ds-eyebrow", className)} {...rest}>
      {children}
    </Tag>
  );
}

/** 連番・カウンタ（等幅数字） */
export function Num({ className, children }: WithClass) {
  return <span className={cx("ds-num", className)}>{children}</span>;
}

/** EXIF・撮影メタ（極小 UI sans） */
export function Exif({ className, children }: WithClass) {
  return <span className={cx("ds-exif", className)}>{children}</span>;
}

/** 和字アクセント（明朝）。日本語テキストは常に lang="ja" を付す（EN-led ルート
    lang="en" 配下でスクリーンリーダー/検索が日本語を誤認しないように）。 */
export function Ja({
  as: Tag = "span",
  className,
  children,
}: WithClass & { as?: ElementType }) {
  return (
    <Tag className={cx("ds-ja", className)} lang="ja">
      {children}
    </Tag>
  );
}

/** EN-led 併記ペア: 英語を主、和字を副（`ds-ja` + lang="ja"）で添える。
    ja が無ければ英語のみ描画。EN-led bilingual の標準プリミティブ。 */
export function Bi({
  en,
  ja,
  as: Tag = "div",
  className,
  jaClassName,
}: {
  en: ReactNode;
  ja?: ReactNode;
  as?: ElementType;
  className?: string;
  jaClassName?: string;
}) {
  return (
    <Tag className={className}>
      <span lang="en">{en}</span>
      {ja ? (
        <span className={cx("ds-ja", jaClassName)} lang="ja">
          {ja}
        </span>
      ) : null}
    </Tag>
  );
}
