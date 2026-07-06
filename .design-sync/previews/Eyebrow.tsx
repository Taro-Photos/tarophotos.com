import { Eyebrow } from "@taro/design-system";

// Small UI-sans label, wide tracking, uppercase — the section/kicker marker.
export const SectionKicker = () => (
  <div style={{ padding: 24 }}>
    <Eyebrow>Selected Work</Eyebrow>
    <h2 className="font-serif text-heading" style={{ marginTop: 10 }}>
      First Light Voyage
    </h2>
  </div>
);

export const NumberedSection = () => (
  <div style={{ padding: 24 }}>
    <Eyebrow>01 — Color</Eyebrow>
  </div>
);

export const AsHeadingTag = () => (
  <div style={{ padding: 24 }}>
    <Eyebrow as="h2">About the Photographer</Eyebrow>
  </div>
);
