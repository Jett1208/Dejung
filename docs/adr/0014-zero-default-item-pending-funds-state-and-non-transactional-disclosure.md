# 0014. Zero Default Item Creation, Pending Funds State, and Non-Transactional Disclosure

Date: 2026-10-22

## Context
1. **Premature Budget Deficit from Default Item Value:** Previously, clicking the "+ เพิ่ม" button created a new item initialized with `100 บาท/วัน`, immediately computing to 3,000 Baht over a 30-day cycle. This forced a budget deficit and triggered panic over-allocation states before the user had a chance to input their actual intended amount.
2. **Premature Over-Allocation Warning on Unfilled Funds:** If a user added an item before entering their initial total funds (`totalFunds === 0`), the calculator treated the allocation as an over-allocation (`unallocatedBalance = -totalAllocated < 0`), showing a harsh red warning banner stating "จัดสรรเงินเกินงบไป..." even though the user was simply filling out step 3 before step 1.
3. **User Expectation Management Regarding Real Transactions:** Users might misunderstand "เงินกินใช้อิสระต่อวัน" as an automated expense tracker or live account balance integration. Clear non-transactional micro-copy was requested to clarify that figures are simulated planning projections rather than live bank account debits.

## Decision
1. **Zero-Default Item Creation:**
   - Modified the "+ เพิ่ม" action in `CategoryList.tsx` and the empty-state "เพิ่มรายการแรก" action to initialize with `value: 0` and name `"รายการใหม่"`, allowing users to enter their exact number without pre-populating a 100-baht rate.
2. **Pending Initial Funds State Handling:**
   - Updated `calculateBudget` in `src/domain/calculator.ts`: `isOverAllocated` is now strictly conditioned on `totalFunds > 0 && unallocatedBalance < 0`.
   - When `totalFunds === 0`:
     - In `SummaryDashboard.tsx`, display an informative state: `"ใส่เงินที่มีในรอบนี้เพื่อคำนวณ"` instead of negative numbers or over-allocation banners.
     - In `StickyBottomBar.tsx`, display `"ใส่เงินเพื่อคำนวณ"` under unallocated balance and hide warning badges until funds are provided.
     - In `Dejung3DCoin.tsx`, maintain emerald state and avoid warning red state when `totalFunds === 0`.
3. **Simulation & Non-Transactional Disclosures:**
   - Added micro-copy in `SummaryDashboard.tsx`, `StickyBottomBar.tsx`, `AllocationResultModal.tsx`, and `slipGenerator.ts`:
     *“คำนวณตามแผนที่คุณตั้งไว้ • ไม่มีการตัดเงินหรือติดตามการใช้จ่ายจริงระหว่างบัญชี”*

## Consequences
- No unexpected budget jumps or red deficit alerts when creating items.
- Gentle, helpful guidance ("ใส่เงินที่มีในรอบนี้เพื่อคำนวณ") for users exploring categories before inputting their budget funds.
- Clear user expectations regarding the app's nature as an offline/local-first money allocation simulator.
- 100% test coverage preserved with all test suites passing.
