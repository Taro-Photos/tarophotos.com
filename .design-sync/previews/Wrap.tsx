import { Wrap, Eyebrow, Exif } from "@taro/design-system";

// Centered content column — max-width `measure`, responsive gutter. The
// backing tone makes the column bounds visible in the card.
export const ContentColumn = () => (
  <Wrap
    as="section"
    style={{
      backgroundColor: "var(--color-paper-deep)",
      paddingTop: 44,
      paddingBottom: 44,
    }}
  >
    <Eyebrow>Selected Landscape</Eyebrow>
    <h3 className="font-serif text-heading" style={{ marginTop: 12 }}>
      First Light Voyage
    </h3>
    <p className="font-serif text-body" style={{ marginTop: 16, maxWidth: 560 }}>
      The harbor before anyone arrives. I did not chase the beautiful; I waited
      where it might find me.
    </p>
    <div style={{ marginTop: 20 }}>
      <Exif>04:52 · 那須塩原 · SONY α7R IV · 24mm · ƒ/8 · 30s · ISO 64</Exif>
    </div>
  </Wrap>
);
