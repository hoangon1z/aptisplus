# AptisPlus dashboard V5

Hero geometry update: [HERO_ARTWORK_FIX.md](HERO_ARTWORK_FIX.md) supersedes only the hero dimensions and framing below: 236px minimum in two columns, with a separate 120px artwork row at ≤560px workspace container width and content-driven compact height. All other layout and lifecycle guidance remains applicable.

Current layout geometry and verification are superseded by [DASHBOARD_LAYOUT.md](DASHBOARD_LAYOUT.md). The implementation notes below preserve the original V5 lifecycle context.

## Contract

The user's supplied V5 brief and dashboard concept image are the visual reference. This is an existing-brand Operate surface redesign: compact dark-indigo journey banner, layered original inline SVG ribbon, white/lavender learning panels, radial coverage, activity chart, real study rhythm, skill navigation, recommendations, recent submissions and saved personal schedules. Keep the approved light Aceternity rail, Inter as the already supported modern sans-serif, actual profile and all exam functionality. Do not invent target levels, scores, deadlines, notifications, search or backend services.

The reference's fictional proficiency scores, certification target, learning-stage completion and paid upgrade are intentionally replaced with supported information. Coverage is the proportion of four skills with a saved submission; skill bars compare actual attempt counts. Daily activity is submission count by local calendar date, not a proficiency trend. The streak includes consecutive submitted days ending today or yesterday. Empty states remain truthful. Date range selection is functional. All QA fixtures live only in isolated browser contexts.

## Implementation

- `src/app/(workspace)/dashboard/page.tsx`: real profile, unexpired drafts, attempts, recommendations, recent history and existing schedule create/delete persistence.
- `src/components/dashboard/journey-hero.tsx`: original rear/front/fold surfaces, 27 fine contour paths, two highlights, unique gradient IDs; 204px minimum height (228px at the ≤560px main-container breakpoint); coordinated GSAP formation, DrawSVG reveal, alignment, heading and action entrance. No perpetual animation. Entrance waits for local data and document.fonts.ready; the deferred callback has an active guard, and scoped useGSAP/matchMedia cleanup reverts on update or unmount.
- `src/components/dashboard/learning-overview.tsx`: SVG radial track/arc/markers; keyboard-accessible tooltips, real skill counts/latest activity, 7/30-day chart, streak and daily markers. Scoped GSAP cleanup and reduced-motion handling.
- `src/components/dashboard/learning-data.ts`: local-day activity aggregation and consecutive-day calculation.
- `src/components/dashboard/dashboard-v5.module.css`: scoped indigo/navy/lavender system and responsive main-container layouts.
- AppShell adds actual anchored navigation to the exam library and dashboard overview. Practice adds the matching library anchor. No unsupported roadmap route is introduced.

The existing shadcn Card, Tooltip, Select, Skeleton, Input, Label and Dialog infrastructure is reused. Auth, local profile/attempt/plan keys, recordings, question banks and exam runners remain intact. No exam CSS or scoring system was changed.

## Verification

Final production build/TypeScript passed. All 30 Playwright tests passed in 33.0 seconds after the final lifecycle refinements, including two new dashboard tests for real coverage/activity range, personalized greeting, recommendations, resume links and actual SVG motion. Existing schedule persistence, four-skill exam logic and cinematic landing regressions passed. Lint's pre-existing raw `<img>` warning belongs to the isolated Sidebar demo, with no errors in the new dashboard sources.

`artifacts/dashboard-v5/` contains empty/populated captures at 1672, 1440, 768 and 390px; expanded-sidebar captures at the supplied reference width; a real browser recording `entrance-and-chart.webm`; and same-viewport, same-fixture early/settled motion frames plus motion-checks.json. `checks.json` reports no page errors or horizontal overflow at all eight viewport/data combinations. The populated cases are explicitly labeled QA fixtures, not product seed data. The final finish review approved shipment with no material fixes across all ten captures and the consistent motion evidence; see artifacts/dashboard-v5/review.md.

