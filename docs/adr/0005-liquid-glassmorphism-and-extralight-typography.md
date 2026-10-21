# 0005: Liquid Glassmorphism Design System and ExtraLight Typography

We decided to adopt the Apple-inspired Liquid Glassmorphism design system (`glassmorphism-design` skill) and adjust the Mitr font weight to ExtraLight (200) / Light (300).

### Context & Trade-off
Previous UI cards used standard solid/semi-translucent surfaces with bold typography, which felt visually heavy and didn't fully complement the 3D particles. 

Applying the Liquid Glass standard requires:
1. Neutral white-only glass fills (`rgba(255, 255, 255, 0.08)` in dark mode, `0.45` in light mode) with `backdrop-filter: blur(20px) saturate(180%)`.
2. Mandatory 1px specular top edge highlight (`box-shadow: 0 1px 0 0 rgba(255,255,255,0.20) inset`) simulating physical glass thickness.
3. Smooth animated luminous blobs (Lime, Mint, Purple) beneath the glass to let rich colors bleed through softly.
4. Pill-shaped (`rounded-full`) inputs and secondary buttons.
5. Mitr ExtraLight 200 / Light 300 base typography for an ethereal, delicate editorial reading experience.
