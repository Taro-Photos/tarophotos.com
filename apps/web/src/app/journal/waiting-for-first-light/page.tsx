// ─────────────────────────────────────────────────────────────
// サンプル記事（差し替え前提）。note のように長文を書くための雛形。
//
// ・地の文が続くところは <Prose>{`… \n\n …`}</Prose>（空行で段落に分かれる）
// ・リンクや強調を混ぜたい段落は <P> に JSX を入れる（<WorkLink>/<em>/<strong>）
// ・見出し=<H2>、引用=<Quote>、箇条書き=<Ul>/<Li>、写真=<Photo>、区切り=<Rule>
//
// 新規記事: このファイルを複製 → 本文を書く → `_content/journal.ts` に 1 エントリ追加。
// ※ 撮影地は 新富嶽百景「日出づる里」＝山梨県富士川町 髙下（たかおり）地区。
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
          元日の朝、まだ暗いうちに山を上がる。撮ることより、待つことの方がずっと長い。
          富士山頂に太陽が重なる、その一瞬を待っている。
        </Lead>

        <Prose>{`
場所は山梨県富士川町の髙下（たかおり）。新富嶽百景「日出づる里」と呼ばれる、ダイヤモンド富士で知られた斜面だ。冬至から元旦にかけての短いあいだだけ、富士山の頂と日の出がちょうど重なる。

いい時間帯は、たいてい寒い。手袋の指先が言うことをきかない。三脚はもう据えてある。あとは、その一瞬がこちらへ来てくれるのを待つだけだ。待っているあいだ、何を考えているかというと、実はあまり考えていない。撮る前のこの空白の時間が、わたしにとっては撮影のいちばん大事な部分なのかもしれない。
        `}</Prose>

        <Photo
          src="/series-gallery/first-light-voyage/first-light-voyage-02.webp"
          alt="夜明け前、遠くに富士山のシルエット"
          width={2560}
          height={1707}
          caption="日の出の少し前。まだ色の名前がつかない時間。"
          meta="07:04 · 日出づる里"
        />

        <H2>この作品集について</H2>

        <P>
          ここに置いた写真は、
          <WorkLink slug="first-light-voyage">First Light Voyage</WorkLink>
          という一連の作品集からのものだ。<em>年のいちばん最初の光</em>だけを、
          何度か通って撮った。同じ頂の、違う一日を並べている。
        </P>

        <Prose>{`
撮り方はいつも決まっている。特別なことは何もしない。強いて言えば、これくらいのことだ。
        `}</Prose>

        <Ul>
          <Li>暗いうちに上がって、立つ場所を決める</Li>
          <Li>頂に光が乗るまで、ただ待つ</Li>
          <Li>ほとんど撮らない。数枚で足りる</Li>
        </Ul>

        <H2>迎えにいって、待つ</H2>

        <Prose>{`
いい風景は、向こうからやって来るものではない。こちらが出向いて、そこで待つ。呼ばれるのを待つのではなく、迎えにいって、待つ。その順番だけは、いつも変わらない。

高村光太郎はこの眺めを「こんな立派な富士山は初めてだ」と言ったそうだ。文学碑の立つあたりが、いちばん頂と日の出が重なって見える。
        `}</Prose>

        <Quote>
          見過ごされたものに、静かに光を当てる。派手な瞬間ではなく、
          誰も見ていないあいだに起きていた小さな出来事の方を、撮りたいと思う。
        </Quote>

        <Prose>{`
やがて、頂の右肩のあたりが温度を持ちはじめる。ここからは早い。数十秒で、太陽が頂の真上に立つ。シャッターを切る回数はそれほど多くない。ほとんどは、さっきまでの長い待ち時間の中で、もう決まっている。
        `}</Prose>

        <Photo
          src="/series-gallery/first-light-voyage/first-light-voyage-03.webp"
          alt="富士山頂に太陽が重なるダイヤモンド富士"
          width={2560}
          height={1707}
          caption="山頂に、光がひとつ乗る。待っていた分だけ、静かに来る。"
          meta="07:21 · 日出づる里 高村光太郎文学碑"
        />

        <Prose>{`
数分もすれば、太陽はもう頂を離れて、ただの朝になっている。あの一瞬をもう一度と思っても、同じ光は二度と来ない。だからまた、次の冬のいちばん暗いうちに、この斜面を上がっていく。
        `}</Prose>
      </JournalArticle>
      <JsonLd data={buildJournalJsonLd(SLUG)} />
    </>
  );
}
