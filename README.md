# Aptis Studio — frontend prototype

Next.js App Router, React, TypeScript, Tailwind 4, local shadcn-style components built on Radix primitives, GSAP + @gsap/react, ScrollTrigger. Self-hosted Inter and Lucide React icons. Current premium visual system: #514FE4 / #161A35 / #EEEDFF, with the user-provided four-screen concept as primary reference.

## Run

    npm install
    npm run dev

Open http://localhost:3000. Production check: npm run build; types: npm run typecheck; lint: npm run lint; browser regression checks: npm test (requires Google Chrome and an app running on port 3000).

## Routes

- /: bespoke landing, generated Aptis-themed ceramic 3D asset and reduced-motion-aware GSAP.
- /login, /register: split form/image layout. Demo profile only, no authentication. Passwords are neither transmitted nor saved.
- /dashboard: real local practice coverage, saved-session continuation, recent attempts, recommendations and user-created practice schedules.
- /practice: skill filters, search and four sample exam entries.
- /exam/listening, /exam/reading, /exam/speaking, /exam/writing: exam shells and sample interactions.
- /results, /results/[id]: locally saved attempts and recorded audio playback; explicit unconnected AI feedback state.
- /account: local profile editor.
- /admin: local exam metadata draft creation/edit/delete. Drafts cannot yet publish playable exams.

## What works locally

Countdown based on an absolute deadline; timed written exams auto-submit. Written responses/bookmarks/current position survive reload through localStorage. A resumed attempt keeps its original deadline. Question list, bookmarks, native dropdowns, accessible Radix review/submit dialogs, dark mode and magnification.

Reading ordering supports drag/drop or click-to-select then click-to-place (also keyboard operable). Writing supports basic rich text, word counters, typing beyond the suggested limit and per-part review status.

Speaking: real MediaRecorder microphone check, replay, browser narration, automatic timed recording, preparation, waveform based on real input, local IndexedDB audio storage, final confirmation and playback of submitted audio. Ten recordings total. Finish Recording appears only at 9 seconds or less. Microphone requires localhost or HTTPS and user permission.

Listening audio uses browser speech synthesis for sample scripts, with at most two starts per question per attempt. The current working choice resumes at the paused position; the user has not yet settled restart-versus-resume. Counts survive navigation/reload in the same tab.

## Intentionally deferred

Backend, real user authentication/authorization, server storage, AI TTS/STT, grading, queues, synchronized devices, full question authoring and server-enforced exam integrity. AI results do not show invented scores. Speaking attempts are not resumable after reload; completed individual recordings stay in IndexedDB, but full recovery requires backend/session design. Browser TTS quality varies with installed voices.

Sample data demonstrates interface types, not a calibrated official exam. The product name is provisional. No official affiliation is claimed.

## SEO / performance

Public content is prerendered; private workspace/exams use noindex. robots.txt and sitemap routes exist. Set NEXT_PUBLIC_SITE_URL to the final HTTPS domain before publishing to produce absolute sitemap entries. Add final domain-specific canonical/social metadata after the domain is settled; do not ship a placeholder canonical. Inter and icons are self-hosted. Next Image handles responsive image delivery. Reduced motion is supported. Ranking, Core Web Vitals and load capacity have not been certified.

Noindex is not access control; /admin is publicly accessible in this frontend prototype.

## Assets and review evidence

public/assets/indigo-ribbon.png is the current premium transparent ribbon, generated with the built-in Imagegen tool; its exact prompt is embedded in PNG metadata. The earlier ceramic asset remains on disk but is no longer the active visual. Four sample Speaking photos are sourced from Unsplash; origin URLs are embedded in JPEG comments. Keep or replace them when final content is supplied.

PRODUCT.md preserves the agreed scope. DESIGN.md documents actual styles. tests/frontend.spec.ts covers exam persistence/submission, expiry, audio play limits, writing overflow, local drafts/profile, mobile overflow and Speaking with simulated microphone input.

## Premium redesign verification

The redesign preserves existing exam deadlines, two-play limits, written-answer persistence, Speaking recording and submit/review behavior. Dashboard coverage is the percentage of four skills with a submitted attempt, not a proficiency score. No scores or achievements are fabricated.

Visual captures and browser checks live in .impeccable/qa/redesign at 1440, 768 and 390px. Run scripts/capture-redesign.mjs against a running production app; set E2E_BASE_URL when using a port other than 3002. Browser regression tests also accept E2E_BASE_URL. TypeScript 6 is used for compatibility with the installed typescript-eslint parser.
