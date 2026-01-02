# Motion Design Guidelines

_Last updated: September 30, 2025_

## Purpose
- Anchor the "Move with the Moment" brand statement with subtle, continuous motion.
- Provide reusable patterns that respect accessibility preferences and guard against layout/jank regressions.

## Core Principles
1. **Motion follows intent** – animations reinforce the narrative (hero stories, gallery storytelling, section reveals) and never block interaction.
2. **Respect `prefers-reduced-motion`** – every animation must fall back to a static presentation. The shared `MotionProvider` enforces this automatically.
3. **GPU-friendly effects** – rely on transforms and opacity; avoid animating expensive properties (e.g. shadows or blur).
4. **Keep timing natural** – default to 320–480 ms with `cubic-bezier(0.22, 1, 0.36, 1)` easing unless a component requires a shorter response.

## Implementation Overview
- `src/app/_components/MotionProvider.tsx` wraps the App Router layout and configures `framer-motion` with runtime reduced-motion detection.
- `src/app/_hooks/usePrefersReducedMotion.ts` offers a cached hook for components that need to branch logic outside of `framer-motion` primitives.
- `HeroTrailer` uses cinematic cross-fade + 6–8% slow zoom on rotation, with CTA caption motions synchronized per frame. Reduced-motion mode swaps to instant frame switching.
- `RevealSection` (IntersectionObserver powered) applies single-fire fade + 12px translate reveals across content-heavy sections.
- `SeriesGallery` lightbox animates its overlay, modal container, and image slides. Forward/backward navigation is instrumented with directional offsets and arrow button emphasis.

## Usage Guidelines
- Wrap new animated regions with `MotionProvider` context already provided at the layout level; avoid nesting additional providers unless you need specific overrides.
- Prefer `RevealSection` for scroll-in reveals. Staggered sequences can be achieved with the `delay` prop in 80 ms increments.
- For component-specific motion (e.g. hero cards), co-locate animation constants (easing, durations) at the top of the file for reuse and easier tuning.
- When adding new lightbox or overlay transitions, mimic `SeriesGallery`'s `transitionDirection` pattern so keyboard navigation stays in sync with motion cues.

## Testing & Monitoring
- Vitest exercises `prefers-reduced-motion` behaviour for the hero and gallery; keep adding targeted tests whenever motion logic branches.
- Run `npm run lint`, `npm run test`, and focused Playwright specs (`npm run test:e2e`) after motion changes to guard against accessibility regressions.
- Capture web-vitals snapshots (LCP, CLS) before/after large motion additions and store them with the associated issue or PR comment.
