import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AllocationResultModal } from '../src/components/AllocationResultModal';
import type { AllocationItem, CalculationSummary, ItemCalculation } from '../src/domain/types';

describe('AllocationResultModal Component', () => {
  const mockItems: AllocationItem[] = [
    { id: '1', name: 'ค่าข้าว', rule: 'daily', value: 150, isSavings: false },
  ];

  const mockItemSummaries: ItemCalculation[] = [
    { id: '1', name: 'ค่าข้าว', calculatedAmount: 4500, percentageOfTotal: 18, isSavings: false },
  ];

  const mockSummary: CalculationSummary = {
    totalFunds: 25000,
    cycleDays: 30,
    totalAllocated: 4500,
    unallocatedBalance: 20500,
    freeDailyAllowance: 683.33,
    isOverAllocated: false,
    overAllocatedAmount: 0,
    totalSavingsAllocated: 0,
    savingsProgressPercent: 0,
    savingsCyclesRequired: 0,
    itemSummaries: mockItemSummaries,
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <AllocationResultModal
        isOpen={false}
        onClose={vi.fn()}
        totalFunds={25000}
        cycleDays={30}
        items={mockItems}
        itemSummaries={mockItemSummaries}
        summary={mockSummary}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders slip header, core figures, and action buttons when open', () => {
    render(
      <AllocationResultModal
        isOpen={true}
        onClose={vi.fn()}
        totalFunds={25000}
        cycleDays={30}
        items={mockItems}
        itemSummaries={mockItemSummaries}
        summary={mockSummary}
      />
    );

    expect(screen.getByText('สลิปสรุปผลการจัดสรรงบ')).toBeInTheDocument();
    expect(screen.getByText('฿25,000')).toBeInTheDocument();
    expect(screen.getByText('30 วัน')).toBeInTheDocument();
    expect(screen.getAllByText('฿4,500').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('฿683 บ./วัน')).toBeInTheDocument();
    expect(screen.getByText('฿20,500')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /บันทึกรูปสลิป/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /คัดลอกข้อความสรุป/i })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <AllocationResultModal
        isOpen={true}
        onClose={handleClose}
        totalFunds={25000}
        cycleDays={30}
        items={mockItems}
        itemSummaries={mockItemSummaries}
        summary={mockSummary}
      />
    );

    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
