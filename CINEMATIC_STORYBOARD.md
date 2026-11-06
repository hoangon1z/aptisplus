# AptisPlus — From Ambition to Achievement

## Audit / boundaries
Next.js App Router 16.4.5; React 19; GSAP 3.15.1, @gsap/react, shadcn/Radix. Landing entry: src/components/landing.tsx. Existing opening: AimOpening; exact A+, body/ribbon/plus: aptisplus-symbol.tsx and public/brand/*.svg. Existing hero uses masked SplitText + actual SVG/product layers. FourSkillsStory already uses scoped pin/scrub and mobile/reduced fallback. Keep auth/dashboard/exams/storage unchanged.

Previous opening lacked convergence into the actual brand, matching header placement, replay, semantic labels, and drawn trajectories. This iteration replaces only the intro choreography and the landing header handoff.

## Creative storyboard (before implementation)
| Label | Time | Composition / targets | Technique / continuity |
|---|---|---|---|
| intro:start | 0–.7 | White; a single fine central stroke | DrawSVG with anticipation; no big logo or loading counter |
| text:question | .65–2.3 | Exact semantic Vietnamese question, two lines; B2/C1 primary | SplitText masks, independently rotated words, selective target emphasis |
| levels:enter | 2.15–3.6 | Six independent CEFR labels arranged on an arc with distinct depth and hierarchy | Per-object trajectories/rotation/scale; not six identical cards |
| levels:expand | 3.65–5.1 | Levels follow six selected angles; curved trails + purposeful ribbon strips | MotionPath + DrawSVG; no arbitrary random particles |
| logo:assemble | 5.05–6.55 | Fragments converge; exact A body and ribbon progressively reveal, plus settles | Real supplied path geometry partitioned by meaningful clip regions; DrawSVG outline only; filled path clip/transforms |
| hero:reveal | 6.55–7.8 | Completed symbol travels from center to actual header symbol bounds; wordmark/nav/hero continue | Bounding-box-matched translation/scaling, white stage retracts below moving symbol, header cross-handoff at identical position |
| intro:complete | 7.85 | Logo at header; page scroll/focus restored | Session-once, skip/replay and immediate reduced-motion fallback |

Reference reviewed: https://madewithgsap.com/ — principles of coordinated scroll/mouse/typographic motion and efficient DOM implementation only; no source/assets copied. Image generation is used for an original concept sheet; raster reference stays separate from DOM SVG production assets.

## Asset manifest
- exact-brand-body-left / body-crown / body-right: three clip regions of the SAME supplied A_BODY path. Preserve final silhouette; converge from meaningful left/crown/right directions.
- exact-brand-ribbon-rear / ribbon-front: clip regions of supplied A_RIBBON; layer overlap during fold/reveal, original silhouette at rest.
- exact-brand-plus: supplied A_PLUS; independent counter-rotation and final settle.
- brand-outline: supplied A_BODY with stroke and DrawSVG; never DrawSVG filled body.
- seed-stroke: short indigo path, the initial point of ambition; develops into first trail.
- trajectory-01..06: original cubic Bézier guide strokes; one for each level, purposefully arranged angles.
- ribbon-fragment-01..06: original tapered curved SVG bands; expand along guides, return toward matching brand structure.
- geometric accents: existing original lightweight SVG glyphs used sparingly, not random particles.
- CEFR A1/A2/B1/B2/C1/C2: actual DOM typography, individual transforms and accessible semantic text.
- header mark: exact AptisPlus symbol component, DOM-measurable target; existing full wordmark image continues behind it.

## UX / implementation checks planned
One scoped master timeline with labels; useGSAP cleanup; no setTimeout sequencing. Session-once and explicit Replay; Skip/Escape; inert background and scroll release on completion/skip/preference change/unmount. No stored goal unless explicit input; intro itself does not infer proficiency. No-JS semantic page readable. 390/768/1440; recorded real-time desktop/mobile; scrutinize expanding trails, logo assembly and header arrival. Build/lint/types + regression tests + replay/skip/session/reduced-motion checks.
