// design-sync bundle entry — the scoped export surface for the TARO Design
// System. Hand-authored (the DS is inline in the Next app with no library
// barrel) so the bundle exposes exactly these components and nothing else
// (pages, route handlers, layouts must never enter the bundle).

// ── Primitives (src/design-system) ──────────────────────────────────────
export { Wrap, Hairline, Eyebrow, Num, Exif, Ja, Bi } from "@/design-system";

// ── Composed sections (src/components) ──────────────────────────────────
export { Hero } from "@/components/home/Hero";
export { About } from "@/components/home/About";
export { SeriesIndex } from "@/components/home/SeriesIndex";
export { SiteHeader } from "@/components/site/SiteHeader";
export { SiteFooter } from "@/components/site/SiteFooter";
export { ContactForm } from "@/components/contact/ContactForm";
export { WorksIndex } from "@/components/works/WorksIndex";
export { SeriesDetail } from "@/components/series/SeriesDetail";
export { LegalPage } from "@/components/legal/LegalPage";
