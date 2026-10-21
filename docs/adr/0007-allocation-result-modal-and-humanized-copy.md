# ADR-0007: Allocation Result Modal, Slip Generation, and Humanized Copywriting

## Status
Accepted

## Date
2026-10-22

## Context
Users requested a dedicated summary view ("หน้าสรุปผล / Result") once they finish entering all allocation items. Specifically:
1. They wanted to inspect the overall budget distribution in a clean financial slip format.
2. They needed quick-export capabilities:
   - Save/Download as a high-resolution PNG image slip (similar to mobile banking slips) to store in their photo gallery or share in chat.
   - Copy a clean Thai text summary to the clipboard for LINE or Notes.
3. The previous UI contained jargon, computer terms, and English in parentheses (e.g. `(Total Funds)`, `(Budget Cycle)`, `(Unallocated Balance)`, `(Free Daily Allowance)`) which felt unnatural for everyday users.

## Decision
1. **Allocation Result Modal (`AllocationResultModal.tsx`):**
   - Implemented a dedicated Glassmorphism modal presenting a financial slip overview.
   - Summarizes: เงินก้อนตั้งต้น, รอบเวลา (วัน), ยอดแบ่งจ่ายทั้งหมด, เงินกินใช้อิสระต่อวัน (Highlight), และเงินคงเหลือ (หรือแจ้งเตือนงบเกิน).
   - Provides three prominent actions:
     - `บันทึกรูปสลิป (PNG)`: Generates an HD PNG slip via HTML5 Canvas API without external heavy libraries.
     - `คัดลอกข้อความสรุป`: Copies clean, friendly Thai text to the clipboard.
     - `ปิดหน้าต่าง / กลับไปแก้ไขต่อ`: Easily returns to adjusting form inputs without losing any state.
2. **Access Points:**
   - Primary action button placed at the base of the left column (below Step 3 & Savings Goal tracker).
   - Secondary shortcuts inside `SummaryDashboard` (Desktop) and `StickyBottomBar` (Mobile).
3. **Humanized Thai Copywriting:**
   - Eliminated technical jargon and parenthetical English terms across the interface.
   - Replaced with friendly, natural Thai terminology documented in `GLOSSARY.md`.

## Consequences
- **Positive:**
  - High user satisfaction with shareable PNG slip and instant LINE/Notes text export.
  - Zero added bundle dependencies (utilizes native Canvas API and Clipboard API).
  - Clean, approachable tone of voice throughout the entire web app.
