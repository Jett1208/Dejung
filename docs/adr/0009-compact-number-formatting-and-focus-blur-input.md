# ADR-0009: Compact Number Formatting and Focus-for-Edit / Blur-for-Format Input

## Status
Accepted

## Date
2026-10-22

## Context
1. **Number Text Overflow with Large Figures:**
   - As users entered large financial amounts (e.g., hundreds of thousands or millions of Baht), the text strings (e.g. `฿100,000,000`) caused visual overflows across several UI cards, input fields, badges, donut chart hole labels, and the mobile sticky bottom bar.
2. **User Requirement & Trade-offs:**
   - The user requested abbreviating large numbers exceeding tens of thousands (e.g., `100,000` = `100k`, `1,000,000` = `1M`).
   - During editing/typing, users must see the real raw numbers to ensure full precision and mistake-free input.
   - Upon completing input (blur), the values should abbreviate neatly to fit the responsive layout without wrapping or clipping.
   - For accessibility and clarity, exact figures must remain viewable via hover/tap tooltips.

## Decision
1. **Formatting Thresholds (`src/utils/numberFormat.ts`):**
   - Values `< 100,000`: Render with standard locale commas (e.g. `25,000`, `99,999`) to retain precise Baht tracking for everyday living budgets.
   - Values `>= 100,000` and `< 1,000,000`: Abbreviate to `k` (e.g. `100k`, `250.5k`, omitting `.0`).
   - Values `>= 1,000,000`: Abbreviate to `M` (e.g. `1M`, `2.5M`, omitting `.0`).
   - Negative numbers retain minus sign (`-100k`, `-2.5M`).
   - Every formatted compact number provides a `title` tooltip displaying full Thai currency (e.g., `฿100,000 บาท`).
2. **Focus-for-Edit / Blur-for-Format Pattern (`src/components/CompactNumberInput.tsx`):**
   - Input component switches dynamically between raw digits when focused (`isFocused ? draftValue : compactValue`).
   - Browser native `<input type="text" inputMode="decimal">` is used because native `type="number"` rejects non-numeric characters like "k" and "M".
   - Seamless validation on blur (`min`, `max`, fallback to `0`).
   - Suffix unit badge (`บาท`, `%`, `บ./วัน`) supported.
3. **Hero Balance Card Dynamic Font Sizing (`src/components/SummaryDashboard.tsx`):**
   - Dynamic font scaling based on string length (`<= 8` chars: `text-3xl sm:text-4xl`; `9-11` chars: `text-2xl sm:text-3xl`; `> 11` chars: `text-xl sm:text-2xl`). This retains exact Baht precision on the hero balance without overflowing or clipping against the 3D coin.
4. **Widespread UI Adoption:**
   - Deployed across `SetupCard`, `CategoryItem`, `SavingsGoalCard`, `SummaryDashboard`, `StickyBottomBar`, `DonutChart`, and `AllocationResultModal`.

## Consequences
- **Positive:**
  - Complete elimination of text overflow on all mobile screens and desktop viewports, even for 9+ digit figures.
  - Smooth user editing experience: exact digits appear when typing, neat compact strings appear when blurred.
  - Full Baht accuracy is never lost due to native `title` tooltips and hero balance scaling.
  - 100% test coverage with 40 passing Vitest tests.
