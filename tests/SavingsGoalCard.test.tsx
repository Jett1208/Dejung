import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SavingsGoalCard } from '../src/components/SavingsGoalCard';

describe('SavingsGoalCard Component', () => {
  it('renders inputs, progress percent, and forecast text', () => {
    render(
      <SavingsGoalCard
        savingsTarget={60000}
        currentSavings={10000}
        totalSavingsAllocated={5000}
        savingsProgressPercent={16.67}
        savingsCyclesRequired={10}
        onSavingsTargetChange={vi.fn()}
        onCurrentSavingsChange={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText('เช่น 50,000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('เช่น 20,000 (ถ้ามี)')).toBeInTheDocument();
    expect(screen.getByText(/16.67%/i)).toBeInTheDocument();
    expect(screen.getByText(/จะถึงเป้าหมายในอีก 10 รอบ/i)).toBeInTheDocument();
  });

  it('triggers onSavingsTargetChange when changing target', () => {
    const handleTargetChange = vi.fn();
    render(
      <SavingsGoalCard
        savingsTarget={0}
        currentSavings={0}
        totalSavingsAllocated={0}
        savingsProgressPercent={0}
        savingsCyclesRequired={0}
        onSavingsTargetChange={handleTargetChange}
        onCurrentSavingsChange={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('เช่น 50,000');
    fireEvent.change(input, { target: { value: '80000' } });
    expect(handleTargetChange).toHaveBeenCalledWith(80000);
  });
});
