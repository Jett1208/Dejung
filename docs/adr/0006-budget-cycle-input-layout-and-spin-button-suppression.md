# ADR-0006: Budget Cycle Tiered Layout and Spin Button Suppression

## Status
Accepted

## Date
2026-10-22

## Context
In Step 2 ("รอบเวลา" / Budget Cycle), the numeric input for cycle days was initially placed in a single row (`flex gap-2`) alongside three preset buttons (`30 วัน`, `15 วัน`, `7 วัน`). On standard desktop column widths and mobile viewports:
1. The input width shrank to ~70–80px, leaving insufficient horizontal space after factoring in 68px of padding (`pl-5 pr-12`) and the right-aligned unit label ("วัน").
2. The browser's native number stepper arrows (`::-webkit-inner-spin-button`) occupied an additional 16–20px inside the pill input, overlapping with the unit label and causing the entered number (e.g., "30") to be completely clipped or displaced out of visibility.

## Decision
1. **Tiered Layout for Budget Cycle:**
   - **Tier 1 (Top):** Dedicated full-width numeric input (`glass-input w-full pl-5 pr-14 py-3`) with ample breathing room for custom values and unit suffix ("วัน"). Symmetrical with Step 1 (Total Funds).
   - **Tier 2 (Bottom):** Dedicated horizontal row of quick preset pill buttons (`ปุ่มลัด: [30 วัน] [15 วัน] [7 วัน]`) with wrap support.
2. **Global Native Spin-Button Suppression:**
   - Suppressed `::-webkit-inner-spin-button`, `::-webkit-outer-spin-button`, and enabled `-moz-appearance: textfield` in `src/index.css` for all `input[type="number"]`.
   - Prevents browser default stepper controls from conflicting with custom unit labels and maintains the clean Liquid Glassmorphism design system.

## Consequences
- **Positive:**
  - The cycle days value is always clearly visible and never clipped regardless of viewport width.
  - Symmetrical visual balance between Step 1 (Total Funds) and Step 2 (Budget Cycle).
  - Clean glass pill styling without intrusive browser-specific black stepper widgets.
- **Negative:**
  - Adds ~28px of vertical height to Step 2 to accommodate the two-tier structure.
