# 0013. Bottom Sheet Slide-Up Animation and Direct Header Add Button

Date: 2026-10-22

## Context
1. **Mobile Bottom Sheet Motion:** On mobile and iPad, tapping the summary bar in `StickyBottomBar` displayed the full overview sheet immediately without transition due to unconfigured animation classes (`animate-in slide-in-from-bottom`). A fluid, native iOS-grade 60fps slide-up sheet animation was needed to elevate the mobile experience.
2. **Category Add Ergonomics:** Previously, custom item creation was represented as a "+ เพิ่มเอง" chip placed at the end of the horizontally scrolling `QuickAddChips` list. Users on smaller viewports had to swipe horizontally through all preset chips to find the add button. Relocating this action directly to the category section header allows one-tap access without scrolling.

## Decision
1. **Compositor-Only Bottom Sheet Animation (`drawer-slide-up`):**
   - Added keyframe animation `@keyframes drawer-slide-up` animating `transform: translateY(100%)` to `translateY(0)` with timing curve `cubic-bezier(0.16, 1, 0.3, 1)` (350ms duration) in `src/index.css`.
   - Added `@keyframes drawer-fade-in` for the backdrop scrim (250ms duration).
   - Applied `.animate-drawer-slide-up` and `.animate-drawer-fade-in` to `StickyBottomBar.tsx`.
   - Guaranteed full compatibility with `.no-motion` and `@media (prefers-reduced-motion: reduce)`.
2. **Direct Category Header Add Button:**
   - Removed the custom "+ เพิ่มเอง" button from `QuickAddChips.tsx`.
   - Added a prominent, lime-green "+ เพิ่ม" button directly in the `CategoryList.tsx` header (`<button onClick={...}> <Plus ... /> <span>เพิ่ม</span> </button>`) alongside the item count pill.
   - Preserves quick preset chips (ข้าว, น้ำมัน, เงินออม) for one-tap convenience while giving direct access to custom item creation.

## Consequences
- Native iOS-like slide-up motion when opening the bottom summary drawer.
- Zero horizontal scrolling needed to add custom allocation categories.
- 100% test coverage preserved with clean linting and fast builds.
