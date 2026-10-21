# Specification: Money Allocation Planner (Dejung)

## Problem Statement

People who receive a lump sum of money (such as a monthly salary or project revenue) struggle to plan and divide their funds across a specific timeframe (such as 30 days). Common challenges include:
- Unclear daily spending limits: Not knowing how much money can be spent each day on food and discretionary items without running out before the end of the cycle.
- Disconnected savings goals: Difficulty connecting a monthly savings allocation to a larger long-term milestone (e.g. how many months/cycles are required to save 50,000 THB).
- Tedious existing tools: Most personal finance apps focus on reactive expense logging (entering individual receipts and transactions after spending), which requires high effort and doesn't provide proactive up-front budget allocation.
- Privacy & friction concerns: Many web apps require registration, cloud accounts, and server logins for simple private calculations.

## Solution

A responsive, client-side, local-first web application designed primarily for Mobile and iPad users that calculates and visualizes budget allocation up front:
1. Users enter **Total Funds** and define a **Budget Cycle** (in days).
2. Users add **Allocations** via 3 flexible rules: Daily Rate (฿/day × days), Fixed Lump-Sum (฿), or Percentage (%).
3. The system calculates in real time the **Unallocated Balance**, **Free Daily Allowance** (discretionary spending per day), and **Savings Target Trajectory** (cycles needed to achieve savings milestones).
4. Provides real-time visual feedback via an interactive Donut Chart and a Sticky Bottom Summary Bar for mobile viewports, with instant LocalStorage persistence and zero login requirements.

## User Stories

1. As a budget planner, I want to enter my total funds for a period, so that I have a clear baseline for all my allocations.
2. As a budget planner, I want to define the length of my budget cycle in days, so that my daily expenses and allowances scale accurately to my timeframe.
3. As a budget planner, I want quick-select options for standard cycle lengths (30, 15, 7 days), so that I can set my period with a single tap.
4. As a budget planner, I want to see clean instructional placeholder values (`เช่น 25,000`, `เช่น 30 วัน`) when opening the app, so that I understand what to enter without having to delete dummy data.
5. As a budget planner, I want to add allocation items using daily rates (e.g. 150 THB/day for meals), so that the total cost is automatically multiplied across the cycle days.
6. As a budget planner, I want to add allocation items using fixed lump-sums (e.g. 2,000 THB for fuel), so that fixed recurring expenses are accounted for.
7. As a budget planner, I want to add allocation items using percentages of total funds (e.g. 20% for savings), so that funds are proportionally split regardless of total income size.
8. As a mobile or iPad user, I want quick-add chips for common categories (food, fuel, coffee, savings), so that I can add frequent expenses with one tap on mobile.
9. As a mobile user, I want all numeric input fields to trigger decimal-optimized keypads (`inputMode="decimal"`), so that typing monetary amounts is effortless.
10. As a budget planner, I want to see the calculated total amount and percentage of total funds for each category, so that I understand its impact on my overall budget.
11. As a budget planner, I want to toggle whether an allocation item counts as savings, so that it automatically connects to my savings goal tracker.
12. As a budget planner, I want to set an overall savings target goal, so that I can monitor my long-term financial milestones.
13. As a budget planner, I want to optionally input my current accumulated savings, so that the progress bar reflects my actual real-world savings progress.
14. As a budget planner, I want the system to calculate how many budget cycles it will take to reach my savings target, so that I have a realistic timeline for my financial goal.
15. As a budget planner, I want to see my Unallocated Balance update in real-time as I type, so that I instantly know how much unassigned money remains.
16. As a budget planner, I want to see a Free Daily Allowance figure, so that I know exactly how much discretionary money I can spend each day without breaking my plan.
17. As a budget planner, I want clear, non-blocking visual warnings (red badge and negative remaining balance) when allocations exceed total funds, so that I am alerted without being blocked from typing.
18. As a budget planner, I want to view a visual Donut Chart of my expense distribution, so that I can see the visual balance of where my money goes.
19. As a mobile user, I want a sticky bottom summary bar that remains visible while scrolling, so that I don't lose sight of my remaining balance.
20. As a mobile user, I want to tap the sticky bottom bar to expand a full summary sheet with chart details, so that I can inspect the breakdown without scrolling back to the top.
21. As a privacy-conscious user, I want all my data saved automatically to my browser's local storage, so that my financial data stays on my device and loads instantly without logging in.
22. As a user switching devices or taking backups, I want to export and import my budget plan as a JSON file, so that I never lose my data.
23. As a user starting fresh, I want a reset option, so that I can clear all inputs back to an empty state with confirmation.
24. As an iPhone/iPad user, I want to add the web app to my home screen via PWA, so that it launches in full-screen mode like a native app.

## Implementation Decisions

### Modules & Architecture
- **Domain Layer (`domain/calculator`)**: Pure functional calculation module devoid of side effects or UI dependencies. Computes allocations, remaining balances, daily rates, and savings timelines.
- **State & Storage Layer (`hooks/useBudgetPlanner`)**: Custom hook managing the application state, synchronizing changes to `window.localStorage` under a versioned storage key, and providing JSON export/import handlers.
- **Presentation Layer (React Components)**:
  - `SetupCard`: Inputs for Total Funds and Cycle Days with quick-preset buttons.
  - `QuickAddChips`: Tap targets for instant category row creation.
  - `CategoryList` & `CategoryItem`: Editable allocation items with rule switchers (daily/fixed/percent), numeric inputs, and delete actions.
  - `SavingsGoalCard`: Goal target, current savings input, progress bar, and forecast text.
  - `SummaryDashboard` & `DonutChart`: Desktop visual breakdown and status cards.
  - `StickyBottomBar`: Mobile/iPad floating banner with expandable bottom drawer.

### Architectural Decisions (ADR References)
- **Local-First Client Storage ([ADR-0001](file:///c:/Users/tatar/OneDrive/เดสก์ท็อป/dejung/docs/adr/0001-client-side-local-first-storage.md))**: Browser LocalStorage used exclusively for persistence. No database, server, or user accounts.
- **Mobile-First Touch & PWA ([ADR-0002](file:///c:/Users/tatar/OneDrive/เดสก์ท็อป/dejung/docs/adr/0002-mobile-first-touch-and-pwa.md))**: Optimized for touch interactions, sticky bottom feedback, and iOS/iPadOS home screen installation.
- **React 19 + TypeScript + Vite over Next.js ([ADR-0003](file:///c:/Users/tatar/OneDrive/เดสก์ท็อป/dejung/docs/adr/0003-react-vite-vs-nextjs.md))**: Eliminates SSR hydration conflicts with LocalStorage, enables instant static hosting, and simplifies PWA configuration.

### Technical Clarifications & Data Schema
```typescript
export type AllocationRule = 'daily' | 'fixed' | 'percentage';

export interface AllocationItem {
  id: string;
  name: string;
  rule: AllocationRule;
  value: number;
  isSavings: boolean;
}

export interface BudgetState {
  totalFunds: number;
  cycleDays: number;
  items: AllocationItem[];
  savingsTarget: number;
  currentSavings: number;
}
```

### Specific Interactions
- Multi-category savings aggregation: When multiple categories have `isSavings: true`, their amounts are summed to determine the total savings rate funding the Savings Target.
- Over-allocation behavior: When total allocations exceed total funds, the unallocated balance turns negative, the Free Daily Allowance displays `0 ฿/วัน (เกินงบ)`, and the sticky bar turns red.
- Clean onboarding: Fields start empty (`totalFunds = 0`, `items = []`) with clear placeholders rather than pre-populated fake data.

## Testing Decisions

### What Makes a Good Test
- Tests must assert observable external behavior, formulas, and state outcomes, never private implementation details or internal component states.
- Domain calculation formulas must be tested with known numerical scenarios, boundary conditions, and invalid inputs (zero cycle days, negative numbers, precision rounding).
- Component tests must test user interaction (typing, clicking chips, switching modes) and check rendered outputs.

### Tested Modules & Seams
1. **Domain Engine Seam (`calculateBudget`)**:
   - Daily rate multiplication ($rate \times days$)
   - Percentage distribution ($total \times percent / 100$)
   - Fixed allocation sum
   - Unallocated balance and free daily allowance
   - Over-allocation detection and deficit reporting
   - Savings progress percentage and cycles-to-target division
   - Defensive handling for $days \le 0$ or NaN
2. **Hook & Storage Seam (`useBudgetPlanner`)**:
   - Initializing with empty state and default cycle days
   - Updating funds and cycle days
   - Adding, modifying, and deleting items
   - LocalStorage serialization and deserialization
   - Exporting and importing JSON backups
3. **Component Interaction Seam**:
   - Quick-add chip click adds category with correct default mode
   - Mode switcher changes input units and recalculates totals
   - Sticky bottom bar reveals full details on tap

## Out of Scope

- Daily transaction logging or receipt scanning (this is a planning tool, not an expense tracker).
- Multi-user authentication, cloud synchronization, or database storage.
- Bank API integration or automatic bank feeds.
- Multiple currencies or currency conversion rates (defaults to THB ฿).
- Investment portfolio tracking or interest compounding calculators.

## Further Notes

- The application uses Tailwind CSS for styling with a clean Emerald/Teal palette for financial balance and Rose/Red for over-budget warnings.
- All copywriting follows the canonical terms defined in [GLOSSARY.md](file:///c:/Users/tatar/OneDrive/เดสก์ท็อป/dejung/GLOSSARY.md).
