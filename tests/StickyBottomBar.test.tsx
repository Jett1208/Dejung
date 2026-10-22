import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { StickyBottomBar } from '../src/components/StickyBottomBar';
import { CalculationSummary, AllocationItem } from '../src/domain/types';

describe('StickyBottomBar Component', () => {
  const mockSummary: CalculationSummary = {
    totalFunds: 25000,
    cycleDays: 30,
    totalAllocated: 5000,
    unallocatedBalance: 20000,
    freeDailyAllowance: 666.67,
    isOverAllocated: false,
    overAllocatedAmount: 0,
    totalSavingsAllocated: 5000,
    savingsProgressPercent: 10,
    savingsCyclesRequired: 9,
    itemSummaries: [],
  };

  const mockItems: AllocationItem[] = [];

  it('renders summary balance and opens drawer when tapping anywhere on the bar', () => {
    render(<StickyBottomBar summary={mockSummary} items={mockItems} />);

    expect(screen.getByText(/20,000/i)).toBeInTheDocument();

    // Drawer is closed initially
    expect(screen.queryByText('สรุปภาพรวมงบประมาณ')).not.toBeInTheDocument();

    // Tap on the bar text / container
    const balanceText = screen.getByText(/20,000/i);
    fireEvent.click(balanceText);

    // Drawer is now open!
    expect(screen.getByText('สรุปภาพรวมงบประมาณ')).toBeInTheDocument();
    const drawerContainer = screen.getByText('สรุปภาพรวมงบประมาณ').closest('.glass-panel');
    expect(drawerContainer?.className).toContain('animate-drawer-slide-up');
  });

  it('displays red warning state and 0 ฿/วัน (เกินงบ) when over budget', () => {
    const overSummary: CalculationSummary = {
      ...mockSummary,
      unallocatedBalance: -2000,
      isOverAllocated: true,
      overAllocatedAmount: 2000,
      freeDailyAllowance: 0,
    };

    render(<StickyBottomBar summary={overSummary} items={mockItems} />);

    expect(screen.getByText(/งบเกิน/i)).toBeInTheDocument();
    expect(screen.getByText(/0 ฿\/วัน \(เกินงบ\)/i)).toBeInTheDocument();
  });
});
