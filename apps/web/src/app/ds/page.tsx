import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Eyebrow, Exif, Hairline, Ja, Num, Wrap } from "@/design-system";

export const metadata: Metadata = {
  title: "Design System — Internal",
  robots: { index: false, follow: false },
};

const COLORS = [
  { token: "paper", hex: "#F7F4EF", note: "生成り・基底の紙", cls: "bg-paper" },
  { token: "paper-deep", hex: "#F1ECE4", note: "セクション交互の微差", cls: "bg-paper-deep" },
  { token: "ink", hex: "#1A1A1A", note: "墨・本文/見出し", cls: "bg-ink" },
  { token: "warm-grey", hex: "#6B6157", note: "温灰・副次テキスト", cls: "bg-warm-grey" },
  { token: "hair", hex: "#E2DCD2", note: "ヘアライン区切り", cls: "bg-hair" },
];

const TYPE = [
  { token: "text-display", cls: "text-display", sample: "Threshold" },
  { token: "text-title", cls: "text-title", sample: "First Light Voyage" },
  { token: "text-heading", cls: "text-heading", sample: "Harbor, Blue Hour" },
  { token: "text-subhead", cls: "text-subhead", sample: "Selected Landscapes" },
  { token: "text-lede", cls: "text-lede", sample: "I go out to meet the overlooked, and wait." },
  { token: "text-body", cls: "text-body", sample: "都市と自然の境目で、見過ごされた静けさに光を当てる。" },
];

export default function DesignSystemPage() {
  // 内部確認用ショーケース。noindex に加えて本番では 404（開発時のみ閲覧可）。
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="bg-paper text-ink">
      <Wrap className="py-24">
        {/* header */}
        <Eyebrow>TARO Design System — Internal</Eyebrow>
        <h1 className="font-serif text-display leading-display mt-4">
          The quiet
          <br />
          <span className="italic">foundation.</span>
        </h1>
        <p className="font-mincho text-warm-grey text-subhead mt-6">
          風景・境目・余白 — 写真関連プロダクト横断の視覚言語
        </p>

        <Hairline className="my-20" />

        {/* color */}
        <section>
          <Eyebrow>01 — Color</Eyebrow>
          <div className="mt-10 grid grid-cols-2 gap-px bg-hair sm:grid-cols-5">
            {COLORS.map((c) => (
              <div key={c.token} className="bg-paper p-6">
                <div
                  className={`${c.cls} aspect-square w-full border border-hair`}
                />
                <p className="font-ui text-ui tracking-wider mt-4 uppercase">
                  {c.token}
                </p>
                <p className="font-ui text-ui-sm text-warm-grey mt-1 tracking-wide">
                  {c.hex}
                </p>
                <p className="font-mincho text-warm-grey text-meta mt-2">
                  {c.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Hairline className="my-20" />

        {/* typography */}
        <section>
          <Eyebrow>02 — Type scale</Eyebrow>
          <div className="mt-10 flex flex-col gap-10">
            {TYPE.map((t) => (
              <div
                key={t.token}
                className="grid grid-cols-1 gap-2 sm:grid-cols-[160px_1fr] sm:items-baseline"
              >
                <span className="font-ui text-ui-sm text-warm-grey tracking-wide">
                  {t.token}
                </span>
                <span className={`font-serif ${t.cls}`}>{t.sample}</span>
              </div>
            ))}
          </div>
        </section>

        <Hairline className="my-20" />

        {/* fonts */}
        <section>
          <Eyebrow>03 — Families</Eyebrow>
          <div className="mt-10 grid grid-cols-1 gap-12 sm:grid-cols-3">
            <div>
              <p className="font-ui text-ui-sm text-warm-grey tracking-wide">
                serif · Cormorant Garamond
              </p>
              <p className="font-serif text-heading mt-3">Taro Shirai</p>
              <p className="font-serif text-lede mt-1 italic">
                Time passes. One frame stays.
              </p>
            </div>
            <div>
              <p className="font-ui text-ui-sm text-warm-grey tracking-wide">
                mincho · Shippori Mincho
              </p>
              <p className="font-mincho text-heading mt-3">白井 悠太郎</p>
              <p className="font-mincho text-lede mt-1">風景写真家</p>
            </div>
            <div>
              <p className="font-ui text-ui-sm text-warm-grey tracking-wide">
                ui · Inter
              </p>
              <p className="font-ui text-body mt-3">Tokyo / since 2016</p>
              <p className="font-ui text-ui-sm text-warm-grey mt-1 tracking-wide">
                SONY α7R IV · 85mm · ƒ/2.0
              </p>
            </div>
          </div>
        </section>

        <Hairline className="my-20" />

        {/* micro-typography + primitives */}
        <section>
          <Eyebrow>04 — Micro-typography</Eyebrow>
          <div className="mt-10 flex flex-col gap-6">
            <div className="flex items-baseline gap-6">
              <span className="font-ui text-ui-sm text-warm-grey w-24">
                Eyebrow
              </span>
              <Eyebrow>Selected Work</Eyebrow>
            </div>
            <div className="flex items-baseline gap-6">
              <span className="font-ui text-ui-sm text-warm-grey w-24">Num</span>
              <Num>01 / 06</Num>
            </div>
            <div className="flex items-baseline gap-6">
              <span className="font-ui text-ui-sm text-warm-grey w-24">Exif</span>
              <Exif>04:52 · 那須塩原 · SONY α7R IV · 1/200s · ISO 100</Exif>
            </div>
            <div className="flex items-baseline gap-6">
              <span className="font-ui text-ui-sm text-warm-grey w-24">Ja</span>
              <Ja className="text-subhead">迎えにいって、待つ</Ja>
            </div>
          </div>
        </section>

        <Hairline className="my-20" />

        {/* composition taste (Phase 2 prelude) */}
        <section>
          <Eyebrow>05 — Composition (preview)</Eyebrow>
          <div className="mt-10 grid grid-cols-[64px_1fr] items-start gap-8 border-t border-hair pt-10">
            <Num>01</Num>
            <div>
              <Eyebrow>Selected Landscape</Eyebrow>
              <h3 className="font-serif text-heading mt-3">First Light Voyage</h3>
              <p className="font-mincho text-warm-grey text-subhead mt-1">
                夜明けの航跡
              </p>
              <p className="font-serif text-body mt-4 max-w-prose">
                The harbor before anyone arrives. I did not chase the beautiful;
                I waited where it might find me.
              </p>
              <div className="mt-5">
                <Exif>04:52 · 那須塩原 · SONY α7R IV · 24mm · ƒ/8 · 30s · ISO 64</Exif>
              </div>
            </div>
          </div>
        </section>
      </Wrap>
    </main>
  );
}
