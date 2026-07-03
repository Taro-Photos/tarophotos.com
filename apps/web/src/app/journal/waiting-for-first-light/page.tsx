// ─────────────────────────────────────────────────────────────
// サンプル記事（差し替え前提）。
// 新しい記事を書くときは、このファイルを雛形にして本文を <Lead>/<P>/<Photo>/
// <H2>/<Quote>/<Rule> で組み、`_content/journal.ts` の journalIndex に
// 対応する 1 エントリ（slug/title/date/excerpt/cover）を追加するだけ。
// ─────────────────────────────────────────────────────────────
import { JournalArticle, Lead, P, H2, Quote, Photo } from "@/components/journal";
import { JsonLd } from "@/app/_components/JsonLd";
import { buildJournalMetadata, buildJournalJsonLd } from "@/app/_content/journal";

const SLUG = "waiting-for-first-light";

export const metadata = buildJournalMetadata(SLUG);

export default function Page() {
  return (
    <>
      <JournalArticle slug={SLUG}>
        <Lead>
          港がまだ暗いうちに三脚を立てる。撮ることより、待つことの方がずっと長い。
          光が来るのを、ただ待っている。
        </Lead>

        <P>
          いい時間帯は、たいてい人がいない。まだ眠っている街のはずれで、水面が少しずつ
          色を変えていくのを見ている。カメラはもう構えてある。あとは、その一瞬が
          こちらへ来てくれるのを待つだけだ。
        </P>

        <P>
          待っているあいだ、何を考えているかというと、実はあまり考えていない。
          寒さと、遠くの物音と、指先の感覚くらいのものだ。撮る前のこの空白の時間が、
          わたしにとっては撮影のいちばん大事な部分なのかもしれない。
        </P>

        <Photo
          src="/series-gallery/first-light-voyage/first-light-voyage-02.webp"
          alt="夜明け前の港、静かな水面"
          width={2560}
          height={1707}
          caption="空がほどける少し前。まだ色の名前がつかない時間。"
          meta="04:52 · 東京湾"
        />

        <H2>迎えにいって、待つ</H2>

        <P>
          いい風景は、向こうからやって来るものではない。こちらが出向いて、
          そこで待つ。呼ばれるのを待つのではなく、迎えにいって、待つ。
          その順番だけは、いつも変わらない。
        </P>

        <Quote>
          見過ごされたものに、静かに光を当てる。派手な瞬間ではなく、
          誰も見ていないあいだに起きていた小さな出来事の方を、撮りたいと思う。
        </Quote>

        <P>
          やがて、水平線のあたりが温度を持ちはじめる。ここからは早い。数分で
          世界が入れ替わる。シャッターを切る回数はそれほど多くない。ほとんどは、
          さっきまでの長い待ち時間の中で、もう決まっている。
        </P>

        <Photo
          src="/series-gallery/first-light-voyage/first-light-voyage-03.webp"
          alt="最初の光が差し込む港の風景"
          width={2560}
          height={1707}
          caption="最初のひと差し。待っていた分だけ、静かに来る。"
          meta="05:11 · 東京湾"
        />

        <P>
          撮り終えて三脚を畳むころには、もうすっかり朝になっている。人が動きはじめ、
          さっきまでの静けさが嘘のようだ。あの数分をもう一度と思っても、同じ光は
          二度と来ない。だからまた、次の暗いうちに出かけていく。
        </P>
      </JournalArticle>
      <JsonLd data={buildJournalJsonLd(SLUG)} />
    </>
  );
}
