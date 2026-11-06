# Intro playback lifecycle — current behavior

The cinematic artwork/timeline is unchanged. This update changes only ownership, autoplay eligibility, keyboard/focus cleanup and scroll restoration.

- Full document entry at `/`, including reload/F5/Ctrl+R: autoplay the complete existing master sequence. A fresh root React tree resets eligibility on every document load.
- Ordinary Next.js client navigation: the root-layout `DocumentEntryProvider` survives routing, tracks departure from the original route in React memory, and suppresses homepage autoplay on return. A document initially loaded at another route also does not autoplay when navigating client-side to `/`.
- No localStorage/sessionStorage access or persistent playback flags. Obsolete stored `seen` flags are ignored.
- The existing subtle footer “Xem lại mở đầu” (Replay Intro) control starts a fresh keyed intro instance and resets hero readiness. Old useGSAP context/timeline is disposed before the new instance runs. Original SVG DOM, clipping, masks, text, header and hero states are reconstructed; the choreography is not redesigned.
- Skip/Escape releases inert content, scroll lock and history.scrollRestoration, restores header/focus, and removes keyboard/media listeners immediately. A ref preserves the launching control across development Strict Mode's setup/cleanup/setup. Reduced motion still bypasses autoplay/replay and exits an active sequence on preference change.

Files: `src/components/motion/document-entry.tsx` (new root-layout context), `src/app/layout.tsx` (provider), `src/components/motion/aim-opening.tsx` (eligibility and cleanup), `tests/aim-opening.spec.ts` (lifecycle acceptance coverage). `intro-timeline.ts`, SVG assets, style/design, hero and four-skills choreography were not modified for this fix.

Browser evidence: `artifacts/intro-lifecycle/refresh-replay-skip.webm` records three complete document entries (initial + two real browser reloads), a full manual replay, a skipped replay and a client-side login→home return without autoplay. `checks.json` records distinct performance.timeOrigin values for document loads, Navigation Timing type `reload`, successful matched header handoffs, unchanged timeOrigin for client return, released scroll lock and no page errors. Decoded video frames were visually inspected.

Tests record scene mutations from document startup, asserting every reload begins at intro:start and proceeds through text, CEFR expansion, logo assembly, hero handoff and completion. This avoids a timing-sensitive assertion made only after page load finishes. Repeated replay checks ensure one pinned story spacer, no trapped inert state and restored Tab navigation. Focus/replay/client return were additionally exercised against Next development Strict Mode.

Reproduce production browser evidence: `node scripts/record-intro-lifecycle.mjs` against port 3002. The recording uses real document reloads through Playwright's browser reload API (the document navigation equivalent of F5/Ctrl+R), not route refresh or timeline seeking.
