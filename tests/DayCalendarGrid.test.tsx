import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DayCalendarGrid } from '../src/components/DayCalendarGrid';

describe('DayCalendarGrid Component', () => {
  const allTrueDays = new Array<boolean>(28).fill(true);
  const allFalseDays = new Array<boolean>(28).fill(false);

  it('renders day headers, week labels, and 28 day cells', () => {
    const handleChange = vi.fn();
    render(<DayCalendarGrid selectedDays={allTrueDays} onChange={handleChange} />);

    // Headers
    expect(screen.getByText('จ')).toBeInTheDocument();
    expect(screen.getByText('อา')).toBeInTheDocument();

    // Week labels
    expect(screen.getByText('ส.1')).toBeInTheDocument();
    expect(screen.getByText('ส.4')).toBeInTheDocument();

    // Summary badge shows 28/28
    expect(screen.getByTestId('selected-days-count')).toHaveTextContent('28');
    expect(screen.getByTestId('selected-days-summary')).toHaveTextContent('/28 วัน');

    // Buttons: 28 day cells + 4 shortcut buttons
    const dayCells = screen.getAllByRole('button').filter((btn) => btn.hasAttribute('data-day-index'));
    expect(dayCells.length).toBe(28);
  });

  it('displays accurate selected count when some days are off', () => {
    const twentyDays = new Array<boolean>(28).fill(false);
    for (let i = 0; i < 20; i++) twentyDays[i] = true;

    render(<DayCalendarGrid selectedDays={twentyDays} onChange={vi.fn()} />);

    expect(screen.getByTestId('selected-days-count')).toHaveTextContent('20');
    expect(screen.getByTestId('selected-days-summary')).toHaveTextContent('20/28 วัน');
  });

  it('toggles an individual day when pointer down occurs on a cell', () => {
    const handleChange = vi.fn();
    render(<DayCalendarGrid selectedDays={allTrueDays} onChange={handleChange} />);

    const dayCells = screen.getAllByRole('button').filter((btn) => btn.hasAttribute('data-day-index'));
    // Cell 0 is currently true, so pointerDown should toggle it to false
    fireEvent.pointerDown(dayCells[0]);

    expect(handleChange).toHaveBeenCalled();
    const emitted = handleChange.mock.calls[0][0];
    expect(emitted[0]).toBe(false);
    expect(emitted[1]).toBe(true);
  });

  it('selects weekdays (จ-ศ) when clicking the จ-ศ shortcut', () => {
    const handleChange = vi.fn();
    render(<DayCalendarGrid selectedDays={allFalseDays} onChange={handleChange} />);

    const weekdayBtn = screen.getByRole('button', { name: /จ-ศ/i });
    fireEvent.click(weekdayBtn);

    expect(handleChange).toHaveBeenCalled();
    const emitted = handleChange.mock.calls[0][0];
    // Mon-Fri of week 1 (0..4) should be true, Sat-Sun (5, 6) should be false
    expect(emitted[0]).toBe(true);
    expect(emitted[4]).toBe(true);
    expect(emitted[5]).toBe(false);
    expect(emitted[6]).toBe(false);
    // Count should be 20
    expect(emitted.filter(Boolean).length).toBe(20);
  });

  it('selects weekends (ส-อา) when clicking the ส-อา shortcut', () => {
    const handleChange = vi.fn();
    render(<DayCalendarGrid selectedDays={allFalseDays} onChange={handleChange} />);

    const weekendBtn = screen.getByRole('button', { name: /ส-อา/i });
    fireEvent.click(weekendBtn);

    expect(handleChange).toHaveBeenCalled();
    const emitted = handleChange.mock.calls[0][0];
    expect(emitted[0]).toBe(false);
    expect(emitted[5]).toBe(true);
    expect(emitted[6]).toBe(true);
    expect(emitted.filter(Boolean).length).toBe(8);
  });

  it('selects all 28 days when clicking the ทุกวัน shortcut', () => {
    const handleChange = vi.fn();
    render(<DayCalendarGrid selectedDays={allFalseDays} onChange={handleChange} />);

    const allBtn = screen.getByRole('button', { name: /ทุกวัน/i });
    fireEvent.click(allBtn);

    expect(handleChange).toHaveBeenCalled();
    const emitted = handleChange.mock.calls[0][0];
    expect(emitted.every(Boolean)).toBe(true);
  });

  it('clears all days when clicking the ล้างทั้งหมด shortcut', () => {
    const handleChange = vi.fn();
    render(<DayCalendarGrid selectedDays={allTrueDays} onChange={handleChange} />);

    const clearBtn = screen.getByRole('button', { name: /ล้างทั้งหมด/i });
    fireEvent.click(clearBtn);

    expect(handleChange).toHaveBeenCalled();
    const emitted = handleChange.mock.calls[0][0];
    expect(emitted.every((v: boolean) => !v)).toBe(true);
  });
});
