# Landing extension design notes

Documentation pass: 2026-11-04. Scope: the code-led extension in `src/components/landing.tsx`, `src/components/landing/`, the extended hero/four-skills components, and `src/lib/motion/use-scroll-artwork.ts`. Direction: `LANDING_STORYBOARD.md`; implementation and verification manifest: `LANDING_DELIVERY.md`.

## Continuity with the incumbent system

This extends the existing AptisPlus cinematic landing. Inter, editorial Vietnamese headings, navy ink, indigo emphasis, lavender selection states, product demonstrations and the supplied folded A+ establish continuity. The new route, shared signal, exploded exam, practice branches and final convergence develop that vocabulary rather than introduce a new visual identity. Existing intro and hero lifecycle remain the entry mechanism; the four-skills extension uses its existing master and one desktop pin.

Compared `PRODUCT.md`, the incumbent `DESIGN.md` frontmatter/body, `.impeccable/design.json`, extension CSS, motion lifecycle and supplied `public/brand/aptisplus-symbol.svg`. The exported `A_BODY`, `A_RIBBON` and `A_PLUS` in `motion/aptisplus-symbol.tsx` retain the supplied path geometry. The supplied indigo/lavender gradients also remain. New inline SVG routes, branches, leaders, contours and signals are original controllable geometry; the supplied mark itself is reused, not represented as a newly invented asset. The concept reference is a planning artifact, not runtime artwork.

## Observed extension values

| Concern | Implementation evidence |
|---|---|
| Palette | Primary emphasis `#514fe4`, navy `#161a35`, selected lavender `#eeedff`, cool study ground `#f8f9fd`, white editorial intervals. Supporting prose `#626a83`; corrected quiet branch/control foreground `#656b83`. |
| Type | Inter throughout; section headings `clamp(34px, 4.1vw, 62px)`, weight 550, line-height 1.13, tracking -0.035em. Body 15px/1.85, max-width 65ch. Finale heading `clamp(38px, 4.8vw, 70px)`. These are observed surface choices, not replacements for root typography tokens. |
| Rhythm | Desktop sections use 110px vertical space and 5.5% gutters; journey ends with 55px bottom space. Split layouts use 8–12% gaps. Below 899px, main sections use 75px/24px; below 500px, 62px/20px. |
| Shape/depth | Rounded exam layers and answer controls, fine borders and restrained shadows preserve the floating-interface vocabulary. Open SVG lines carry narrative connections; editorial sections remain spacious rather than becoming repeated cards. |
| Responsive | One-column editorial splits below 899px; exam composition simplifies at 1100px and 768px. At 768px and below, SVG CEFR labels increase to 48px/60px in viewBox units, coverage labels to 22px, study tab labels to 12px; tiny CEFR captions are hidden. |
| Interaction | Native inputs, bookmark/navigation state and FAQ details remain usable. Study steps select explanations and real destinations. Publication states do not imply working billing or verified customer evidence. |

## Motion and fallback contract

`useScrollArtwork` scopes GSAP through `useGSAP`, constructs motion only for `prefers-reduced-motion: no-preference`, and reverts matchMedia and SplitText on cleanup. The common section scrub runs from `top 78%` to `bottom 45%` with 0.65 smoothing; finale uses `clamp(bottom bottom)` to reach its resolved state. SplitText uses line masks and automatic re-splitting. DrawSVG reveals authored contours/routes, MotionPath moves the journey traveler, and MorphSVG develops the shared skill signal through the existing skill master.

Four-skills pinning requires width at least 900px, a fine pointer and normal motion. Mobile/coarse-pointer layouts avoid that pin. Reduced motion retains complete static artwork and readable content. The documented browser evidence reports one pin spacer on normal-motion desktop, zero on mobile and reduced-motion viewports, no horizontal overflow and no logged errors in the sampled normal-motion sizes.

## Product truth

The owner confirmed that prices and approved student stories are unavailable. `pricingPlans` and `studentStories` are empty typed arrays; the landing publishes explicit unpublished states. New evidence must be approved before replacing them. No invented prices, entitlements, customer quotations, grades or checkout are justified by this extension.

AI grading remains unconnected. This is a local frontend: insights represent actual local submitted attempts, duration and skill coverage, not proficiency or CEFR scoring. Study steps are self-directed. Sample Listening speech uses browser synthesis and its real playback budget; a sample does not submit a full exam. General CEFR A1–C2 route labels do not promise that every level is covered by Aptis General.

## Pre-existing documentation drift, preserved

`DESIGN.md` and `.impeccable/design.json` still name Aptis Studio, describe the older raster pleated ribbon as the primary public decoration, and claim a unified indigo system across exam/workspace surfaces. The current landing identity is AptisPlus with the supplied folded A+ SVG. Root runtime CSS still declares other-application brand `#5055d8` and exam `#23085a`; these existing values are retained. The documentation's instruction against previous exam violet therefore does not describe every runtime surface. This pass records that drift without changing the existing design files or broadening this landing task into an application-wide rebrand.

## Evidence and review limits

Checked source values and artifact inventory, including `.impeccable/review/desktop.png`, `user-768.png`, `mobile.png`, normal-motion section images and the 1440/390 recordings in `artifacts/ultimate-landing/`. Visually inspected the normal-motion desktop hero image to confirm the A+ mark, Inter hierarchy, floating Listening preview and navy/indigo/lavender continuity. Read `browser-checks.json` for the sampled overflow/pin results. This documentation pass does not independently rerun the browser suite or claim to have watched the complete recordings.

`LANDING_DELIVERY.md` records 21 passing production tests, lint and build, and the first review's contrast/mobile-label fixes. The finish reviewer subsequently scored both fixes resolved with disposition `ship`; its verdict is limited to that fix list. This document does not substitute a whole-surface ship verdict. No app code, root design tokens or sidecar was rewritten by this pass.

## Exam preview reference correction — 2026-11-04

For section 5, the earlier exploded exam composition, rounded floating exam layers, annotation leaders and related motion descriptions above and in `LANDING_DELIVERY.md` are superseded by this reference correction. The user requested the previously supplied exam reference: a plain white surface, Inter and exam violet `#23085a`.

`src/components/landing/exam-experience.tsx` and `src/components/landing/exam-preview.module.css` now present Question 1 of 17, a running clock and progress line, simple Play/Stop controls with a two-start budget, squared A/B/C answers and a bottom toolbar. The left drawer lists 17 entries: two interactive inline samples and links to the full exercises for the remaining entries. Bookmark filtering, dark mode, magnification and the information panel are functional. Material Symbols Rounded is self-hosted. This correction does not change authentication, dashboard or full-exam logic.

Evidence is recorded in `artifacts/exam-preview-fix/`, including desktop/mobile room, list, access and information-panel screenshots and preview recordings. The implementation pass reports zero browser errors and no horizontal overflow at 1440px and 390px, passing build and lint, and three passing landing tests. Independent review found the reference fidelity matched; the final information-panel fix is undergoing its separate verdict check. These are reported implementation results, not checks rerun by this documentation pass.
