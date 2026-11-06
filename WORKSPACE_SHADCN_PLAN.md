# Outside-exam component refinement

User request: outside-exam UI is insufficient and does not use shadcn meaningfully. Preserve the established AptisPlus identity, content/data truth, routes and cinematic opening. Focus is Operate surfaces and their real states, not a new branding exercise.

## Boundary
Do not edit `src/components/exam/*`, reference exam styles or existing Button/Dialog behavior consumed by exams. Existing four-skill layout, timers, recording and submission are protected. Add component-specific tokens without changing exam root tokens. No backend or fake scores/prices/testimonials.

## Component-to-task map
- App shell: Sheet for keyboard/focus-safe mobile navigation; Avatar and DropdownMenu for account actions; Breadcrumb for location; Tooltip and Separator for utilities.
- Practice: Tabs for skill filtering, Input search, Card and Badge for actual exam destinations, Empty state for no matches.
- Dashboard: Card containers for actual schedule/coverage, Progress for true skill coverage, shadcn Select/Input/Label in schedule form; existing persistence stays.
- Results: Tabs filter, Table with actual history, Badge status, Skeleton during load and Empty state; detail Card/Alert/Separator for answer review and unconnected AI notice.
- Account and auth: Input/Label, Avatar, Card, Alert, Separator; accessible form errors/status and keyboard password visibility.
- Admin: Table, Badge, Input search, Select/Textarea/Label in draft editor, clear empty state; retain local CRUD.
- Landing FAQ: Accordion and Tabs using supplied factual content. Preserve GSAP intro/hero/story and the restored exam preview.

## Quality checks
Inspect actual pages at desktop/mobile; exercise keyboard navigation, filters, sheet focus, menus, form persistence and CRUD; rerun existing exam regressions. Official registry source is installed with the shadcn CLI after dry-run review, with current custom Button/Dialog protected from overwrite.
