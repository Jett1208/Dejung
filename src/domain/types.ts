export type AllocationRule = 'daily' | 'fixed' | 'percentage';

export interface AllocationItem {
  id: string;
  name: string;
  rule: AllocationRule;
  value: number; // rate per day, fixed amount, or percentage number
  isSavings: boolean;
  selectedDays?: boolean[]; // 28-slot array (4 weeks, Mon-Sun) for daily rule calendar selection
}

export interface BudgetState {
  totalFunds: number;
  cycleDays: number;
  items: AllocationItem[];
  savingsTarget: number;
  currentSavings: number;
}

export interface ItemCalculation {
  id: string;
  calculatedAmount: number;
  percentageOfTotal: number;
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
  itemSummaries: ItemCalculation[];
}
