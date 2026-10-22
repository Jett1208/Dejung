import type { BudgetState, CalculationSummary, ItemCalculation } from './types';

export function calculateBudget(state: BudgetState): CalculationSummary {
  const cycleDays = Math.max(1, Number(state.cycleDays) || 1);
  const totalFunds = Math.max(0, Number(state.totalFunds) || 0);
  const savingsTarget = Math.max(0, Number(state.savingsTarget) || 0);
  const currentSavings = Math.max(0, Number(state.currentSavings) || 0);

  let totalAllocated = 0;
  let totalSavingsAllocated = 0;

  const itemSummaries: ItemCalculation[] = state.items.map((item) => {
    const rawVal = Number(item.value) || 0;
    let calculatedAmount: number;

    switch (item.rule) {
      case 'daily':
        calculatedAmount = rawVal * cycleDays;
        break;
      case 'fixed':
        calculatedAmount = rawVal;
        break;
      case 'percentage':
        calculatedAmount = (totalFunds * rawVal) / 100;
        break;
      default:
        calculatedAmount = 0;
    }

    // Round to 2 decimal places to avoid float precision issues
    calculatedAmount = Math.round(calculatedAmount * 100) / 100;
    totalAllocated += calculatedAmount;

    if (item.isSavings) {
      totalSavingsAllocated += calculatedAmount;
    }

    const percentageOfTotal = totalFunds > 0 
      ? Math.round((calculatedAmount / totalFunds) * 10000) / 100 
      : 0;

    return {
      id: item.id,
      calculatedAmount,
      percentageOfTotal,
    };
  });

  totalAllocated = Math.round(totalAllocated * 100) / 100;
  totalSavingsAllocated = Math.round(totalSavingsAllocated * 100) / 100;
  const unallocatedBalance = Math.round((totalFunds - totalAllocated) * 100) / 100;
  const isOverAllocated = totalFunds > 0 && unallocatedBalance < 0;
  const overAllocatedAmount = isOverAllocated ? Math.abs(unallocatedBalance) : 0;

  const freeDailyAllowance = unallocatedBalance > 0
    ? Math.round((unallocatedBalance / cycleDays) * 100) / 100
    : 0;

  const savingsProgressPercent = savingsTarget > 0
    ? Math.min(100, Math.round((currentSavings / savingsTarget) * 10000) / 100)
    : 0;

  const remainingToGoal = Math.max(0, savingsTarget - currentSavings);
  const savingsCyclesRequired = (totalSavingsAllocated > 0 && remainingToGoal > 0)
    ? Math.ceil(remainingToGoal / totalSavingsAllocated)
    : 0;

  return {
    totalFunds,
    cycleDays,
    totalAllocated,
    unallocatedBalance,
    freeDailyAllowance,
    isOverAllocated,
    overAllocatedAmount,
    totalSavingsAllocated,
    savingsProgressPercent,
    savingsCyclesRequired,
    itemSummaries,
  };
}
