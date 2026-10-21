import { useState, useEffect, useMemo, useCallback } from 'react';
import { BudgetState, AllocationItem, CalculationSummary } from '../domain/types';
import { calculateBudget } from '../domain/calculator';

const STORAGE_KEY = 'dejung_budget_state_v1';

export const DEFAULT_BUDGET_STATE: BudgetState = {
  totalFunds: 0,
  cycleDays: 30,
  items: [],
  savingsTarget: 0,
  currentSavings: 0,
};

export function useBudgetPlanner() {
  const [state, setState] = useState<BudgetState>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (typeof parsed === 'object' && parsed !== null) {
            return {
              totalFunds: Number(parsed.totalFunds) || 0,
              cycleDays: Number(parsed.cycleDays) || 30,
              items: Array.isArray(parsed.items) ? parsed.items : [],
              savingsTarget: Number(parsed.savingsTarget) || 0,
              currentSavings: Number(parsed.currentSavings) || 0,
            };
          }
        }
      }
    } catch (e) {
      console.warn('Failed to read budget state from localStorage', e);
    }
    return DEFAULT_BUDGET_STATE;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (e) {
      console.warn('Failed to save budget state to localStorage', e);
    }
  }, [state]);

  const summary: CalculationSummary = useMemo(() => {
    return calculateBudget(state);
  }, [state]);

  const setTotalFunds = useCallback((totalFunds: number) => {
    setState((prev) => ({ ...prev, totalFunds: Math.max(0, totalFunds) }));
  }, []);

  const setCycleDays = useCallback((cycleDays: number) => {
    setState((prev) => ({ ...prev, cycleDays: Math.max(1, cycleDays) }));
  }, []);

  const addItem = useCallback((item: Omit<AllocationItem, 'id'>) => {
    const newItem: AllocationItem = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    setState((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<AllocationItem>) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const setSavingsTarget = useCallback((savingsTarget: number) => {
    setState((prev) => ({ ...prev, savingsTarget: Math.max(0, savingsTarget) }));
  }, []);

  const setCurrentSavings = useCallback((currentSavings: number) => {
    setState((prev) => ({ ...prev, currentSavings: Math.max(0, currentSavings) }));
  }, []);

  const resetPlan = useCallback(() => {
    setState(DEFAULT_BUDGET_STATE);
  }, []);

  const exportJSON = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importJSON = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed !== 'object' || parsed === null) return false;

      const validated: BudgetState = {
        totalFunds: Math.max(0, Number(parsed.totalFunds) || 0),
        cycleDays: Math.max(1, Number(parsed.cycleDays) || 30),
        items: Array.isArray(parsed.items)
          ? parsed.items.map((it: any) => ({
              id: it.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              name: String(it.name || ''),
              rule: (['daily', 'fixed', 'percentage'].includes(it.rule) ? it.rule : 'fixed') as any,
              value: Number(it.value) || 0,
              isSavings: Boolean(it.isSavings),
            }))
          : [],
        savingsTarget: Math.max(0, Number(parsed.savingsTarget) || 0),
        currentSavings: Math.max(0, Number(parsed.currentSavings) || 0),
      };

      setState(validated);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    state,
    summary,
    setTotalFunds,
    setCycleDays,
    addItem,
    updateItem,
    removeItem,
    setSavingsTarget,
    setCurrentSavings,
    resetPlan,
    exportJSON,
    importJSON,
  };
}
