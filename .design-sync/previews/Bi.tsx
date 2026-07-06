import { Bi } from "@taro/design-system";

// EN-led bilingual pair: English primary, Japanese (mincho) added beneath.
// The primitive sets en + ja as adjacent inline spans (no separator of its
// own), so a caller supplies the brand's spacing — here the ideographic space
// used across the site's EN-led pairs.
export const TitlePair = () => (
  <div style={{ padding: 24 }} className="font-serif text-heading">
    <Bi en="First Light Voyage" ja="　夜明けの航跡" />
  </div>
);

export const CredoPair = () => (
  <div style={{ padding: 24, display: "grid", gap: 20 }} className="text-subhead">
    <Bi en="Encounter" ja="　出会う" />
    <Bi en="Wait" ja="　待つ" />
    <Bi en="Space" ja="　余白" />
  </div>
);

export const EnglishOnly = () => (
  <div style={{ padding: 24 }} className="font-serif text-heading">
    <Bi en="Selected Landscapes" />
  </div>
);
