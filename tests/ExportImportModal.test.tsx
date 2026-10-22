import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ExportImportModal } from '../src/components/ExportImportModal';
import type { BudgetState } from '../src/domain/types';

describe('ExportImportModal Component', () => {
  const mockState: BudgetState = {
    totalFunds: 25000,
    cycleDays: 30,
    items: [],
    savingsTarget: 0,
    currentSavings: 0,
  };

  it('renders tabs and defaults to 6-character code mode', () => {
    render(
      <ExportImportModal
        isOpen={true}
        onClose={vi.fn()}
        exportJSON={() => JSON.stringify(mockState)}
        importJSON={vi.fn()}
        budgetState={mockState}
        onApplyPlan={vi.fn()}
      />
    );

    expect(screen.getByText('รหัสแชร์ 6 หลัก (ด่วน)')).toBeInTheDocument();
    expect(screen.getByText('ไฟล์ JSON (ถาวร)')).toBeInTheDocument();
    expect(screen.getByText('กดสร้างรหัสแผน 6 หลัก (Quick Code)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('เช่น DJ7K9B')).toBeInTheDocument();
  });

  it('switches to JSON tab when clicked', () => {
    render(
      <ExportImportModal
        isOpen={true}
        onClose={vi.fn()}
        exportJSON={() => JSON.stringify(mockState)}
        importJSON={vi.fn()}
        budgetState={mockState}
        onApplyPlan={vi.fn()}
      />
    );

    const jsonTab = screen.getByText('ไฟล์ JSON (ถาวร)');
    fireEvent.click(jsonTab);

    expect(screen.getByText('ส่งออกไฟล์สำรอง .json')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('วางโค้ด JSON ที่นี่...')).toBeInTheDocument();
  });
});
