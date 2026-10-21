# Design Guidelines — Glassmorphism (Liquid Glass)

## Visual Style
- **Aesthetic**: Dark, layered Glassmorphism — frosted glass panels floating over a rich animated background. Influenced by Apple Liquid Glass, macOS context menus, and premium mobile UI
- **Mood**: Tactile, spatial, handcrafted. Feels like physically held glass under warm light — not a flat digital overlay
- **Inspiration**: Apple macOS Big Sur / iOS 26 Liquid Glass, high-end Dribbble product UI, editorial dark-mode design

## Core Rule
Glass panels have no inherent color. Their color comes entirely from the background behind them, blurred and brightened through the panel. The design lives in the background — the glass reveals it softly. Glass fills are always `rgba(255,255,255,N)` — never colored tints, never glowing accent borders as a primary aesthetic.

## Color Palette
- **Background base**: #100d0a — near-black charcoal with warm undertone (default: Ember & Slate)
- **Background mid**: #1c1510
- **Glass fill**: rgba(255, 255, 255, 0.08) — white-neutral; background color bleeds through naturally
- **Glass fill (hover)**: rgba(255, 255, 255, 0.13)
- **Glass border**: rgba(255, 255, 255, 0.12)
- **Glass border (hover/active)**: rgba(255, 255, 255, 0.22)
- **Specular highlight**: rgba(255, 255, 255, 0.20) — 1px inset on top edge, simulates glass thickness
- **Accent Primary**: #f59e0b — amber; CTAs and interactive states only
- **Accent Secondary**: #c2410c — burnt sienna; blob backgrounds
- **Blob 3**: #78350f — deep amber-brown
- **Text Primary**: rgba(255, 248, 240, 0.95) — warm off-white, never pure #ffffff
- **Text Secondary**: rgba(255, 235, 210, 0.60)
- **Text Muted**: rgba(255, 220, 180, 0.35) — placeholders, labels

> **Palette swap**: Replace blob colors to change the entire mood. Glass fill stays white-neutral across all palettes.

## Alternate Palettes
| Name | BG Base | Blob Colors |
|------|---------|-------------|
| Ocean Frost | #030d1a | #06b6d4 / #0ea5e9 / #6366f1 |
| Soft Bloom | #1a0e1c | #c084fc / #f472b6 / #818cf8 |
| Warm Sunset | #1a0a0a | #f97316 / #ec4899 / #f59e0b |
| Emerald Mist | #051a0a | #10b981 / #d4af37 / #065f46 |
| Liquid Glass / Light | #f0ebe3 | #a78bfa / #5eead4 / #fb923c |

## Typography
- **Heading Font**: Outfit — 700 / 800 weight. Geometric, modern. Import from Google Fonts.
- **Body Font**: DM Sans — 400 / 500 weight. Neutral, highly readable.
- **Headings**: Large, tight letter-spacing (-0.02em), fluid sizing with `clamp()`
- **Body**: 1rem, line-height 1.75, text-secondary color — never primary white on long copy
- **Labels / Muted**: DM Sans 500, small size, text-muted color
- **Scale**:
  - h1: `clamp(2.5rem, 5vw, 4.5rem)` / 800
  - h2: `clamp(1.8rem, 3vw, 3rem)` / 700
  - h3: `1.5rem` / 600
  - p: `1rem` / 1.75 line-height

## Spacing & Layout
- **Overall feel**: Airy — glass panels need space around them to read as floating objects, not wallpaper
- **Section padding**: 80–120px top/bottom
- **Card padding**: 2rem (32px) minimum internal
- **Grid**: CSS Grid or Flexbox; max-width 1200px centered
- **Card gap**: 1.5–2rem — panels must not visually merge
- **Mobile**: Stack to single column; reduce section padding to ~48px; keep blob background

## Borders & Radius
- **Cards**: 20px border-radius
- **Large panels / hero**: 28px
- **Buttons**: 999px pill shape (default for primary + secondary)
- **Inputs**: 999px pill shape
- **Badges / tags**: 999px pill
- **Glass border**: Always 1px — never remove. It is what makes the panel readable against the background.
- **Premium variant**: Gradient border via `::before` pseudo — light hits top-left corner only, fades to invisible at bottom-right

## Shadows & Elevation
- **Base**: `0 12px 40px rgba(0,0,0,0.35)` — deeper than standard dark UI to separate glass from background
- **Hover**: `0 20px 60px rgba(0,0,0,0.50)`
- **Specular (always present)**: `0 1px 0 0 rgba(255,255,255,0.20) inset` — the Apple Liquid Glass signature. Simulates the physical top edge of a glass panel catching overhead light.
- **Light mode specular**: `0 2px 0 0 rgba(255,255,255,0.80) inset` — brighter, thicker feel
- **Nav**: Border-bottom only — no drop shadow

## Buttons
- **Primary CTA**: Solid filled with accent-primary. Not glass. Pill shape. Hover: `translateY(-2px)` + `brightness(1.1)`. Active: `translateY(1px) scale(0.97)`.
- **Secondary**: Glass pill — `rgba(255,255,255,0.08)` fill, white border, specular highlight. Hover lifts.
- **Never**: Glowing colored borders or pulsing halos as a default button state — AI-template tell.

## Icons
- **Always**: Real inline SVG paths only
- **Never**: Emoji, icon fonts, or background containers around icons
- **Style**: Line/stroke icons. Stroke-width 1.5–2px. Fill: none. Color: currentColor (inherits text color).
- **Size**: 20–24px for UI, 16px inline with text
- **Placement**: Directly inline in markup — no wrapper div, no box, no circle background

## Components
- **Glass Card**: White-neutral fill + backdrop blur + specular inset + border. Hover lifts 4px with shimmer sweep.
- **Premium Card**: Same as glass card but gradient border via `::before` mask — light catches top-left corner only.
- **Navbar**: Sticky, `rgba(255,255,255,0.06)` fill, `blur(24px) saturate(180%)`, border-bottom only.
- **Context Menu**: Heavier blur (`blur(28px) saturate(200%)`), tight item rows with inline SVG icons, horizontal divider line between groups.
- **Inputs**: Pill shape, glass fill, white border, focus state adds outer ring + specular.
- **Badges / Tags**: Small pill, `rgba(255,255,255,0.08)` fill, subtle border, muted text.
- **Skeleton loaders**: Matching glass panel with diagonal shimmer sweep animation — preserves aesthetic during async load.

## Background System
- **Base**: Dark gradient — bg-primary to bg-secondary
- **Blob 1**: 650x650px circle, `filter: blur(90px)`, opacity 0.55, top-left, slow float animation
- **Blob 2**: 450x450px, bottom-right, `animation-delay: -4s`
- **Blob 3**: 350x350px, center, `animation-delay: -7s`
- **Animation**: `transform` only — translate + scale. Never animate color or filter. 10s ease-in-out infinite.
- **Rule**: Glass only looks right over a rich, colorful background. Flat or grey backgrounds produce dirty glass — the blur picks up no color.

## Micro-Animations
- **Scroll reveal**: Cards blur-in from `translateY(24px)` + `blur(8px)` — triggered by IntersectionObserver. Stagger children with `transition-delay`.
- **Hover lift**: `translateY(-4px)` + shadow grows. Spring easing: `cubic-bezier(.34,1.56,.64,1)`.
- **Shimmer sweep**: Diagonal light ray (`::after` pseudo) sweeps across card on hover. Skewed white gradient.
- **3D tilt**: `mousemove` tilts card in `perspective(900px)` ±9deg. Expressive tier only — max 3 elements per page.
- **Button press**: 3-state — rest / hover (lift) / active (`translateY(1px) scale(0.97)`). Active snaps to 0.08s.
- **Input focus**: Border brightens to `rgba(255,255,255,0.30)` + outer glow ring + specular.
- **Animate `transform` and `opacity` only** — never `backdrop-filter`, dimensions, or layout properties.

## Accessibility
- `@supports not (backdrop-filter)` — fallback to near-opaque dark fill
- `@media (prefers-reduced-transparency)` — solid fill, no blur
- `@media (prefers-reduced-motion)` — all animations stripped; reveal elements visible immediately
- Text contrast: warm off-white on dark glass must meet WCAG AA (4.5:1 minimum)
- Light mode: use near-black text `rgba(20,16,12,0.90)` — never dark gray on near-clear glass

## Replication Notes
Key things an AI coding tool must know to nail this style:
- Glass fill is `rgba(255,255,255,N)` — white neutral only. Blob colors behind the glass define the palette.
- Always use `backdrop-filter: blur(20px) saturate(180%)` together — saturate makes background colors bloom through rather than going grey
- The 1px specular inset (`box-shadow: 0 1px 0 rgba(255,255,255,0.20) inset`) is non-negotiable — it separates real glass from a blurry overlay
- Primary CTA is solid filled, not glass — glass for secondary actions only
- Pill shapes for buttons and inputs — not square, not slightly rounded
- Never stack more than 3 blurred layers — performance collapses and it looks muddy
- No pulsing glow animations by default — one of the clearest AI-generated UI signals
- Inline SVG icons only — no emoji, no icon boxes, no containers
