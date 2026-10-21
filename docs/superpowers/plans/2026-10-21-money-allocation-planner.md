# Money Allocation Planner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** สร้างเว็บแอปพลิเคชันจัดสรรงบประมาณอัจฉริยะ (Smart Money Allocation Planner) แบบ Local-first รองรับมือถือ/iPad เป็นอันดับแรก คำนวณเงินคงเหลือ สัดส่วน %, งบรายวัน และเป้าหมายเงินออมแบบ Real-time

**Architecture:** สถาปัตยกรรม Client-side Single Page Application (SPA) บน React 19 + TypeScript + Tailwind CSS พร้อมระบบคำนวณแบบ Pure Function (Domain layer), บันทึกข้อมูลอัตโนมัติผ่าน Browser LocalStorage (Data layer), และ UI ที่แยกตาม Component ย่อย พร้อม Sticky Bottom Summary Bar และ PWA capabilities

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Vitest (สำหรับ Unit Testing), vite-plugin-pwa

**Spec:** [docs/superpowers/specs/2026-10-21-money-allocation-planner-design.md](file:///c:/Users/tatar/OneDrive/เดสก์ท็อป/dejung/docs/superpowers/specs/2026-10-21-money-allocation-planner-design.md)

## Global Constraints

- **Platform**: Web (Mobile-First, iPadOS, iOS Safari Standalone, Android Chrome, Desktop)
- **Framework**: React 19 + TypeScript (Standard) + Vite
- **Storage**: Browser LocalStorage only (No backend API, no authentication required)
- **Language**: Thai UI copywriting matching [GLOSSARY.md](file:///c:/Users/tatar/OneDrive/เดสก์ท็อป/dejung/GLOSSARY.md)
- **Input Experience**: Numeric keypad optimization (`inputMode="decimal"`) for all money and day inputs
- **Validation**: Non-blocking visual warnings for over-allocation ($U < 0$) with red indicator and zero daily allowance

## Review Focus

- Empty initial state: When user opens app without data, placeholders show guides without breaking calculations ($T=0, D=30$).
- Division by zero / negative cycle days: If cycle days ($D \le 0$ or NaN), default safely to 1 day to prevent `Infinity` or `NaN`.
- Over-allocation edge case: When allocations exceed total funds ($S > T$), unallocated balance is negative, daily allowance is 0 ฿/day with over-budget warning.
- Current savings exceeding target: When current savings $\ge$ target, progress bar caps at 100% and cycles required shows 0.
- Percentage allocation precision: When percentage allocations yield decimals, values format smoothly to 2 decimal places or nearest integer without floating point drift (e.g. 19.9999999).

---

### Task 1: Environment & Project Foundation (Tailwind, Lucide, Vitest)

**Files:**
- Create: `tailwind.config.js`, `postcss.config.js`
- Modify: `package.json`, `src/index.css`, `vite.config.ts`
- Test: `tests/setup.test.ts`

**Interfaces:**
- Produces: Tailwind CSS utility classes, Lucide React icons, Vitest test runner configuration

- [ ] **Step 1: Install dependencies**
  Run: `npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom && npm install lucide-react clsx tailwind-merge`
- [ ] **Step 2: Configure Tailwind and PostCSS**
  Configure `tailwind.config.js` and `postcss.config.js` with content scanning on `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`.
- [ ] **Step 3: Setup Tailwind in `src/index.css`**
  Add `@tailwind base; @tailwind components; @tailwind utilities;` to `src/index.css`.
- [ ] **Step 4: Configure Vitest in `vite.config.ts`**
  Add test environment `jsdom` to Vite config.
- [ ] **Step 5: Write sanity test in `tests/setup.test.ts`**
  Write a test verifying test runner works: `expect(1 + 1).toBe(2)`.
- [ ] **Step 6: Run tests and commit**
  Run: `npx vitest run tests/setup.test.ts`
  Commit: `git commit -m "chore: setup tailwindcss, lucide-react, and vitest"`

---

### Task 2: Core Domain Model & Calculation Engine (TDD)

**Files:**
- Create: `src/domain/types.ts`, `src/domain/calculator.ts`
- Test: `tests/calculator.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export type AllocationRule = 'daily' | 'fixed' | 'percentage';
  export interface AllocationItem {
    id: string;
    name: string;
    rule: AllocationRule;
    value: number; // rate per day, fixed amount, or percentage number
    isSavings: boolean;
  }
  export interface BudgetState {
    totalFunds: number;
    cycleDays: number;
    items: AllocationItem[];
    savingsTarget: number;
    currentSavings: number;
  }
  export interface CalculationSummary {
    totalFunds: number;
    cycleDays: number;
    totalAllocated: number;
    unallocatedBalance: number;
    freeDailyAllowance: number;
    isOverAllocated: boolean;
    overAllocatedAmount: number;
    totalSavingsAllocated: number;
    savingsProgressPercent: number;
    savingsCyclesRequired: number;
    itemSummaries: Array<{
      id: string;
      calculatedAmount: number;
      percentageOfTotal: number;
    }>;
  }
  export function calculateBudget(state: BudgetState): CalculationSummary;
  ```

- [ ] **Step 1: Write failing unit tests in `tests/calculator.test.ts`**
  Test cases:
  - Daily rate calculation ($150 \times 30 = 4,500$)
  - Fixed amount calculation ($2,000 = 2,000$)
  - Percentage calculation ($25,000 \times 20\% = 5,000$)
  - Unallocated balance & free daily allowance calculation
  - Over-allocation warning when total exceeds funds ($S > T$)
  - Savings goal cycles calculation with existing savings ($50,000 - 20,000 = 30,000 \rightarrow 30,000 / 5,000 = 6 \text{ cycles}$)
  - Zero / invalid cycle days guard ($D \le 0 \rightarrow$ fallback to 1)
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run tests/calculator.test.ts`
  Expected: FAIL with module not found
- [ ] **Step 3: Implement domain types in `src/domain/types.ts` and `calculateBudget` in `src/domain/calculator.ts`**
  Implement pure calculation functions adhering to Section 4 of spec.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run tests/calculator.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  Commit: `git commit -m "feat(domain): implement budget calculation engine with TDD"`

---

### Task 3: State Management & LocalStorage Persistence (TDD)

**Files:**
- Create: `src/hooks/useBudgetPlanner.ts`
- Test: `tests/useBudgetPlanner.test.ts`

**Interfaces:**
- Consumes: `BudgetState`, `CalculationSummary`, `calculateBudget` from Task 2
- Produces:
  ```typescript
  export function useBudgetPlanner(): {
    state: BudgetState;
    summary: CalculationSummary;
    setTotalFunds: (funds: number) => void;
    setCycleDays: (days: number) => void;
    addItem: (item: Omit<AllocationItem, 'id'>) => void;
    updateItem: (id: string, updates: Partial<AllocationItem>) => void;
    removeItem: (id: string) => void;
    setSavingsTarget: (target: number) => void;
    setCurrentSavings: (current: number) => void;
    resetPlan: () => void;
    exportJSON: () => string;
    importJSON: (jsonString: string) => boolean;
  };
  ```

- [ ] **Step 1: Write failing tests in `tests/useBudgetPlanner.test.ts`**
  Test initial state load, state updates, reactive summary calculation, LocalStorage sync, reset, and export/import validation.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run tests/useBudgetPlanner.test.ts`
- [ ] **Step 3: Implement `useBudgetPlanner` in `src/hooks/useBudgetPlanner.ts`**
  Include safe JSON parsing, LocalStorage fallback, and validation.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run tests/useBudgetPlanner.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  Commit: `git commit -m "feat(hooks): implement useBudgetPlanner with LocalStorage sync and export/import"`

---

### Task 4: Setup Card & Header Components

**Files:**
- Create: `src/components/Header.tsx`, `src/components/SetupCard.tsx`, `src/components/ExportImportModal.tsx`
- Test: `tests/SetupCard.test.tsx`

**Interfaces:**
- Consumes: `state`, `setTotalFunds`, `setCycleDays`, `resetPlan`, `exportJSON`, `importJSON`
- Produces: Accessible header bar and step 1 & 2 configuration card with touch-friendly presets (`30 วัน`, `15 วัน`, `7 วัน`) and clean placeholders (`เช่น 25,000`, `เช่น 30`)

- [ ] **Step 1: Write component test for SetupCard**
  Verify input handling, numeric keypad attribute (`inputMode="decimal"`), preset button clicks, and placeholder texts.
- [ ] **Step 2: Implement `Header.tsx` and `ExportImportModal.tsx`**
  Branding, reset confirmation modal, and JSON download/upload modal.
- [ ] **Step 3: Implement `SetupCard.tsx`**
  Clean, modern emerald styling, step badges, quick day chips.
- [ ] **Step 4: Run tests and verify**
  Run: `npx vitest run tests/SetupCard.test.tsx`
- [ ] **Step 5: Commit**
  Commit: `git commit -m "feat(ui): implement header, setup card, and export/import modal"`

---

### Task 5: Allocation Categories Manager & Quick-Add Chips

**Files:**
- Create: `src/components/CategoryList.tsx`, `src/components/CategoryItem.tsx`, `src/components/QuickAddChips.tsx`
- Test: `tests/CategoryList.test.tsx`

**Interfaces:**
- Consumes: `items`, `addItem`, `updateItem`, `removeItem`, `itemSummaries`
- Produces: List of expense rows with calculation mode toggles, numeric inputs, live calculated amount label (`= 4,500 บ. (18%)`), savings tag switch, and quick-add chips (`+ ค่าข้าว`, `+ ค่าน้ำมัน`, `+ ค่ากาแฟ`, `+ เงินออม`)

- [ ] **Step 1: Write component test for CategoryList & QuickAddChips**
  Test clicking a chip adds the corresponding row, test mode change (daily $\leftrightarrow$ fixed $\leftrightarrow$ percent) updates value correctly, test delete button.
- [ ] **Step 2: Implement `QuickAddChips.tsx`**
  Horizontal scrollable chip list with touch-friendly pills and icons.
- [ ] **Step 3: Implement `CategoryItem.tsx` and `CategoryList.tsx`**
  Responsive card layout, mode selector tab, numeric input fields with unit suffixes (`บ./วัน`, `บาท`, ` %`).
- [ ] **Step 4: Run tests and verify**
  Run: `npx vitest run tests/CategoryList.test.tsx`
- [ ] **Step 5: Commit**
  Commit: `git commit -m "feat(ui): implement allocation categories manager with quick-add chips"`

---

### Task 6: Savings Goal Tracker Component

**Files:**
- Create: `src/components/SavingsGoalCard.tsx`
- Test: `tests/SavingsGoalCard.test.tsx`

**Interfaces:**
- Consumes: `savingsTarget`, `currentSavings`, `totalSavingsAllocated`, `savingsProgressPercent`, `savingsCyclesRequired`
- Produces: Savings goal card with target input, optional current savings input, animated progress bar, and cycles-to-goal forecast message

- [ ] **Step 1: Write test for SavingsGoalCard**
  Test rendering progress percentage, cycles calculation text, and zero/exceeded states.
- [ ] **Step 2: Implement `SavingsGoalCard.tsx`**
  Clean card with piggy bank icon, progress bar with gradient, and clear Thai explanation.
- [ ] **Step 3: Run tests and verify**
  Run: `npx vitest run tests/SavingsGoalCard.test.tsx`
- [ ] **Step 4: Commit**
  Commit: `git commit -m "feat(ui): implement savings goal tracker card"`

---

### Task 7: Summary Dashboard & Sticky Bottom Bar (Mobile/iPad)

**Files:**
- Create: `src/components/SummaryDashboard.tsx`, `src/components/DonutChart.tsx`, `src/components/StickyBottomBar.tsx`
- Modify: `src/App.tsx`
- Test: `tests/SummaryDashboard.test.tsx`

**Interfaces:**
- Consumes: `CalculationSummary`, `items`
- Produces:
  - Desktop: Right-side sticky summary with SVG Donut Chart, Big Remaining Balance, Daily Allowance, and Over-budget Alert
  - Mobile/iPad: Sticky bottom bar showing live balance & daily allowance, expandable into modal sheet with Donut Chart and full breakdown

- [ ] **Step 1: Implement SVG-based lightweight `DonutChart.tsx`**
  Render proportional slices with category colors and center label.
- [ ] **Step 2: Implement `SummaryDashboard.tsx`**
  Unallocated balance card, free daily allowance badge, over-budget red banner.
- [ ] **Step 3: Implement `StickyBottomBar.tsx`**
  Fixed bottom banner for mobile (`md:hidden`), tap to expand bottom drawer/sheet.
- [ ] **Step 4: Integrate all components into `src/App.tsx`**
  Split-screen on desktop (`lg:grid lg:grid-cols-12`), stacked on mobile.
- [ ] **Step 5: Run tests and verify build**
  Run: `npm run build`
- [ ] **Step 6: Commit**
  Commit: `git commit -m "feat(ui): implement summary dashboard, donut chart, and sticky mobile bar"`

---

### Task 8: PWA Configuration & Mobile Touch Tuning

**Files:**
- Modify: `vite.config.ts`, `index.html`, `public/manifest.json`
- Test: `npm run build`

**Interfaces:**
- Produces: Progressive Web App service worker, Apple touch icons, theme-color metadata for Safari standalone mode

- [ ] **Step 1: Install `vite-plugin-pwa`**
  Run: `npm install -D vite-plugin-pwa`
- [ ] **Step 2: Configure Vite PWA plugin in `vite.config.ts`**
  Set app name "Dejung - Money Planner", theme color `#0f172a`, background color `#ffffff`, display `standalone`.
- [ ] **Step 3: Add iOS Safari meta tags in `index.html`**
  Add `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `viewport-fit=cover`.
- [ ] **Step 4: Verify production build succeeds**
  Run: `npm run build`
- [ ] **Step 5: Commit and push**
  Commit: `git commit -m "feat(pwa): configure progressive web app and iOS touch optimizations"`
  Run: `git push origin main`
