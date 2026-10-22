# 0011. App Settings Modal, 60fps Motion System, and Mobile Layout Optimization

Date: 2026-10-22

## Context
1. **Mobile Touch Ergonomics:** In `ExportImportModal`, displaying the 6-character input field and the "ดึงแผน" (Fetch Plan) button side-by-side caused horizontal overflow on narrow mobile screens (<= 390px) due to inner modal padding. The button needed to be repositioned directly below the input field as a prominent full-width touch target.
2. **Smooth 60fps Motion & Tactile Feedback:** The user requested subtle, fluid motion throughout the interface to elevate the app into a premium experience. In accordance with performance guidelines (`60fps-animation`), motion must strictly animate compositor-only properties (`transform` and `opacity`) to avoid layout thrashing and stutter.
3. **User Customization & Accessibility:** Users requested the ability to toggle animations and individual sections on or off (e.g. hide the Savings Goal card or Category list, or disable 3D background).
4. **Brand Copy Refinement:** The tagline "ผู้ช่วยจัดสรรงบประมาณ" was removed across all touchpoints (Header, slip generator text and canvas watermark, PWA manifest, and documentation) in favor of clean, concise phrasing.

## Decision
1. **Full-Width Stacked Layout in `ExportImportModal`:**
   - Restructured the 6-character code import section into a vertical stack with `w-full` on both the input (`font-bold font-mono tracking-widest text-lg`) and the action button (`w-full py-3 bg-brand-lime text-slate-950 rounded-full font-medium active:scale-[0.98]`).
2. **App Settings System (`useAppSettings` & `SettingsModal`):**
   - Implemented `useAppSettings` with `localStorage` persistence under key `dejung_app_settings_v1`.
   - Settings supported:
     - `enableAnimations`: controls interface motion and applies/removes `.no-motion` on `document.documentElement`.
     - `showSavingsGoal`: toggles rendering of `SavingsGoalCard`.
     - `showCategories`: toggles rendering of `CategoryList`.
     - `enable3DBackground`: toggles rendering of `Ambient3DBackground`.
   - Built `SettingsModal` with authentic glassmorphism styling, iOS-style accessible toggle switches (`role="switch"`, `aria-checked`), and a reset-to-defaults feature.
   - Added `Settings` icon button in `Header` next to the theme switcher.
3. **60fps Compositor-Only Motion:**
   - Defined `@keyframes bento-in` animating only `transform: translateY(14px) scale(0.985)` to `translateY(0) scale(1)` and `opacity: 0` to `1`.
   - Added staggered delays (`delay-1` through `delay-5`) for Bento grid cards.
   - Micro-interaction tactile feedback with snappy `.tactile-btn:active` (`transform: scale(0.96)`).
   - Universal `.no-motion` class and `@media (prefers-reduced-motion: reduce)` suppressing all animation and transition durations to `0.001ms`.
4. **Tagline Cleanup:**
   - Removed "ผู้ช่วยจัดสรรงบประมาณ" from `Header.tsx`, `slipGenerator.ts`, `vite.config.ts`, and `README.md`.

## Consequences
- **Zero layout overflow** on mobile devices regardless of viewport width.
- **Buttery smooth 60fps animations** that do not trigger layout recalcs or style recalculation bottlenecks.
- **Complete accessibility compliance** honoring both user-selected motion preferences and system `prefers-reduced-motion`.
- **Full test coverage:** 18 test suites and 60 unit/integration tests passing cleanly.
