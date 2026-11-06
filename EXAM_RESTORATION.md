# Four exam interfaces — reference restoration

2026-11-04. User requested restoration of Listening, Reading, Writing and Speaking to the previously supplied exam references.

## Cause and correction

The full exam runner carried `premium-exam`, enabling marketing-style overrides in `premium.css`: indigo instead of exam violet, rounded question cards, a decorative topbar, a permanently visible right question grid, pill audio player and sticky rather than fixed navigation. This was incompatible with the user's original reference.

All exam stages now use `exam-root reference-exam`. The original faithful base exam CSS is active again. `reference-exam.css` explicitly scopes exam violet `#23085a`, Inter, plain buttons, icon sizes and mobile spacing; the portal dialog receives the same local tokens. Root `display: flow-root` prevents the question's top margin from exposing the landing's off-white body background.

- Listening: centered question header, plain Play/Stop, squared A/B/C rows; existing speaker/opinion dropdown and two-question layouts retained.
- Reading: original inline dropdowns, sentence-ordering columns, author matching and heading selection retained.
- Writing: original short inputs, formatting toolbar, editor shadows, word counters and multi-answer layout retained.
- Speaking: original content area and right recording panel, circular timer and live microphone waveform retained. On mobile the recording panel stays below the content in its existing responsive layout.
- Question navigation uses the existing left drawer. The right permanent navigator and decorative exam topbar were removed from the runner.
- `exam-icon.tsx` uses the installed, self-hosted Material Symbols Rounded font inside the exam only. Landing/workspace icon systems remain separate.

The work does not change the questions, timer calculation, answer storage, review/submit state machine, speech-synthesis implementation or microphone recording logic. Sample photos remain the existing demo assets; this is an interface restoration, not replacement of the content bank.

## Verification

- Production build and TypeScript validation passed; lint passed.
- All 21 existing Playwright tests passed, including Listening playback limits, Reading ordering, Writing excess words, timed auto-submit, Speaking mic check and ten stored recordings, one-minute preparation and the under-ten-second finish rule.
- Three new appearance regressions passed: Listening/Reading/Writing assert violet tokens, white background, fixed toolbar, visible timer caption, absence of premium shell/right navigation and left-opening question drawer.
- Browser captures exercised all three non-speaking question families and all four Speaking parts at 1920 and 390 pixels. No horizontal overflow or page errors were recorded in the capture run.
- Speaking visual capture uses a simulated microphone and narration with accelerated test time; it verifies interface states, not real speech or scoring.

Evidence: `artifacts/four-exams-restored/checks.json`, `{skill}-q{n}-{width}.png`, `speaking-part{n}-{width}.png`, `speaking-preparation-{width}.png`, `four-exams-{width}.webm`. Reproduction script: `scripts/verify-four-exams.mjs`. New regressions: `tests/exam-appearance.spec.ts`.

## Durable design boundary

PRODUCT.md, DESIGN.md and .impeccable/design.json now record the user-approved exam restoration. Public/workspace premium branding stays intact; actual exam roots use reference-exam and portal dialogs use reference-exam-dialog. Exam-specific tokens override answer geometry without changing generic public/workspace answer or control tokens. This documentation correction prevents the earlier premium-exam prescription from being reapplied. Verification above describes the restoration run; this documentation-only update adds no application changes or new test claims.

Latest production recheck (port 3002, 2026-11-04): all 14 frontend and appearance tests passed. Desktop (1920px) and mobile (390px) screenshots/videos were rerun for all four skills with zero page errors and no horizontal overflow. This recheck supplements the earlier 21 behavior tests and three appearance regressions recorded above.
