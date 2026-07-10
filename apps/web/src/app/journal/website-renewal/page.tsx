// ─────────────────────────────────────────────────────────────
// お知らせ: Web サイト刷新（2026-07-10）。
// 刷新の報告を、このサイトの声（静かに・余白を残して）のまま書く。
// 後半で i-Willink（設計・開発の受託）への橋渡しと、控えめな CTA を置く。
// ─────────────────────────────────────────────────────────────
import {
  JournalArticle,
  Lead,
  Prose,
  P,
  H2,
  Quote,
  Rule,
  A,
} from "@/components/journal";
import { JsonLd } from "@/app/_components/JsonLd";
import { buildJournalMetadata, buildJournalJsonLd } from "@/app/_content/journal";

const SLUG = "website-renewal";

export const metadata = buildJournalMetadata(SLUG);

export default function Page() {
  return (
    <>
      <JournalArticle slug={SLUG}>
        <Lead>
          Webサイトを、刷新しました。コンセプトの言葉から、デザイン、日本語の組版、
          実装まで——すべてを作り直しています。
        </Lead>

        <P>
          新しいサイトの軸に置いたのは、<em>Time passes. One frame stays.</em>
          ——「時と瞬間の、境目を。」という一行です。流れ続ける時間から、
          想いごと一枚をすくい上げる。写真というものの本質を、
          サイトそのものの設計にも通しました。詳しくは{" "}
          <A href="/concept">Concept</A> に書いています。
        </P>

        <H2>写真と同じ姿勢で、作る</H2>

        <Prose>{`
派手な演出はありません。生成りの紙のような背景に、墨の文字。作品のまわりには、観る人それぞれの想いが宿るための余白を、できるだけ広く残しました。

行の頭に句読点が来ない日本語の折り返しや、縦書きの佇まい、小さな画面での読みやすさ——見過ごされがちな細部にも、撮影と同じだけの時間をかけています。いい風景を待つのと同じで、いい細部も、向こうから来てはくれないからです。
        `}</Prose>

        <Quote>迎えにいって、待つ。このサイトも、写真と同じ順番で作りました。</Quote>

        <Rule />

        <H2>制作のご相談について</H2>

        <P>
          このサイトの設計・開発は、私が代表を務める{" "}
          <A href="https://i-willink.com">i-Willink</A> が手がけています。
          写真だけでなく、ブランドの言葉づくりから、デザイン、Webサイトの設計・開発まで
          ——その人や事業の「らしさ」を見つけて、形にする仕事を受けています。
          このサイトは、その仕事の見本でもあります。
        </P>

        <P>
          作品のプリントや撮影のご依頼、サイト制作のご相談は、いずれも{" "}
          <A href="/contact">Contact</A> からどうぞ。ゆっくりお話しできれば嬉しいです。
        </P>
      </JournalArticle>
      <JsonLd data={buildJournalJsonLd(SLUG)} />
    </>
  );
}
