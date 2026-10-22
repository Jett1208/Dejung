# 0012. PWA Safe Area Insets, Sticky Safe Header, and iPad Optimization

Date: 2026-10-22

## Context
When running Dejung as an installed Progressive Web App (PWA) in iOS/iPadOS standalone mode (`display: standalone`, `apple-mobile-web-app-status-bar-style: black-translucent`, `viewport-fit=cover`):
1. **Status Bar & Dynamic Island Collision:** The web application viewport begins at `y: 0` behind the device hardware notch, Dynamic Island, clock, Wi-Fi, and battery indicator. Without explicit safe-area-inset padding, the top `Header` component was obscured by the status bar, causing accidental taps or tap blocking.
2. **Loss of Header on Scroll:** When users scrolled down to view allocation categories or summary charts, the header scrolled off the screen, preventing them from accessing the Settings modal, Theme toggle, or Reset options without scrolling all the way back to the top.
3. **Faint Black Box at Bottom:** In `App.tsx`, the root container had `dark:bg-black/25`, which applied a 25% black tint over the 3D green particle background. When users scrolled down to the bottom or triggered rubber-band overscroll on iOS, the bottom edge of this container became visible as an unsightly faint black rectangle.
4. **iPad Screen Layout:** iPad displays (in both portrait and landscape) needed balanced margin and padding so the layout felt roomy and ergonomic in fullscreen PWA mode.

## Decision
1. **Root Safe Area Insets & Removal of Black Tint:**
   - Removed `dark:bg-black/25` from the root container in `App.tsx`, letting the authentic 3D ambient visuals render seamlessly without dark boundaries or tint seams during rubber-band overscroll.
   - Added top padding `pt-[max(0.75rem,env(safe-area-inset-top))]` and bottom padding `pb-[max(7rem,calc(env(safe-area-inset-bottom)+5.5rem))]` on mobile and `pb-[max(3rem,calc(env(safe-area-inset-bottom)+2rem))]` on desktop.
   - Added horizontal safe area insets `pl-[max(1rem,env(safe-area-inset-left))]` and `pr-[max(1rem,env(safe-area-inset-right))]` for landscape orientations on iPad and iPhone.
2. **Sticky Safe Header:**
   - Modified `Header.tsx` to become sticky at `sticky top-[max(0.5rem,env(safe-area-inset-top))] z-30`.
   - Ensured high-grade backdrop blur (`backdrop-blur-md`) and glass specular highlights so that content scrolling beneath the Header does not create visual clutter.
3. **Ergonomic Bottom Bar Inset (`StickyBottomBar`):**
   - Added `pb-[max(0.75rem,env(safe-area-inset-bottom))]` to `StickyBottomBar.tsx` so the floating summary bar sits naturally above the iOS Home Indicator line.
4. **iPad Fullscreen Optimization:**
   - Enhanced container padding `px-4 sm:px-6 md:px-8` and responsive spacing across iPad viewport sizes.

## Consequences
- The Header remains permanently accessible at all times while scrolling, comfortably clearing the Dynamic Island, notch, and battery indicator.
- The faint black box at the bottom is completely eliminated.
- Fullscreen PWA experience on both iPhone and iPad is native-feeling, elegant, and ergonomic.
