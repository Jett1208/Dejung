import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ImportPreviewModal } from '../src/components/ImportPreviewModal';
import type { BudgetState } from '../src/domain/types';

describe('ImportPreviewModal Component', () => {
  const mockPlan: BudgetState = {
    totalFunds: 35000,
    cycleDays: 30,
    items: [
      { id: '1', name: 'ค่าเช่าห้อง', rule: 'fixed', value: 8000, isSavings: false },
      { id: '2', name: 'ค่าเดินทาง', rule: 'daily', value: 100, isSavings: false },
    ],
    savingsTarget: 100000,
    currentSavings: 20000,
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ImportPreviewModal
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        plan={mockPlan}
        code="DJ7K9B"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders plan summary stats, code, and item list when open', () => {
    render(
      <ImportPreviewModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        plan={mockPlan}
        code="DJ7K9B"
      />
    );

    expect(screen.getByText('พรีวิวก่อนนำเข้าแผน')).toBeInTheDocument();
    expect(screen.getByText('DJ7K9B')).toBeInTheDocument();
    expect(screen.getByText('฿35,000')).toBeInTheDocument();
    expect(screen.getByText('30 วัน')).toBeInTheDocument();
    expect(screen.getByText('ค่าเช่าห้อง')).toBeInTheDocument();
    expect(screen.getByText('ค่าเดินทาง')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ยืนยันนำเข้าแผนนี้/i })).toBeInTheDocument();
  });

  it('triggers onConfirm with the plan when confirm button is clicked', () => {
    const handleConfirm = vi.fn();
    render(
      <ImportPreviewModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={handleConfirm}
        plan={mockPlan}
        code="DJ7K9B"
      />
    );

    const confirmBtn = screen.getByRole('button', { name: /ยืนยันนำเข้าแผนนี้/i });
    fireEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledWith(mockPlan);
  });
});
