# AptisPlus — outside-exam shadcn integration

## Scope and source

Refined the existing outside-exam visual system, rather than replacing the brand or the cinematic intro. Installed 21 component source files through the official shadcn CLI after reviewing its dry run. The installed registry uses `radix-ui` and `cn`; these dependencies and the lockfile are updated. Existing custom Button and Dialog were deliberately not overwritten because full exams depend on their API and styling.

Official source/workflow: https://ui.shadcn.com/docs/cli . Components live in `src/components/ui/` and remain editable project-owned code.

## Components used in real flows

| Component | Actual use |
|---|---|
| Sheet | Focus-managed mobile application navigation, Escape dismissal and route selection |
| DropdownMenu | Profile actions and help navigation |
| Avatar | Profile trigger, sidebar identity and account summary |
| Breadcrumb | Current application route, including result detail |
| Tooltip | Explanation of local data storage and account settings |
| Separator | Navigation, account and auth grouping |
| Card / CardContent / CardHeader | Practice library, real coverage/schedule panels, profile form and answer review |
| Badge | Practice metadata, draft/submission status and local profile state |
| Tabs | Keyboard-operated skill/history filtering and FAQ categories |
| Table | Local submitted attempts and draft administration |
| Input / Label | Search, auth, profile, schedule and draft fields |
| Select | Skill selection within schedule and draft dialogs; preserves native form data through Radix |
| Textarea | Draft notes |
| Switch | Filter practice skills with no locally submitted attempts |
| Accordion | Factual landing FAQ; closed content stays in server HTML with forceMount |
| Alert | Form errors/success, admin limitations, auth data notice and unconnected AI grading |
| Skeleton | History/detail loading |
| Empty | No matching practice content, empty history and admin search |

These are 20 component families in actual flows (Input and Label count separately). Checkbox is the twenty-first installed source file and remains unused; it is not counted as integrated behavior. The goal is meaningful usage, not displaying every registry component.

## Design and CSS boundary

Outside-exam action color is `#5055d8`. The current AptisPlus SVG wordmark replaces the old text brand in auth/workspace only; the exam Brand component is untouched. Sidebar, white cards, contained tables, consistent field dimensions, clearer headings and status treatments develop the existing indigo/navy direction.

`src/app/shadcn-surfaces.css` defines namespaced `--ui-*` tokens. `globals.css` maps Tailwind semantic utilities to these tokens. The namespace is necessary because the older app uses `--muted` for text, while shadcn's muted token is a surface. No exam tokens, recording logic, timers, questions or submission behavior were changed.

Workspace selectors live under `.workspace-ui`, auth under `.public-auth`, and portal forms under `.workspace-dialog`. Select content has z-index 150 so it stays above the existing Radix Dialog overlay. `reference-exam` and `reference-exam-dialog` continue to own their violet/white exam system independently.

## Data and behavior

All history, skill coverage, schedules and draft data still use the existing local persistence functions. Updating a profile now notifies the shell immediately using a local browser event. No authenticated backend, paid plans, verified testimonials, AI scoring or cross-device sync is claimed. Capture-only populated history uses names explicitly marked “QA fixture”; that data is not seeded into the product.

## Files and checks

Changed AppShell, AuthForm, workspace dashboard/practice/results/detail/account/admin, landing FAQ, layout CSS imports, semantic Tailwind mappings, package/lockfile and corresponding interaction tests. Added WorkspaceBrand, SkillSelect, the surface stylesheet and registry primitives. `src/components/exam/*` was not edited in this task.

Verification script: `scripts/inspect-shadcn-surfaces.mjs`. Artifacts: `artifacts/shadcn-surfaces/` — route captures at 1440/768/390, mobile Sheet/account menu/schedule form, empty and QA-filled history, detail and actual browser videos. The script checks page errors, horizontal overflow and actual interactions. Review copies live under `.impeccable/review/workspace/`.

Build and TypeScript validation passed. Lint passed. The existing 24-test suite passed after adapting UI-specific selectors for Radix Select and Accordion. Two new tests passed for Sheet focus restoration/navigation, profile menu/save, keyboard Tabs and data-based Switch filtering. The four exam appearance regressions and all original recording/timer/submission tests passed in that suite.

An integration run found the old dialog overlay obscuring Select options; the portal layer was corrected and the schedule interaction rechecked. The semantic-token namespace prevents legacy text colors from being replaced by shadcn surface colors.

## Observed system extension and documentation boundary

This is an ordinary extension of the incumbent visual world. The user requested meaningful shadcn use outside the exams, not a replacement identity. Inter, indigo actions, white working surfaces, restrained outlines and AptisPlus branding remain continuous. This pass compared `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `WORKSPACE_SHADCN_PLAN.md`, the current shell and `shadcn-surfaces.css`. Root design files and PRODUCT.md are preserved; this surface implementation does not establish an application-wide token migration.

The implementation's namespaced component values are recorded here for maintenance:

| Token or rule | Observed value / application |
|---|---|
| `--ui-primary`, `--ui-ring` | `#5055d8`, action emphasis and keyboard focus |
| `--ui-background`, `--ui-card`, `--ui-popover` | `#ffffff` |
| Foreground | `#202237` for base/card/popover text |
| Secondary | `#eef0fb` surface, `#35398b` foreground |
| Muted | `#f3f4f9` surface, `#626578` foreground; legacy `--muted` remains a text token |
| Accent | `#eeeffc` surface, `#373ba2` foreground |
| Destructive / border / input | `#b4233b` / `#e3e5ef` / `#d4d7e5` |
| Workspace geometry (historical sidebar) | The former 242px sidebar was superseded by the approved 60px/300px Aceternity rail; see SIDEBAR_SETUP.md. Remaining values from this integration: 76px top bar, 1420px content cap, 36px content gutters; cards 12px radius without shadow |
| Type and fields | Desktop page titles 30px/1.25 at weight 600; support copy 14px/1.7; regular fields 44px high with 8px corners, auth fields 46px |
| Responsive (historical sidebar breakpoint) | Sidebar navigation now switches to Sheet below 768px; the former 1000px switch is superseded. This integration recorded content gutters 28px/24px. At 600px and below top bar is 66px, content gutters 25px/18px, titles 25px, account layout one column. Local-storage tooltip indicator is hidden at this narrow breakpoint. |
| Reduced motion | Sheet overlay/content and Accordion animations/transitions are disabled for reduced motion. |

`reference-exam` and `reference-exam-dialog` remain the exam boundary: `#23085a`, white canvas, Inter and Material Symbols Rounded, original questions, toolbar and recording controls. Existing custom Button/Dialog APIs stay protected. Semantic utility mappings use the new `--ui-*` namespace; this must not be interpreted as permission to apply workspace classes or tokens to exam runners or their dialogs.

Pre-existing documentation still uses the provisional Aptis Studio name and older raster-ribbon public identity. Its general public/workspace primitives (`#514fe4`, `#161a35`, 40px workspace gutter) also differ from the scoped values observed above. These are reported, not silently reconciled: no rebrand, root-token replacement or unrelated drift repair was authorized by this documentation pass.

## Final evidence and review disposition — 2026-11-04

The artifact inventory contains 39 production PNG captures at 1440/768/390 and browser videos under `artifacts/shadcn-surfaces/`. `checks.json` records no horizontal overflow for the seven sampled primary routes at each width and empty browser-error lists. This documentation pass checked that inventory and JSON evidence; it does not claim an independent replay of every recording or rerun of the tests.

Build/TypeScript and lint passed. After the final three fixes, the complete production suite was rerun against localhost:3002: all 27 tests passed in 29.2 seconds, including the new keyboard tooltip regression and original exam/motion checks.

The final fixes increased dashboard metadata to 12px with `#626578`, removed the redundant feature eyebrow, and made the local-data tooltip trigger a semantic keyboard-focusable button with a visible indigo ring. The finish reviewer scored all three material fixes **resolved**, with no batch regressions visible in its ten reviewed captures; `disposition: ship`. This is the fix-verdict scope recorded in `.impeccable/review/workspace-review.md`, not a new whole-product approval.

Documentation writes for this pass are limited to this file. Existing design-token documents remain intact; `.impeccable/design.json` and the capture checks JSON were parsed successfully.
