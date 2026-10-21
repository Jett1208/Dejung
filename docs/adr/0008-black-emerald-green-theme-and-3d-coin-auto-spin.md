# ADR-0008: Black and Emerald Green Theme and 3D Coin Upright Auto-Spin

## Status
Accepted

## Date
2026-10-22

## Context
1. **Color Scheme Alignment with Bento Reference:**
   - The user requested modernizing the color theme to match a Bento Grid Minimalist aesthetic:
     - **Dark Mode:** Deep Matte Black (`#08090B`) base + Dark Charcoal Glass Cards (`#12151A`) with Vibrant Emerald Green (`#05DF72` / `#10B981`) accents.
     - **Light Mode:** Pure Clean White (`#F8FAFC`) base + White Glass Cards with Vibrant Emerald Green accents.
   - Replaced previous blue-tinted midnight (`#0B132B`) and yellow-lime (`#D9FF62`).
2. **3D Coin Fixes:**
   - The letter 'D' on the coin face was previously rendered upside down due to Cylinder geometry UV rotation around the X-axis.
   - The coin was largely static unless actively dragged, lacking constant lively motion.

## Decision
1. **Design System & Palette Update:**
   - Updated `tailwind.config.js` and `src/index.css` to use `#08090B` (matte black), `#12151A` (charcoal glass), and `#05DF72` / `#10B981` (emerald green).
   - Updated background luminous blobs and Three.js ambient particles to emit soft emerald green glow.
   - Updated the Donut Chart palette to lead with vibrant emerald green.
2. **3D Coin Upright Texture & Continuous Auto-Spin:**
   - Rotated the coin face texture 180 degrees (`coinTexture.center.set(0.5, 0.5); coinTexture.rotation = Math.PI;`) to ensure the letter 'D' stands upright.
   - Enabled steady continuous vertical rotation (`spinVelocity = 0.024` rad/frame) in the Three.js animation loop, coupled with a fixed perspective tilt to showcase 3D depth and metallic rim lighting at all times.
   - Preserved interactive drag/flick with smooth momentum decay back to base spin speed.

## Consequences
- **Positive:**
  - High contrast, modern Bento tech look matching the provided design reference.
  - The 3D coin rotates smoothly on its own with the 'D' monogram displayed upright.
  - Consistent emerald green highlights across primary CTA buttons, donut slices, and downloaded PNG slips.
