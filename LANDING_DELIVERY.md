# AptisPlus — cinematic landing extension

## Creative direction

The supplied A+ folded mark acts as the visual grammar: ambition becomes a CEFR route, then a shared skill signal, an interactive exam workspace, a learning trace, and a final assembled mark. White/off-white editorial intervals alternate with navy skill/story/finale stages. Inter and the existing indigo/lavender palette are preserved. This is an extension of the incumbent brand; dashboard and exam visual systems were not redesigned.

The existing intro implementation and document-entry lifecycle are preserved. Full document loads replay; client-side navigation does not automatically replay; Skip and the footer replay control remain functional. The hero continues its SplitText entrance, exact supplied A+ construction and coordinated product-preview entrance.

## Delivered sections and files

| Order | Surface | Implementation |
|---|---|---|
| 1 | Protected intro | Existing `motion/aim-opening`, `intro-timeline`, `intro-vector-rig`, `document-entry` |
| 2 | Hero | `motion/aptisplus-motion-hero.tsx` + added drawn contour filaments |
| 3 | Learning Journey | `landing/learning-journey.tsx` |
| 4 | Connected four skills | `motion/four-skills-story.tsx`, `landing/skill-signal.tsx` |
| 5 | Interactive exploded exam | `landing/exam-experience.tsx` |
| 6 | Real practice insights | `landing/progress-insights.tsx` |
| 7 | Self-directed study path | `landing/study-path.tsx` |
| 8 | Student stories / unpublished | `landing/student-stories.tsx` |
| 9 | Why AptisPlus / controls | `landing/why-aptisplus.tsx` |
| 10 | Pricing / unpublished | `landing/pricing.tsx` |
| 11 | Categorized native FAQ | `landing/faq.tsx` |
| 12 | Full-screen convergence CTA | `landing/final-cinematic-cta.tsx` |

Components are composed in `src/components/landing.tsx`. Shared extension styles: `landing/landing-journey.module.css`. Shared animation lifecycle: `src/lib/motion/use-scroll-artwork.ts`. Content models: `src/lib/landing-content.ts`. Existing `icon.tsx` gained Sun/Moon mappings for the working theme demo. No new dependencies.

## SVG layer manifest

All shipped extension artwork is original code-native inline SVG, with independently addressable geometry. No flattened concept image is used in the runtime.

| Artwork | Layers / selectors | Motion |
|---|---|---|
| Hero contours | `data-hero-contour` ×2, existing exact A body/ribbon/plus | DrawSVG in existing hero master |
| CEFR route | `data-learning-route`, `data-route-echo` ×2, `data-level-ribbon` ×2, `data-level-marker` ×6, traveler | DrawSVG, MotionPath, folded ribbon transforms; normal scrub |
| Shared skill rig | `data-skill-signal` ×5 plus frame guide | MorphSVG through wave → text baselines → voice contour → editor lines in the existing pinned master |
| Exam leaders | `data-exam-leader` ×3 and annotation labels; actual DOM layers `header/question/nav` | Explode → line reveal → reassemble; real controls remain clickable |
| Progress branches | `data-progress-branch`, `data-progress-node`, `data-progress-label` ×4 | DrawSVG and clipped labels; values from local attempts |
| Study route | `data-study-route`, `data-study-branch`, `data-study-checkpoint` | DrawSVG and sequential checkpoints; selected explanation and real route link |
| Story folio | `data-story-line`, `data-story-sheet` | Stroke reveal and restrained sheet alignment |
| Why details | `data-why-contour` ×2, `data-detail-rule` ×3 | Contour reveal and rule growth; interactive controls separate from animation |
| Pricing route | `data-pricing-path` ×2 | Paired line reveal |
| Finale | `data-finale-strand` ×4, `data-finale-outline`, `data-finale-body`, `data-finale-ribbon`, `data-finale-plus` | Moving stroke windows converge; exact mark resolves through clip and transform |

`A_BODY`, `A_RIBBON`, `A_PLUS` are the existing user-supplied brand paths exported by `motion/aptisplus-symbol.tsx`, not regenerated substitutes.

## Timeline architecture

- Intro: existing master, untouched by this extension. Hero starts through the existing reveal callback.
- Hero: existing coordinated master plus contour reveal at 0.3 seconds. Existing scroll handoff remains desktop-only.
- Four skills: a single pinned ScrollTrigger; existing scene transitions share the same master with the five morphing signal paths. No second skill pin.
- Other narrative sections: one scoped timeline per section, normal scroll scrub from `top 78%` to `bottom 45%`. Finale overrides the end to `clamp(bottom bottom)` so it can completely resolve before maximum document scroll. Each section authors its own geometry sequence. Editorial headings use SplitText line masks with automatic re-splitting; FAQ remains native details.
- Finale labels: `skills:converge`, `brand:resolve`, `invitation:ready`.
- Lifecycle: `useGSAP` scopes selectors and reverts its context; matchMedia owns responsive/reduced variants; SplitText instances revert on unmount. Reduced motion leaves complete static artwork and readable content. Mobile has no pinned skills section.

## Sources and truthful public states

The owner confirmed on 2026-11-04: no prices or approved student stories exist yet; display unpublished states. `pricingPlans` and `studentStories` are typed empty arrays. No invented prices, free tiers, testimonials, grades, customer identities or checkout URLs are published. Story entries require consent, verification timestamp and source reference before editorial publication. No paid plan is inferred from current demo access.

Practice sample content comes from the existing `src/lib/exams.ts` Listening prompts/options/audio scripts. Its audio uses browser speech synthesis and is labeled as such, limited to two starts per sample. The sample uses actual React input, bookmark and navigation state; it does not submit a real attempt. Full exercises retain their existing destinations.

Insights use the existing browser `aptis-attempts` records and genuine submitted duration/skill coverage. They explicitly distinguish practice counts from CEFR or AI scores. Study steps are self-directed explanations, not an automated personalized recommendation service. AI grading is not connected. Local history is not cross-device synced.

General format note links to [British Council preparation guidance](https://www.britishcouncil.org/exam/english/aptis/prepare-general), including the core Grammar & Vocabulary section. A1–C2 in the journey is labeled as general CEFR, not an assertion that every level is covered by the General test variant.

## Concept provenance

`artifacts/ultimate-landing/concept-reference.png` is an original AI-generated storyboard reference, produced with the built-in image generation tool during this task. It is **not a deployed website asset**. Direction: six white/off-white and navy panels, indigo/lavender folded ribbons connecting a CEFR route, waveform-to-text-to-speech/editor signal, exploded exam layers, structural skill coverage without fabricated scores, a five-step self-directed study route, and final A+ convergence. No people, prices, certificates or testimonials. The runtime SVGs were authored as geometry in the files listed above.

Reference sites were consulted for principles only: GSAP/MadeWithGSAP for choreography, Apple for product focus and restraint, Linear for editorial product detail. Meta Muse was requested but the fetched page returned no readable content; no claim of inspecting inaccessible reference content is made.

## Verification evidence

Staged screenshots live in `artifacts/ultimate-landing/stage-a-*`, `stage-b-*`, `stage-c-*`. Stage A tested shared skill morph/route composition; B tested the sample exam, real/empty insights and study navigation; C tested honest publication states, bookmark and FAQ.

Final recordings: `artifacts/ultimate-landing/landing-1440.webm` and `landing-390.webm`. These are real-time Chromium captures, including the complete intro and actual scroll, not stitched stills or GSAP timeline seeks. Settled full-page captures at 1440, 768 and 390 are in `.impeccable/review/`. Normal-motion section captures and `browser-checks.json` are in the artifact folder. Recordings are recaptured if material fixes change the final build.

Automated checks include intro refresh across three document loads, Skip/Replay, client-side navigation suppression, keyboard tabs, reduced motion, no-JavaScript content, responsive pin cleanup, exam flows, local data persistence, sample answer/bookmark preservation and playback budgets, native FAQ keyboard operation, and animated-preview pointer usability.

Final check results and finish-review disposition are appended after the final evidence pass. Performance measurements are local lab observations, not a guarantee for all devices or networks. No SEO ranking guarantee is made.

## Final check log — 2026-11-04

- Production `npm run build`: passed, including Next.js TypeScript validation and all 17 generated pages.
- `npm run lint`: passed.
- `npm test` against production port 3002: **21 passed**, 36.6 seconds. Speaking tests use an explicitly simulated microphone; they verify flow and recording persistence rather than judging real speech quality.
- Independent Impeccable first review: `fix`, limited to enabled study-control/quiet-data text contrast and mobile SVG labels. Corrected foreground to `#656b83`, enlarged responsive CEFR/count lettering, and increased mobile study-label text size with spacing adjusted to fit.
- Real-motion capture exposed a browser pointer-interception issue from the sample's 3D rotation. The question/navigation layers now use restrained planar rotation while preserving the exploded composition. A dedicated normal-motion click regression passes.
- Full-page evidence decodes lazy Speaking photos before capturing. Offscreen images are not mistaken for missing content.
- Exact A+ final assembly completes at the document's reachable scroll range; the Skip/Replay glyph uses the existing RefreshCw icon mapping.
- Final normal-motion browser captures: no JavaScript errors, no horizontal overflow at 1440/390; one desktop skill pin and none on mobile. Reduced-motion captures at 1440/768/390: no pins and no horizontal overflow. No-JavaScript narrative/link checks pass in the regression suite.
- Final independent reviewer disposition: **ship**, both listed fixes scored resolved. Scope: verdict on the contrast/mobile-label fix list, not a second full-surface audit. Report: `.impeccable/review/finish-review.md`.
- Local lab run (Chrome 1440×900, no CPU/network throttling, no video recording): four startup long tasks, maximum 163ms; no long tasks during the sampled six-second pinned scroll. Recorded layout shift 0.00063. Full raw observations: `artifacts/ultimate-landing/performance-lab.json`. The high-frequency virtual-browser frame samples are not a device FPS guarantee; the intentional opening sequence also means an early LCP reading does not describe time-to-interaction.
