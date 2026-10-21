import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBudgetPlanner } from '../src/hooks/useBudgetPlanner';

describe('useBudgetPlanner Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes with clean default values', () => {
    const { result } = renderHook(() => useBudgetPlanner());
    expect(result.current.state.totalFunds).toBe(0);
    expect(result.current.state.cycleDays).toBe(30);
    expect(result.current.state.items).toEqual([]);
    expect(result.current.summary.unallocatedBalance).toBe(0);
  });

  it('updates totalFunds and cycleDays and computes summary', () => {
    const { result } = renderHook(() => useBudgetPlanner());
    act(() => {
      result.current.setTotalFunds(20000);
      result.current.setCycleDays(15);
    });

    expect(result.current.state.totalFunds).toBe(20000);
    expect(result.current.state.cycleDays).toBe(15);
    expect(result.current.summary.unallocatedBalance).toBe(20000);
    expect(result.current.summary.freeDailyAllowance).toBeCloseTo(1333.33, 1);
  });

  it('adds, updates, and removes allocation items', () => {
    const { result } = renderHook(() => useBudgetPlanner());
    act(() => {
      result.current.setTotalFunds(10000);
      result.current.addItem({
        name: 'ค่าข้าว',
        rule: 'daily',
        value: 100,
        isSavings: false,
      });
    });

    expect(result.current.state.items.length).toBe(1);
    const itemId = result.current.state.items[0].id;
    expect(result.current.summary.totalAllocated).toBe(3000); // 100 * 30 days

    act(() => {
      result.current.updateItem(itemId, { value: 150 });
    });
    expect(result.current.summary.totalAllocated).toBe(4500); // 150 * 30 days

    act(() => {
      result.current.removeItem(itemId);
    });
    expect(result.current.state.items.length).toBe(0);
    expect(result.current.summary.totalAllocated).toBe(0);
  });

  it('resets plan to defaults', () => {
    const { result } = renderHook(() => useBudgetPlanner());
    act(() => {
      result.current.setTotalFunds(50000);
      result.current.setCycleDays(7);
      result.current.resetPlan();
    });

    expect(result.current.state.totalFunds).toBe(0);
    expect(result.current.state.cycleDays).toBe(30);
  });

  it('exports and imports JSON properly', () => {
    const { result } = renderHook(() => useBudgetPlanner());
    act(() => {
      result.current.setTotalFunds(25000);
      result.current.setSavingsTarget(50000);
      result.current.setCurrentSavings(10000);
    });

    const exported = result.current.exportJSON();
    expect(exported).toContain('25000');

    act(() => {
      result.current.resetPlan();
    });
    expect(result.current.state.totalFunds).toBe(0);

    let success = false;
    act(() => {
      success = result.current.importJSON(exported);
    });
    expect(success).toBe(true);
    expect(result.current.state.totalFunds).toBe(25000);
    expect(result.current.state.savingsTarget).toBe(50000);
    expect(result.current.state.currentSavings).toBe(10000);
  });
});
