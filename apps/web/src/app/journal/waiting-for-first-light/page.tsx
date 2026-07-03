// ─────────────────────────────────────────────────────────────
// サンプル記事（差し替え前提）。note のように長文を書くための雛形。
//
// ・地の文が続くところは <Prose>{`… \n\n …`}</Prose>（空行で段落に分かれる）
// ・リンクや強調を混ぜたい段落は <P> に JSX を入れる（<WorkLink>/<em>/<strong>）
// ・見出し=<H2>、引用=<Quote>、箇条書き=<Ul>/<Li>、写真=<Photo>、区切り=<Rule>
//
// 新規記事: このファイルを複製 → 本文を書く → `_content/journal.ts` に 1 エントリ追加。
// ─────────────────────────────────────────────────────────────
import {
  JournalArticle,
  Lead,
  Prose,
  P,
  H2,
  Quote,
  Ul,
  Li,
  WorkLink,
  Photo,
} from "@/components/journal";
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

        <Prose>{`
いい時間帯は、たいてい人がいない。まだ眠っている街のはずれで、水面が少しずつ色を変えていくのを見ている。カメラはもう構えてある。あとは、その一瞬がこちらへ来てくれるのを待つだけだ。

待っているあいだ、何を考えているかというと、実はあまり考えていない。寒さと、遠くの物音と、指先の感覚くらいのものだ。撮る前のこの空白の時間が、わたしにとっては撮影のいちばん大事な部分なのかもしれない。
        `}</Prose>

        <Photo
          src="/series-gallery/first-light-voyage/first-light-voyage-02.webp"
          alt="夜明け前の静かな水面"
          width={2560}
          height={1707}
          caption="空がほどける少し前。まだ色の名前がつかない時間。"
          meta="04:52 · 東京湾"
        />

        <H2>この作品集について</H2>

        <P>
          ここに置いた写真は、
          <WorkLink slug="first-light-voyage">First Light Voyage</WorkLink>
          という一連の作品集からのものだ。夜明けの海辺だけを、何度も通って撮った。
          <em>同じ場所の、違う一日</em>を並べている。
        </P>

        <Prose>{`
撮り方はいつも決まっている。特別なことは何もしない。強いて言えば、これくらいのことだ。
        `}</Prose>

        <Ul>
          <Li>暗いうちに出て、場所を決める</Li>
          <Li>光が来るまで、ただ待つ</Li>
          <Li>ほとんど撮らない。数枚で足りる</Li>
        </Ul>

        <H2>迎えにいって、待つ</H2>

        <Prose>{`
いい風景は、向こうからやって来るものではない。こちらが出向いて、そこで待つ。呼ばれるのを待つのではなく、迎えにいって、待つ。その順番だけは、いつも変わらない。
        `}</Prose>

        <Quote>
          見過ごされたものに、静かに光を当てる。派手な瞬間ではなく、
          誰も見ていないあいだに起きていた小さな出来事の方を、撮りたいと思う。
        </Quote>

        <Prose>{`
やがて、水平線のあたりが温度を持ちはじめる。ここからは早い。数分で世界が入れ替わる。シャッターを切る回数はそれほど多くない。ほとんどは、さっきまでの長い待ち時間の中で、もう決まっている。
        `}</Prose>

        <Photo
          src="/series-gallery/first-light-voyage/first-light-voyage-03.webp"
          alt="最初の光が差し込む風景"
          width={2560}
          height={1707}
          caption="最初のひと差し。待っていた分だけ、静かに来る。"
          meta="05:11 · 東京湾"
        />

        <Prose>{`
撮り終えて三脚を畳むころには、もうすっかり朝になっている。人が動きはじめ、さっきまでの静けさが嘘のようだ。あの数分をもう一度と思っても、同じ光は二度と来ない。だからまた、次の暗いうちに出かけていく。
        `}</Prose>
      </JournalArticle>
      <JsonLd data={buildJournalJsonLd(SLUG)} />
    </>
  );
}
