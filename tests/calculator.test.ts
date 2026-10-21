import { describe, it, expect } from 'vitest';
import { calculateBudget } from '../src/domain/calculator';
import { BudgetState } from '../src/domain/types';

describe('Domain Calculator Engine (calculateBudget)', () => {
  it('calculates daily rate expenses correctly across cycle days', () => {
    const state: BudgetState = {
      totalFunds: 25000,
      cycleDays: 30,
      items: [
        { id: '1', name: 'ค่าข้าว', rule: 'daily', value: 150, isSavings: false },
      ],
      savingsTarget: 0,
      currentSavings: 0,
    };

    const summary = calculateBudget(state);
    // 150 * 30 = 4,500
    expect(summary.totalAllocated).toBe(4500);
    // 25,000 - 4,500 = 20,500
    expect(summary.unallocatedBalance).toBe(20500);
    // 20,500 / 30 = 683.33...
    expect(Math.round(summary.freeDailyAllowance)).toBe(683);
    expect(summary.isOverAllocated).toBe(false);
    expect(summary.itemSummaries[0].calculatedAmount).toBe(4500);
    expect(summary.itemSummaries[0].percentageOfTotal).toBe(18); // 4500 / 25000 = 18%
  });

  it('calculates fixed amount and percentage rules together', () => {
    const state: BudgetState = {
      totalFunds: 30000,
      cycleDays: 30,
      items: [
        { id: '1', name: 'ค่าน้ำมัน', rule: 'fixed', value: 2000, isSavings: false },
        { id: '2', name: 'เงินออม', rule: 'percentage', value: 20, isSavings: true },
      ],
      savingsTarget: 60000,
      currentSavings: 10000,
    };

    const summary = calculateBudget(state);
    // Fuel: 2000, Savings: 20% of 30,000 = 6,000 => Total = 8,000
    expect(summary.totalAllocated).toBe(8000);
    expect(summary.unallocatedBalance).toBe(22000);
    expect(summary.totalSavingsAllocated).toBe(6000);

    // Savings Goal: Target 60,000, Current 10,000 (16.67% of target), Remaining 50,000
    // Cycles needed: ceil(50,000 / 6,000) = 9 cycles
    expect(summary.savingsProgressPercent).toBeCloseTo(16.67, 1);
    expect(summary.savingsCyclesRequired).toBe(9);
  });

  it('detects over-allocation and sets free daily allowance to 0 with warning', () => {
    const state: BudgetState = {
      totalFunds: 10000,
      cycleDays: 30,
      items: [
        { id: '1', name: 'ค่าเช่า', rule: 'fixed', value: 12000, isSavings: false },
      ],
      savingsTarget: 0,
      currentSavings: 0,
    };

    const summary = calculateBudget(state);
    expect(summary.isOverAllocated).toBe(true);
    expect(summary.unallocatedBalance).toBe(-2000);
    expect(summary.overAllocatedAmount).toBe(2000);
    expect(summary.freeDailyAllowance).toBe(0);
  });

  it('guards safely against zero or negative cycle days', () => {
    const state: BudgetState = {
      totalFunds: 10000,
      cycleDays: 0, // invalid zero
      items: [
        { id: '1', name: 'ค่าขนม', rule: 'daily', value: 100, isSavings: false },
      ],
      savingsTarget: 0,
      currentSavings: 0,
    };

    const summary = calculateBudget(state);
    expect(summary.cycleDays).toBe(1); // falls back to minimum 1 day
    expect(Number.isFinite(summary.freeDailyAllowance)).toBe(true);
  });

  it('handles empty state gracefully without crashing', () => {
    const state: BudgetState = {
      totalFunds: 0,
      cycleDays: 30,
      items: [],
      savingsTarget: 0,
      currentSavings: 0,
    };

    const summary = calculateBudget(state);
    expect(summary.totalAllocated).toBe(0);
    expect(summary.unallocatedBalance).toBe(0);
    expect(summary.freeDailyAllowance).toBe(0);
    expect(summary.isOverAllocated).toBe(false);
    expect(summary.savingsCyclesRequired).toBe(0);
  });
});
