# AptisPlus cinematic motion v3

Creative thesis: **From unfamiliar exam to confident performance.**

## Inventory and boundaries

The prior landing animated outer .hero-listening-demo and a raster .hero-ribbon; typography was whole-span translation. A raster cannot expose its internal geometry. Replace the marketing hero with the exact three paths in the user's Downloads/aptisplus-symbol.svg. The supplied v3 TSX starter contains the same paths. Keep path data intact; original assets are preserved in public/brand. Landing branding uses AptisPlus; application routes, auth/profile storage, dashboard, deadlines, recordings and exam submission remain untouched.

## Storyboard and verification

| Scene | Actual DOM targets | Purpose / start → end | Trigger and timing | Reduced motion / small screens | Evidence |
|---|---|---|---|---|---|
| Brand formation | data-logo-trace, data-logo-body, data-logo-ribbon, data-logo-plus | Draw A outline, clip/reveal original body, unfurl ribbon, spring plus into position | One scoped master timeline, 0–2.5s; DrawSVG for outline only, clipping/transforms for fills | Original paths visible at rest, no forced intro | Browser entry video; inspect .3/.8/1.6/2.5s path transforms |
| Masked type | semantic H1 data-motion-title, SplitText hero-line masks | Three Vietnamese lines rise through masks with perspective; then support and CTA enter | SplitText type:lines, mask:lines, autoSplit:true; returned onSplit tween in master, .4–1.8s; stagger .14 | H1 readable without JS; reduced motion does not split; resize1440→768→390 | Video and actual line/mask measurements |
| Product assembly | data-exam-frame, data-preview-header, data-wave-bar, data-preview-answer, data-answer-selection | Perspective frame settles, header lays in, waveform builds center-out, options assemble and selection resolves | Master .95–3.1s, distinct internal timings; no infinite levitation | Complete static preview with working keyboard controls | Hero recording BEFORE implementing scroll story |
| Hero handoff | data-hero-mark, data-product-stage, data-hero-copy | Mark and interface travel toward next chapter as one composition | Reversible scrub timeline top→bottom, desktop only; never transform pinned wrapper | No scrub on coarse pointer or <900px | Stop/reverse at intermediate scroll positions and record |
| Four-skill chapter | data-skill-scene, data-story-progress, data-chapter-tab, per-scene HTML headlines | Listening sound/question → Reading paragraph/heading → Speaking image/mic → Writing email/cursor, synchronized narrative and marker | ScrollTrigger pin/scrub, four holds and three overlaps over ~3.6 viewport heights; different internal anatomy | All-four sequential scenes on mobile and reduced motion; no hidden content | 15–30s desktop video; midframes10/35/60/90%; mobile video |
| Exam resolution | data-final-preview, data-final-cta, data-final-ribbon | Resolve to believable exam preview and real /practice and /exam/listening actions | Final scroll sequence of trace, content and CTA; no fake timer/grade | Complete static UI and working actions | Video reaches CTA; route click tested |

## Delivery

Record to artifacts/motion-v3. Record hero FIRST and inspect sampled video frames before writing the four-skills implementation. Then record browser entry plus continuous scroll for15–30seconds, mobile fallback, reduced-motion/keyboard/resize and route checks. Export actual videos, not screenshot-only signoff. No dashboard/exam theatrical motion; favicon stays static.

## Verified delivery — 4 November 2026

Hero-first gate: implemented and recorded `hero-entrance.webm` before coding the chapter. Inspected decoded video frames at 0.2 / 0.7 / 1.5 / 2.8 seconds, including stroke draw, original body clip, ribbon transform, plus spring, SplitText masks and product internals.

Final production browser evidence is in `artifacts/motion-v3/`:
- `desktop-cinematic.webm`: actual Chromium video, 1440 × 900, approximately 27 seconds. Entry → four pinned chapters → reverse scrub → exam resolution. No timeline seeking or rendered video substitutes; browser scroll drives ScrollTrigger.
- `mobile-cinematic.webm`: actual Chromium touch/mobile video, 390 × 844. Entry and all four sequential scenes, then final action. Pinning disabled.
- `responsive-triptych.png` and `viewport-390.png`, `viewport-768.png`, `viewport-1440.png`: reduced-motion fallback at all required widths.
- `production-scroll-0.35.png`, `production-scroll-0.6.png`, `production-scroll-0.9.png`, and `scroll-0.1.png`: chapter captures. `scroll-inspection.json` records progress, per-scene opacity and inert status at 10 / 35 / 60 / 90%.
- `proof-hero-early.png`, `proof-hero-assembly.png`, `proof-reading-transition.png`, `proof-final.png`, `proof-mobile-writing.png`: decoded frames from the actual recordings, inspected visually. Screenshots supplement the videos.

Checks: production Next build and ESLint pass. All 11 existing functional tests pass after adapting the obsolete landing showcase expectation. Added two meaningful checks: scrub forward/back, keyboard navigation, resize cleanup; and JavaScript-disabled complete narrative. Login/register/dashboard/practice/four exam routes return 200. No changes to auth, attempt storage, dashboard calculations, recording, deadlines or submission logic.

Reduced-motion: no SplitText or pinning; full readable layout. JavaScript disabled: semantic text, original SVG, all four scenes and CTA remain visible. Resize 1440 → 768 → 390 removes pin spacer and inactive-scene inert attributes. Original favicon remains static.

Performance review: scoped useGSAP/matchMedia cleanup; no global killAll, perpetual logo loops, large animated blur or layout-property tweening. Production recordings captured no page errors or horizontal overflow. In the instrumented desktop and mobile Chromium runs there were no >50ms long tasks after the first 3.5 seconds. Raw rAF and long-task samples are in `*-metrics.json`. Headless measurements are diagnostic, not a claim of guaranteed frame rate on every device. Browser capture ran while regression tests were active.

Reproduce with `node scripts/record-cinematic.mjs` against production on port 3002. Hero gate recording script: `scripts/record-hero.mjs`. Route/responsive verification: `scripts/verify-motion-delivery.mjs`. Automated tests: `E2E_BASE_URL=http://localhost:3002 npx playwright test` (set environment variable using the host shell).

## Aim opening — first-visit white stage

Added an isolated 5.5-second opening before the existing hero. 0.12s: masked SplitText words ask “Bạn muốn chạm tới B2 hay C1?”. 0.55s: DrawSVG orbit forms from two circles and 48 independent tick paths. 0.85s: A1 → A2 → B1 → B2 → C1 → C2 arrive in sequence; B2/C1 receive a restrained emphasis. 1.7s: 16 independently generated inline SVG glyphs (sound, book, microphone, writing, plus) assemble with sine/cosine polar positioning. 3.05s: levels and glyphs accelerate radially outward with distinct primary/secondary timing. 3.8s: “Bắt đầu từ hôm nay.” 4.65–5.5s: the white stage retracts and starts the existing hero timeline, rather than running the hero unseen behind the opening.

Vectors are original code-native SVG, exported by `aim-svg-parts.tsx`; the consulted imagegen skill is for raster output and explicitly routes editable SVG geometry to native code. No raster is falsely presented as vector or AI-generated image output. The existing AptisPlus logo remains unchanged.

Scope: landing only. Session-once preference (`aptisplus-aim-opening-v1`), visible Skip, Escape, modal focus containment, inert background and temporary scroll lock with cleanup. Reduced-motion skips opening; runtime preference changes release it immediately. Hash deep-links skip opening. JavaScript-disabled SSR remains readable because overlay display is enabled only on the client. Blocking sessionStorage does not break entry.

Verification: production build, lint and typecheck pass. 15 Playwright tests pass, including Skip/session-once/focus/scroll restoration and Escape/reduced-motion behavior. Real production Chromium recordings: `artifacts/aim-opening/desktop-opening.webm` and `mobile-opening.webm`. Inspected decoded video frames for orbit assembly, radial burst and handoff. Both viewports finish with hero complete, no horizontal overflow, no inert background and no page errors. Reproduce with `E2E_BASE_URL=http://localhost:3002 node scripts/record-aim-opening.mjs` using the host shell's environment syntax. Close/reopen the tab to see a fresh session, or remove only the above sessionStorage key for repeat review.

## Current cinematic revision
The latest user brief extends the opening to six scenes with genuine path reassembly and matched header flight. Current storyboard/manifest: `CINEMATIC_STORYBOARD.md`. Architecture, concept provenance/prompt, modified files and measured verification: `artifacts/cinematic-v4/DELIVERY.md`. Latest production recordings: `artifacts/cinematic-v4/desktop-experience.webm` (25.60s) and `mobile-experience.webm` (24.88s). These supersede the earlier opening-only captures. Use the footer “Xem lại mở đầu” control to replay the session-once intro.

## Playback lifecycle correction — current behavior
Full document homepage loads and refresh now replay the cinematic intro every time. Client-side returns do not autoplay. No persistent storage gate is used. Manual replay, reduced motion and original choreography remain intact. Current implementation and browser evidence: `INTRO_LIFECYCLE.md`. Earlier session-once notes in this historical motion map are superseded by this lifecycle update.
