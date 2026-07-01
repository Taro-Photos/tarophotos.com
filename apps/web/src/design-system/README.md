# TARO Design System（非公開・内部管理）

写真関連プロダクト横断で再利用する、TARO の視覚言語。
出典は **synth-revised（風景・閾・余白）** — CEO 確定 2026-06-27。

> ⚠️ 非公開。OSS 公開しない。社内・自社プロダクト専用。

## 思想

生成り（paper）の上に墨（ink）。説明を削り、余白に観る人の想いが宿る "間" を残す。
Latin serif（Cormorant Garamond）を主、和字（Shippori Mincho）を添え、
UI 情報（EXIF・連番・ナビ）は Inter で静かに支える。

- **核となる軸**: 見過ごされたものに、静かに光を当てる
- **作法**: 迎えにいって、待つ（主体的な受動）
- ブランド文書: `docs/brand/positioning.md` / `docs/brand/axis-deepening.md`

## 構成

| ファイル | 役割 |
|---|---|
| `tokens.css` | **SSOT**。Tailwind v4 `@theme` で色・書体・タイプスケール・余白・モーションを定義 |
| `base.css` | グローバル基底（paper/ink/serif）+ セマンティック・クラス（`.ds-*`） |
| `fonts.ts` | 3 書体の Google Fonts URL（synth-revised.html と同一・layout が `<link>` 読込） |
| `primitives.tsx` | React プリミティブ（`Wrap`/`Hairline`/`Eyebrow`/`Num`/`Exif`/`Ja`） |
| `tokens.ts` | JS から値参照する場面用のミラー（CSS が正） |
| `index.ts` | barrel |

`globals.css` が `tokens.css` → `base.css` の順で import。
fonts は `app/layout.tsx` が `<html>`/`<head>` に注入。

## トークン早見

| 種別 | トークン | 値 |
|---|---|---|
| 色 | `paper` / `paper-deep` / `ink` / `warm-grey` / `hair` | `#F7F4EF` / `#F1ECE4` / `#1A1A1A` / `#6B6157` / `#E2DCD2` |
| 書体 | `serif` / `mincho` / `ui` | Cormorant Garamond / Shippori Mincho / Inter |
| 文字 | `text-display`…`text-ui-sm` | 118px(clamp) … 10.5px |
| 余白 | `measure` / `gutter` | 1440px / 120px |
| 動き | `ease-ds` | cubic-bezier(.22,1,.36,1) |

## 使い方

```tsx
import { Wrap, Eyebrow, Exif, Ja } from "@/design-system";

<Wrap as="section">
  <Eyebrow>Selected Work</Eyebrow>
  <h2 className="font-serif text-heading">First Light Voyage</h2>
  <p><Ja>那須塩原</Ja></p>
  <Exif>SONY α7R IV · 85mm · ƒ/2.0 · 1/200s · ISO 100</Exif>
</Wrap>
```

Tailwind ユーティリティでも同じトークンが使える: `bg-paper` / `text-ink` /
`font-serif` / `text-display` / `tracking-eyebrow` / `text-warm-grey`。

## プレビュー

`/ds` ルート（開発時のみ）でトークン・タイプスケール・プリミティブを一覧表示。

## メモ

- **ダークモードなし**: paper 一色。`prefers-color-scheme` 分岐は持たない。
- **フォント**: 3 書体すべて synth-revised.html と**同一の Google Fonts `<link>`** で読込
  （確定デモと寸分違わぬ世界観にするため）。next/font は採らない —（1）Tailwind v4 が
  「使用検出されない」`@theme` の font 変数を `:root` に emit せず CSS Modules の
  `var(--font-*)` が空になる（2）self-host は hashed family 名の二重間接が絡む、ため。
  font family の実値は `globals.css` の **unlayered `:root`** で確実に宣言している。
  将来 self-host 化する場合は weight/italic を厳密一致させること。
- **再利用**: 別プロダクトへは `src/design-system/` を移植 or 将来 private package 化。
