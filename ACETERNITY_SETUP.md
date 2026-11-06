# Aceternity registry and homepage bento

This change installs Aceternity's BentoGrid and demonstrates it as a functional section on the existing homepage. It extends the current visual identity; it does not replace the cinematic landing page or the vertical skills experience.

## Installation

The project already had `components.json` and shadcn configuration, so initialization was unnecessary. The persisted registry entry is:

```json
{
  "registries": {
    "@aceternity": "https://ui.aceternity.com/registry/{name}.json"
  }
}
```

The installation command used was:

```powershell
npx shadcn@latest add @aceternity/bento-grid --yes
```

The CLI installed `src/components/ui/bento-grid.tsx` and added `@tabler/icons-react` to the dependency manifest and lockfile. The homepage integration uses the existing Lucide icon system; the installed Tabler dependency is retained as registry output.

## Homepage integration

`src/components/landing/learning-bento.tsx` imports the installed `BentoGrid` and `BentoGridItem`. `src/components/landing.tsx` renders `LearningBento` immediately after `WhyAptisPlus`. Presentation is scoped to `src/components/landing/learning-bento.module.css`.

| Action | Destination | Product truth |
| --- | --- | --- |
| Explore practice sets | `/practice` | Existing four-skill practice selection |
| Check the microphone | `/exam/speaking` | Existing Speaking setup and recording workflow |
| Review practice history | `/results` | Attempts and recordings saved on this device |
| Plan another session | `/dashboard` | Learner-created schedule and submitted-skill coverage |

The desktop layout alternates wide and narrow cards; smaller screens use a single column below 768px. The section reuses the existing indigo ribbon, Inter typography, Lucide icons, light bordered surfaces and indigo links. Actions have visible keyboard focus, and reduced-motion rules disable the installed card transitions and hover translation. Copy makes no claims about connected AI grading, real scores, achievements or authentication.

## Verification and review

The implementing agent reported passing production build, lint and eight targeted production Playwright tests covering landing interactions, motion and exam appearance. The documentation pass did not rerun these checks.

`artifacts/aceternity/checks.json` records the four expected links, no horizontal overflow and no page errors at widths 1440, 768 and 390. The capture set contains `home-1440.png`, `home-768.png`, `home-390.png` and matching `bento-*.png` images. Home captures show the page at scroll position zero; separate bento captures show the full addition.

`artifacts/aceternity/review.md` records a **ship** disposition after visually reviewing all six corrected captures and inspecting the component, scoped CSS, installed primitive, registry and browser-check output. No material application changes were required. That review establishes visual finish and narrow implementation scope; it does not claim a fresh end-to-end execution of all four destination workflows.

The documentation pass parsed `components.json`, `.impeccable/design.json`, `package.json` and `artifacts/aceternity/checks.json` successfully as JSON. Scoped conformance checks confirm truthful destinations, existing icon and asset reuse, focus treatment, reduced-motion handling and preservation of the vertical skills section. `PRODUCT.md`, `DESIGN.md` and `.impeccable/design.json` remain unchanged: this installation introduces no replacement visual world or shared token system.

## Exam boundary and existing drift

The bento is a marketing-page component. Keep its styling out of the actual exam runner and portal dialogs. Actual exams retain `reference-exam` / `reference-exam-dialog`, their original violet-and-white appearance, timing, answers, recording, persistence and submission behavior. The new Speaking link enters the existing route without changing that exam interface.

Existing design documentation describes a ribbon-led hero and a specific floating Listening demonstration. The current homepage also contains a broader cinematic sequence; the finish review identifies its hero artwork as the incumbent brand mark. This task does not reconcile that pre-existing descriptive drift or promote the bento's local color values and card composition into global design rules.
