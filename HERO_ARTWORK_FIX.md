# Dashboard hero artwork framing

## Rejected treatments

The original framing fix exposed three floating strips with flat endpoints. The subsequent endpoint-mask treatment retained the original paths and softened their caps, but the user rejected it as making no real difference. The next connected redraw still read as narrow bands; `artifacts/hero-framing/composed-final/review.md` requested a rebuild. The original `before/`, `after/`, `correction/` and `composed-final/` captures and reviews are historical evidence of rejected treatments, not approval for the current implementation.

## Current correction

`src/components/dashboard/journey-hero.tsx` composes broad front and rear terrain planes anchored to the banner bottom, with a broad folded underside and attenuated front contours. The front tapers from `M300 240`. The SVG uses `viewBox="0 0 1600 240"` and `preserveAspectRatio="xMaxYMid slice"`. Its horizontal continuation intentionally extends beyond the right banner edge. Geometry intentionally meets y=240 at the banner bottom as part of the composition; this is not accidental truncation of a lower curve. The implementation preserves colors, gradient IDs, 27 contours, two highlights, group attributes and scoped GSAP lifecycle and choreography, including font/data readiness, the active deferred-callback guard, reduced-motion handling and cleanup.

`src/components/dashboard/dashboard-v5.module.css` places the desktop artwork in a right-aligned absolute wrapper with `inset: 0 0 0 auto`, width 100%, SVG width/height 100%, no mask and no negative offsets. The hero retains its 236px minimum height and 16px rounded boundary. At workspace container widths ≤900px, copy and actions come first, followed by a separate full-bleed 120px artwork row with zero padding. The same row persists at ≤560px. There is no artwork mask at any width. Total height is content-driven: observed 320px at 768px viewport and 347px at 390px.

## Current evidence

`artifacts/hero-framing/terrain-final/` contains fresh captures at 390, 768, 1440, 1792 and 1920px plus `bounds.json`. The fresh independent `artifacts/hero-framing/terrain-final/review.md` records **ship** for hero framing in those five static captures: broad connected lower terrain, a visible shaded fold junction, deliberate edge continuation and readable copy/actions. This verdict is limited to hero framing; it does not approve the full application or independently verify runtime motion.

The latest production build passed. The final five targeted production Playwright tests passed in 5.0 seconds, including real-SVG motion and responsive bounds checks. The prior redraw passed all 33 production Playwright tests in 28.4 seconds; that full-suite result predates this terrain rebuild. Lint has zero errors and one pre-existing raw-image warning in the isolated Sidebar demo. These results are distinct from visual acceptance of the final terrain composition.

## Boundary and durable contract

This correction is limited to the dashboard hero geometry and its immediate responsive wrapper. Preserve copy, actual data, CTA destinations, colors, contour/highlight counts and the existing animation behavior. `DESIGN.md` and `.impeccable/design.json` carry the current framing rule, superseding only older hero framing descriptions in `DASHBOARD_LAYOUT.md` and `DASHBOARD_V5.md`. All other density, layout, brand, sidebar, public-page and reference-exam contracts remain in force. Do not restore the rejected strips, endpoint masks or narrow-band composition.
