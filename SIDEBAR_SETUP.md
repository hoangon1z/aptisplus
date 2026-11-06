# Aceternity sidebar — active workspace integration

The user-approved Aceternity sidebar now drives the actual workspace. It is light only, including when the operating system requests dark mode. Public landing and reference-exam behavior are preserved.

## Current integration

`src/components/app-shell.tsx` uses the installed `Sidebar`, `DesktopSidebar` and `SidebarLink` from `src/components/ui/sidebar.tsx`. At viewport widths of 768px and above, the sticky viewport-height rail expands from 60px to 300px on hover or keyboard focus. The shell uses flex layout and the main region has zero left margin, so expansion resizes the working area. A 650px main-container rule stacks dashboard, recommendations, practice and account grids when space is constrained.

Brand, navigation, help and local-profile links use real Next.js destinations. Selected routes retain `aria-current`; collapsed links retain accessible names. Focus within keeps the rail open when the pointer leaves; visible focus is indigo. Reduced motion sets rail and label animation duration to zero. Below 768px, the existing Radix Sheet supplies a full-width white menu with keyboard focus management, Escape dismissal and focus restoration.

Sidebar and demo dark variants have been removed. Neutral Aceternity rail styling is scoped to navigation; this is not a public-brand replacement. `DESIGN.md` and `.impeccable/design.json` record this approved sidebar geometry and behavior. The actual exams retain `reference-exam` / `reference-exam-dialog`, violet `#23085a`, Inter and Material Symbols Rounded, including their existing exam dark mode.

## Current verification — 2026-11-04

Production build passed. Lint completed with zero errors and one retained demo `<img>` warning. The complete production test suite passed all 28 tests in 28.8 seconds after the final responsive fix, including the new workspace navigation regression and existing exam checks.

`artifacts/active-sidebar/` contains 18 final screenshots: light/dark operating-system preference at 1440px, 768px and 390px, with closed, open and practice states. Six browser videos accompany the captures. The capture checks report no horizontal overflow or browser errors. The finish review inspected all 18 final captures and found no blocking defects in this sidebar integration, including light appearance under an operating-system dark preference and coherent tablet/mobile layouts. Its disposition and exact scope are recorded in `artifacts/active-sidebar/review.md`.

## Historical source-demo record

The following records the earlier installation and isolated-demo phase. Its claims of unchanged source, untouched application navigation, retained source accessibility limitations, dark variants and unchanged design documentation are historical and no longer describe the current integration. Earlier captures under `artifacts/sidebar/` document that phase only.

# Earlier Aceternity sidebar demo

The supplied sidebar is available at `/sidebar-demo`. It is an isolated source demonstration; existing application navigation and exam interfaces were not replaced.

## Installation and source fidelity

`npx shadcn@latest add @aceternity/sidebar-demo --yes` succeeded using the existing `components.json`. The registry installed `src/components/sidebar-demo.tsx` and `src/components/ui/sidebar.tsx` unchanged. The existing `@/` alias and `src/lib/utils.ts` `cn` helper already matched the imports, so no import or helper changes were needed. All requested sidebar exports remain available.

The installation added `motion` (`^14.9.1`) to `package.json` and updated `package-lock.json`. Tabler icons, `clsx` and `tailwind-merge` were already present.

## Every addition beyond the supplied source

Only `src/app/sidebar-demo/page.tsx` was added as application integration code. It renders the installed demo inside a Tailwind page wrapper with a white/dark-neutral background, minimum viewport height and responsive padding (`p-4 md:p-10`). The demo's own `h-[60vh]`, utility values, branding, placeholders and interactions remain unchanged.

The page adds `MotionConfig reducedMotion="user"` so Motion respects the operating-system preference, and `[&_.animate-pulse]:motion-reduce:animate-none` to disable the source's CSS skeleton pulse when reduced motion is requested. The supplied source has no explicit reduced-motion configuration. This wrapper reduces transform motion; width and opacity animations still follow Motion's behavior. It does not promise to eliminate every animation.

The remote avatar remains the source's ordinary `<img>` using `assets.aceternity.com`. No `next/image` conversion or image-host configuration was necessary. Its intentional preservation leaves one `@next/next/no-img-element` lint warning.

## Verification and evidence

Production build and TypeScript checks passed. Targeted ESLint checks completed with zero errors and the one image warning described above.

`artifacts/sidebar/checks.json` records light and dark runs at 1440px and 390px: no captured console/page errors, no horizontal overflow and a successfully loaded avatar in all four cases. Desktop hover was checked from 60px to 300px and back; the mobile menu was opened and closed. Reduced-motion verification recorded the skeleton animation as `none`.

Nine screenshots are saved under `artifacts/sidebar/`: `light-1440-closed.png`, `light-1440-open.png`, `light-390-closed.png`, `light-390-open.png`, the corresponding four `dark-*` files, and `reduced-motion.png`. Four named interaction recordings are `light-1440.webm`, `light-390.webm`, `dark-1440.webm` and `dark-390.webm`. The capture script is `artifacts/sidebar/capture.mjs`.

Both installed TSX files were compared against the supplied attachment's code blocks and match exactly (after trimming surrounding whitespace). The finish reviewer inspected all nine settled captures and returned `ship` for this source-demo integration; see `artifacts/sidebar/review.md`. This verdict preserves the inherited limitations below.

## Retained source limitations

Dashboard, Profile, Settings, Logout and profile links retain `href="#"`; they do not implement application actions. Acet Labs, Manu Arora and the skeleton dashboard remain demonstration content. Desktop expansion is hover-driven. The source's mobile open/close controls use click handlers on SVG/div elements without keyboard-button semantics, and the overlay does not implement a complete dialog focus-management pattern. This is source-fidelity work, not a production accessibility certification.

## Existing design documentation

`PRODUCT.md`, `DESIGN.md` and `.impeccable/design.json` remain unchanged. Their public/workspace indigo identity and separate reference-exam boundary continue to govern existing product screens; the neutral Aceternity demo is not a replacement design system. The sidecar and evidence JSON parse successfully.

Pre-existing documentation drift was observed: the root CSS currently declares `--brand: #5055d8`, `--ink: #202237` and `--muted: #626578`, while design frontmatter records primary `#514fe4`, navy `#161a35` and muted `#656d87`. Route-specific rules may override these base values. This sidebar task does not reconcile those existing tokens or regenerate design documentation.
