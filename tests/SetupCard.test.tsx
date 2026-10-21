import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SetupCard } from '../src/components/SetupCard';

describe('SetupCard Component', () => {
  it('renders step titles and clean placeholders', () => {
    render(
      <SetupCard
        totalFunds={0}
        cycleDays={30}
        onTotalFundsChange={vi.fn()}
        onCycleDaysChange={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText('เช่น 25,000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('เช่น 30')).toBeInTheDocument();
  });

  it('triggers onTotalFundsChange when typing in total funds', () => {
    const handleFundsChange = vi.fn();
    render(
      <SetupCard
        totalFunds={0}
        cycleDays={30}
        onTotalFundsChange={handleFundsChange}
        onCycleDaysChange={vi.fn()}
      />
    );

    const fundsInput = screen.getByPlaceholderText('เช่น 25,000');
    fireEvent.change(fundsInput, { target: { value: '30000' } });
    expect(handleFundsChange).toHaveBeenCalledWith(30000);
  });

  it('triggers onCycleDaysChange when clicking quick day preset buttons', () => {
    const handleDaysChange = vi.fn();
    render(
      <SetupCard
        totalFunds={20000}
        cycleDays={30}
        onTotalFundsChange={vi.fn()}
        onCycleDaysChange={handleDaysChange}
      />
    );

    const button15 = screen.getByRole('button', { name: /15 วัน/i });
    fireEvent.click(button15);
    expect(handleDaysChange).toHaveBeenCalledWith(15);
  });
});
