# Dashboard layout refinement

Hero geometry update: [HERO_ARTWORK_FIX.md](HERO_ARTWORK_FIX.md) supersedes only the hero dimensions and framing below: 236px minimum in two columns, with a separate 120px artwork row at ≤560px workspace container width and content-driven compact height. All other layout and lifecycle guidance remains applicable.

## Scope

Refine the existing dashboard layout rather than replace its identity. Preserve inline ribbon geometry, GSAP hero choreography, profile/history/schedule persistence, links, assessment truth and all four exam runners. The implementation remains light only outside the exams.

## Measured causes

The inherited `.workspace-ui .app-content` capped the padded outer container at 1420px, leaving 1348px for actual dashboard content. With a 60px rail at a 1792px viewport, 384px of the workspace sat outside that content. At 1920px the difference was 512px. This was a parent width constraint, not simply a child padding problem.

The chart used a static 372×184 SVG viewBox and automatic aspect height. Wider one-column chart panels grew the visualization, producing a 452px chart card at 768px. Grid's default stretch then enlarged adjacent metrics to match the tallest card. Early fractional columns and viewport/container transitions compounded the variation. Sidebar labels remained mounted during display/opacity transitions, allowing clipped text fragments during rail state changes.

## Current layout contract

- Dashboard outer container: full width up to 1664px, including 32px desktop side gutters, yielding a maximum 1600px actual content width. Gutters become 24px below 1600 viewport pixels, 20px at ≤1100px and 16px at ≤600px. Other workspace routes retain their own containers.
- Metric grid: 12 columns, coverage/activity/streak spans 4/5/3. At main-container widths ≤1200px, metrics use 6/6 followed by a horizontal 12-column streak panel. At ≤900px, panels occupy 12 columns. The lower workspace uses 8/4, then full-width columns below the same constraint.
- Cards: 20px padding and 16px principal grid gaps; content-driven heights with `align-items: start`. Compact headers, a 204px hero minimum (about 207px actual desktop height), a 228px compact hero minimum at ≤560px container width, and balanced empty states. No fixed whole-metric-card height.
- Chart: fixed 140px visualization height with a ResizeObserver-driven horizontal SVG coordinate system. Text keeps its intended physical size as the sidebar and workspace resize. Normalized `pathLength=100` and GSAP stroke offset retain drawing animation without stale pixel dash lengths after resizing. Ring animation and ribbon geometry remain unchanged.
- Collapsed rail: labels are absent from the DOM, not merely clipped/faded. Icons retain accessible names, actual routes, active states and shadcn tooltips. Expanded labels remain visible; long profile names wrap. Hover/focus expansion, mobile Sheet behavior and reduced motion are preserved.

## Before/after evidence

`artifacts/dashboard-layout/measure.mjs` captures and measures 390, 768, 1024, 1440, 1792 and 1920px. `before/`, `after/` and `after-data/` each contain 11 captures: mobile plus collapsed/expanded desktop states. The latter dataset is explicitly a QA fixture in isolated browser contexts, including a long Vietnamese profile name, real-shaped attempts and a saved schedule; no fixtures are seeded into application storage.

Detailed bounds, computed padding, gaps, columns, sidebar label visibility, chart and card heights are in each `measurements.json`. `comparison.json` and `COMPARISON.md` compare identical empty-data states. Measured examples:

| Case | Before | After |
|---|---:|---:|
| 1792px collapsed: actual content width | 1348px | 1600px |
| 1792px collapsed: width outside actual content, including gutters/cap | 384px | 132px |
| 1920px collapsed: width outside actual content | 512px | 260px |
| 768px collapsed: activity card height | 452px | 285px |
| 1792px collapsed: activity card height | 341px | 285px |
| 1792px collapsed: next useful section starts at Y | 768px | 687px |

All six viewports and both rail states have no horizontal overflow. Mobile actual dashboard width is 358px within a 390px screen. Chart height is 140px in every measured state. Intentional desktop max-width capping remains at larger viewports; the goal is readable use of available width, not unbounded stretching.

## Verification

Production build and TypeScript passed. All 32 Playwright tests passed in 34.4 seconds, including two new layout regressions for all six widths, chart bounds, collapsed-label absence, keyboard names and tooltip behavior. Existing data, schedule, hero motion, landing and exam tests passed. Lint has zero errors and the retained raw-image warning in the isolated Sidebar demo. The completed independent visual review in [review.md](artifacts/dashboard-layout/review.md) records **ship**, with no blocking defect. It reviewed all 33 before/after/populated captures, native captures at all six viewport widths, and the scoped source. Static visual review and the production functional checks are separate evidence.

This document supersedes the original geometry values in DASHBOARD_V5.md. DESIGN.md and .impeccable/design.json carry the current normative dashboard rules; public, other workspace and exam design boundaries remain unchanged.
