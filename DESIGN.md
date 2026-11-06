---
name: Aptis Studio
description: Editorial indigo learning experiences with a focused, stateful exam workspace.
colors:
  primary: "#514fe4"
  primary-hover: "#403cd0"
  navy: "#161a35"
  lavender: "#eeedff"
  background: "#f8f9fd"
  surface: "#ffffff"
  muted: "#656d87"
  line: "#e6e8f2"
  sidebar-surface: "#f5f5f5"
  sidebar-foreground: "#404040"
  sidebar-selected: "#e9e9f9"
  sidebar-selected-text: "#454abf"
  sidebar-focus: "#5055d8"
  dashboard-hero: "#20174e"
  dashboard-action: "#7250f5"
  dashboard-panel-line: "#e6e5f4"
  exam-violet: "#23085a"
  exam-selected: "#e8e3f3"
  exam-answer: "#f4f5f8"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(45px, 4.7vw, 68px)"
    fontWeight: 550
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "42px"
    fontWeight: 550
    lineHeight: 1.18
    letterSpacing: "-0.035em"
  workspace-title:
    fontFamily: "Inter, sans-serif"
    fontSize: "25px"
    fontWeight: 600
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  dashboard-hero:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(23px, 2.3vw, 34px)"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-0.03em"
  exam-prompt:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  exam-header:
    fontFamily: "Inter, sans-serif"
    fontSize: "24px"
    fontWeight: 500
    letterSpacing: "-0.025em"
rounded:
  control: "10px"
  answer: "9px"
  panel: "14px"
  dashboard-panel: "16px"
  exam-surface: "0px"
  exam-answer: "0px"
  exam-control: "5px"
spacing:
  compact: "8px"
  control-gap: "12px"
  panel-gap: "20px"
  panel: "25px"
  workspace-gutter: "40px"
  dashboard-gap: "16px"
  dashboard-panel: "20px"
  dashboard-gutter-wide: "32px"
  dashboard-gutter-desktop: "24px"
  dashboard-gutter-tablet: "20px"
  dashboard-gutter-mobile: "16px"
components:
  dashboard-hero:
    backgroundColor: "{colors.dashboard-hero}"
    textColor: "{colors.surface}"
    rounded: "{rounded.dashboard-panel}"
  dashboard-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.dashboard-panel}"
    padding: "{spacing.dashboard-panel}"
  workspace-sidebar-collapsed:
    backgroundColor: "{colors.sidebar-surface}"
    width: "60px"
    padding: "16px"
  workspace-sidebar-expanded:
    backgroundColor: "{colors.sidebar-surface}"
    width: "300px"
    padding: "16px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
    height: "45px"
  button-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.surface}"
    padding: "12px 20px"
  button-white:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.navy}"
    padding: "12px 20px"
  exam-answer:
    backgroundColor: "{colors.exam-answer}"
    textColor: "#1b1b1b"
    rounded: "{rounded.exam-answer}"
    height: "70px"
---

# Design System: Aptis Studio

## Overview

**Creative North Star: "Editorial indigo, practical learning"**

The current implementation follows the user's premium redesign brief. Oversized Vietnamese Inter headlines, restrained indigo emphasis and a transparent pleated ribbon establish the public identity. A floating, selectable Listening question demonstrates the actual product category in the hero. The ribbon asset is public/assets/indigo-ribbon.png; it replaces the earlier ceramic learning still-life as the primary decorative language.

The workspace retains the indigo/navy palette and Lucide line icons. Dashboard data comes from the local profile, attempts, drafts and schedule. The latest user decision restores the actual Listening, Reading, Writing and Speaking interfaces to the original exam references: violet on white, Inter and Material Symbols Rounded, unboxed questions and a left question drawer. This exam decision supersedes the earlier premium-exam direction; timing, answer and submission behavior remain product constraints.

**Key Characteristics:**

- Editorial Inter hierarchy with controlled indigo emphasis.
- Lucide SVG icons with consistent light strokes on public and workspace surfaces.
- A pleated indigo ribbon framing product demonstrations.
- Vertical skill navigation with distinct active previews.
- Useful local-data dashboard states, including truthful empty states.
- Reference exam surfaces with fixed controls, a left question drawer and explicit answer states.

## Colors

### Primary

- **Studio Indigo** (primary): shared action, selection and emphasis color across public pages and workspace.
- **Studio Indigo Hover** (primary-hover): darker shared primary action state.
- **Deep Navy** (navy): headline ink, pill CTAs and dark learning modules.

### Neutral

- **Soft Lavender** (lavender): selected regions and quiet promotional grounds.
- **Cool Background** (background): application canvas.
- **White Surface** (surface): working panels, forms and answer rows.
- **Muted Ink** (muted): supporting copy. This records the current CSS token rather than substituting the brief's approximate secondary-text swatch.
- **Fine Divider** (line): low-contrast structure and panel boundaries.

**The Exam Boundary Rule.** Public/workspace premium styles must not apply to the actual exam runner or its portal dialogs. Use `reference-exam` and `reference-exam-dialog`, never `premium-exam`; the faithful base in `globals.css` and scoped `reference-exam.css` define the exam appearance.

- **Exam Violet** (exam-violet): exam actions, selected letter cells and timer accents.
- **Exam Selected** (exam-selected): selected answer fill.
- **Exam Answer** (exam-answer): idle A/B/C answer fill; letter cells and canvas use White Surface.

## Typography

Inter remains self-hosted with Vietnamese support. The hero display is oversized and tightly tracked, with an italic indigo phrase. Section headings use a smaller medium-weight editorial scale. Dashboard greetings are compact semibold titles. Exam body and prompts use Inter at 16px with 1.45 body line height; question headers use 24px medium weight. Answer rows remain regular-weight and timers use tabular numerals.

Small contextual metadata is intentionally subordinate to task content. Its route-specific size is not a general body-text rule. Public/workspace icons come from Lucide React at a shared stroke width (1.65). Actual exams use the self-hosted Material Symbols Rounded font through the local exam icon component.

## Layout

The public canvas caps at 1600px. Navigation and content use proportional side gutters (5.5%). The hero places copy left and the rotated floating Listening interface right, with the ribbon behind. The skills area uses vertical navigation beside a wide dark preview, not four identical feature cards.

The desktop workspace uses the actual Aceternity Sidebar, DesktopSidebar and SidebarLink components at viewport widths of 768px and above. Its sticky, viewport-height rail expands from 60px to 300px on hover or keyboard focus. The shell uses flex layout; the main region has zero left margin and shrinks with the rail. Below 768px, navigation uses a full-width Radix Sheet. The dashboard-specific padded outer container caps at 1664px, including 32px side gutters, for at most 1600px of actual content. Viewport gutters become 24px below 1600px, 20px at ≤1100px and 16px at ≤600px. Its 12-column metric grid spans coverage/activity/streak 4/5/3; at workspace container widths ≤1200px it becomes 6/6 plus a 12-column horizontal streak panel, and at ≤900px every panel spans 12. Lower content uses 8/4 and stacks at ≤900px. Principal gaps are 16px; content-driven cards align at the top. At ≤560px compact typography and hero spacing apply. Other workspace surfaces retain their 650px main-container stacking rule. The schedule is an editable local plan, and the coverage visualization means submitted-skill coverage rather than ability.

The actual exam uses a white canvas with no question card, decorative topbar or permanent right question grid. Question navigation opens in the existing left drawer; the bottom toolbar is fixed. Long tasks continue to scroll. Speaking retains a desktop right recording panel (300px) and circular timer (185px); its existing mobile layout places the panel below the content.

Public premium composition retains breakpoints at 1150px, 900px, 768px and 480px, plus a wide treatment at 1600px. The current workspace navigation uses the 768px breakpoint and 650px main-container rule described above. Actual exams retain the responsive base exam rules and scoped mobile adjustments in reference-exam.css. The base stylesheet still supplies shared form and accessibility behavior.

## Elevation & Depth

Depth is selective: a broad soft shadow gives the floating hero question its prominence, while application panels mostly use fine borders and pale tonal variation. Selective gradients support the ribbon, dark feature module, public audio demonstration and preview question state. They do not turn every control into a decorative object.

### Shadow Vocabulary

- **Soft surface:** 0 12px 40px #25245407.
- **Floating interface:** 0 22px 70px #514fe41a.
- **Navy CTA:** 0 6px 15px #161a3510.
- **Preview active question:** 0 4px 12px #5b47e327; public demonstration only.

Actual exam questions have no elevated card. Retain the reference Writing editor shadows and Speaking recording-panel shadow; do not import public preview gradients or active-question shadows.

## Shapes

Public/workspace controls use modest rounding. Primary public CTAs are pill shaped, while the public audio demonstration uses a long capsule with a circular transport control. The public ribbon is an image asset with real transparency. The V5 dashboard instead uses an original inline SVG with rear, front and fold surfaces, 27 contour paths and two edge highlights; do not substitute the public bitmap for it. Actual exam A/B/C rows and selects are square; A/B/C rows have a 70px minimum height, white letter cells and flat idle/selected fills. Exam buttons retain their reference rounding; do not inherit generic answer/control radii into exam answer rows.

## Components

### Workspace navigation

The approved Aceternity sidebar is light only, including under an operating-system dark preference. Neutral rail and text use the sidebar tokens above; selected route rows use a quiet lavender fill and indigo text. Brand, learning routes, help and the local-profile link use real Next.js destinations. Collapsed links retain accessible labels. Keyboard focus expands the rail and remains visible with a 2px indigo inset outline; focus within keeps it open when the pointer leaves. Reduced motion sets rail and label animation duration to zero. Mobile navigation retains Radix Sheet focus management, Escape dismissal and focus restoration, with a white full-width panel. These workspace rules do not alter the exam dark-mode feature.

### Buttons and Fields

Shared shadcn-style button variants remain customized. Indigo actions, navy public CTAs and white actions on dark modules have distinct roles. Hover, keyboard focus, disabled and active states are retained. Authentication fields remain filled, and workspace forms retain labeled bordered inputs. Native form and Radix dialog behavior is preserved.

### Skill Showcase

Vertical skill tabs show a selected lavender state and directional cue. The preview changes title, supporting content, duration and question metadata for each skill. Its dark surface and ribbon treatment vary with the active selection. On narrow viewports the navigation and preview adapt to available space.

### Dashboard

The V5 journey banner has a 236px minimum height, clipped 16px corners and a dark-indigo gradient. On desktop, copy and actions occupy the left grid cell. Its inline SVG composes broad front and rear terrain planes anchored to the banner bottom, a broad folded underside and attenuated front contours, rather than narrow floating bands. The front tapers from M300 240. It uses viewBox="0 0 1600 240" and preserveAspectRatio="xMaxYMid slice". Horizontal continuation intentionally extends beyond the right edge; the geometry intentionally meets y=240 at the bottom as part of the composition, not an accidental crop of lower curves. Desktop artwork uses a right-aligned absolute wrapper with inset: 0 0 0 auto, width 100%, SVG width/height 100%, no mask and no negative offsets. At workspace container widths ≤900px copy and actions come first, followed by a separate full-bleed 120px artwork row with zero padding; the same row persists at ≤560px. There is no artwork mask at any width. Total height is content-driven: observed 320px at 768px viewport and 347px at 390px. Preserve copy, real data, CTA destinations, colors, 27 contours, two highlights, gradient IDs, group attributes and the existing scoped GSAP lifecycle and choreography. The exposed-endpoint, endpoint-mask and narrow-band treatments were rejected; their captures and reviews are historical evidence. See HERO_ARTWORK_FIX.md and artifacts/hero-framing/terrain-final/ for the current implementation and evidence. It resumes the first unexpired local draft or selects a skill with fewer saved submissions. White panels use 16px corners, 20px padding, a fine dashboard-panel-line border and no shadow. The radial SVG measures submitted-skill coverage: three of four skills means 75%, never proficiency. Skill bars compare counts against the largest skill count. The selectable 7/30-day SVG chart counts submissions by local calendar date; keyboard tooltips expose detail. Its visualization stays 140px high; ResizeObserver updates horizontal viewBox coordinates to preserve physical text size. A normalized native pathLength of 100 and GSAP stroke-dash offset reveal keep resizing independent of stale pixel path lengths. The daily rhythm and streak use real submitted days, with zero allowed. Four skill links, count-ordered recommendations, latest three result links and editable local schedules remain functional. The sidebar starts collapsed to avoid an initial width jump and retains its approved 60px/300px behavior. Collapsed labels are absent from the DOM; actual links retain accessible names and shadcn tooltips. Expanded long profile names wrap. Real destinations include /practice#exam-library and /dashboard#learning-overview. See DASHBOARD_LAYOUT.md for the current layout contract and verified before/after evidence; DASHBOARD_V5.md retains the original lifecycle context.

### Exam

Listening uses plain Play/Stop controls and remaining-play metadata. A/B/C rows use Exam Answer at rest, Exam Selected when chosen, and Exam Violet for the chosen letter cell and checkmark. The left drawer carries question navigation and bookmarks. Reading retains inline dropdowns, ordering columns, author matching and headings. Writing retains short inputs, formatting controls, editor shadows and word counters. Speaking retains mic checks, its right recording panel, circular timer and live waveform. See EXAM_RESTORATION.md for the 21 existing behavior tests, three appearance regressions and desktop/mobile capture evidence.

### Motion

Scoped GSAP timelines coordinate the hero text, interface and supporting copy. ScrollTrigger supplies ribbon parallax and section entry. Skill switches animate preview content and ribbon using short transitions. The V5 dashboard coordinates one-shot ribbon formation, DrawSVG contour/highlight reveal, heading reveal and action entrance. It starts only after local data and document fonts are ready; the deferred callback checks an active flag. Scoped useGSAP and matchMedia cleanup revert on update/unmount. Coverage and chart paths reveal on real data/range changes. There is no perpetual decorative dashboard motion. Reduced-motion preference skips these effects; exam motion stays functional. DrawSVG is no longer part of the landing implementation.

## Do's and Don'ts

### Do:

- **Do** use the current indigo/navy palette and Lucide SVG system on public/workspace surfaces.
- **Do** let the product demonstration carry the public hero.
- **Do** preserve actual timers, saved answers and submission behavior during visual edits.
- **Do** show real local data and explanatory empty states.
- **Do** support reduced motion and visible keyboard focus.

### Don't:

- **Don't** apply public/workspace premium styling, a decorative topbar, a question card or permanent right question grid to actual exams.
- **Don't** replace the vertical skills experience with four repetitive feature cards.
- **Don't** invent grades, achievements, histories or performance metrics.
- **Don't** let decorative motion distract from examination tasks.
- **Don't** make suggested writing word counts block further typing.

### Workspace account menu
One account trigger only, in the top-right app header. No sidebar/mobile-drawer profile duplicate or local-storage badge. Compact avatar/name pill opens a310px, viewport-bounded white menu with true API name/email, account/history destinations and separated logout with failure recovery. Scoped profile-menu.module.css preserves other menus. Verified desktop1440/mobile390 and Escape focus/logout via scripts/profile-menu-check.mjs.
