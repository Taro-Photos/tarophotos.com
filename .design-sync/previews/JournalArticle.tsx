import { JournalArticle, Lead, P, H2, Quote, Rule, Prose } from "@taro/design-system";

// 記事の共通フレーム。見出し・カバー・前後ナビは slug からレジストリ導出、
// 本文だけを prose キット（<Lead>/<P>/<H2>/<Quote> 等）の children で渡す。
export const Default = () => (
  <JournalArticle slug="waiting-for-first-light">
    <Lead>
      元日の朝、まだ暗いうちに山へ上がる。ダイヤモンド富士を、ただ待つ。
    </Lead>
    <P>
      撮ることの大半は、待つことでできている。三脚を立て、構図を決め、
      あとは光が来るのを待つ。
    </P>
    <H2>閾のこちら側</H2>
    <Prose>{`夜と朝のあいだには、はっきりした境目がない。空の色が少しずつ入れ替わっていくだけだ。

その入れ替わりの数分間が、いちばん長く感じられる。`}</Prose>
    <Quote>迎えにいって、待つ。</Quote>
    <Rule />
    <P lang="en">The sun arrived exactly where the map said it would.</P>
  </JournalArticle>
);
