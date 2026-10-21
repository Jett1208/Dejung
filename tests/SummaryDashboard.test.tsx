import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SummaryDashboard } from '../src/components/SummaryDashboard';
import { CalculationSummary, AllocationItem } from '../src/domain/types';

describe('SummaryDashboard Component', () => {
  const mockSummary: CalculationSummary = {
    totalFunds: 30000,
    cycleDays: 30,
    totalAllocated: 10000,
    unallocatedBalance: 20000,
    freeDailyAllowance: 666.67,
    isOverAllocated: false,
    overAllocatedAmount: 0,
    totalSavingsAllocated: 5000,
    savingsProgressPercent: 50,
    savingsCyclesRequired: 5,
    itemSummaries: [
      { id: '1', calculatedAmount: 10000, percentageOfTotal: 33.33 },
    ],
  };

  const mockItems: AllocationItem[] = [
    { id: '1', name: 'ค่าเช่าห้อง', rule: 'fixed', value: 10000, isSavings: false },
  ];

  it('renders unallocated balance, free daily allowance, and total funds', () => {
    render(<SummaryDashboard summary={mockSummary} items={mockItems} />);

    const balanceMatches = screen.getAllByText(/20,000/i);
    expect(balanceMatches.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/667 บ.\/วัน/i)).toBeInTheDocument();
  });

  it('renders over-allocation alert when budget is exceeded', () => {
    const overSummary: CalculationSummary = {
      ...mockSummary,
      unallocatedBalance: -5000,
      isOverAllocated: true,
      overAllocatedAmount: 5000,
      freeDailyAllowance: 0,
    };

    render(<SummaryDashboard summary={overSummary} items={mockItems} />);

    expect(screen.getByText(/จัดสรรเงินเกินงบไป ฿5,000 บาท/i)).toBeInTheDocument();
    expect(screen.getByText(/0 ฿\/วัน \(เกินงบ\)/i)).toBeInTheDocument();
  });
});
