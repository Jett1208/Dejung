import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CategoryList } from '../src/components/CategoryList';
import { AllocationItem, ItemCalculation } from '../src/domain/types';

describe('CategoryList & QuickAddChips Components', () => {
  const sampleItems: AllocationItem[] = [
    { id: '1', name: 'ค่าข้าวประจำวัน', rule: 'daily', value: 150, isSavings: false },
    { id: '2', name: 'เงินออมฉุกเฉิน', rule: 'percentage', value: 20, isSavings: true },
  ];

  const sampleSummaries: ItemCalculation[] = [
    { id: '1', calculatedAmount: 4500, percentageOfTotal: 18 },
    { id: '2', calculatedAmount: 5000, percentageOfTotal: 20 },
  ];

  it('renders quick-add chips and category items', () => {
    render(
      <CategoryList
        items={sampleItems}
        itemSummaries={sampleSummaries}
        cycleDays={30}
        totalFunds={25000}
        onAddItem={vi.fn()}
        onUpdateItem={vi.fn()}
        onRemoveItem={vi.fn()}
      />
    );

    expect(screen.getByDisplayValue('ค่าข้าวประจำวัน')).toBeInTheDocument();
    expect(screen.getByDisplayValue('เงินออมฉุกเฉิน')).toBeInTheDocument();
    expect(screen.getByText(/4,500/i)).toBeInTheDocument();
  });

  it('triggers onAddItem when clicking a quick-add chip', () => {
    const handleAdd = vi.fn();
    render(
      <CategoryList
        items={[]}
        itemSummaries={[]}
        cycleDays={30}
        totalFunds={25000}
        onAddItem={handleAdd}
        onUpdateItem={vi.fn()}
        onRemoveItem={vi.fn()}
      />
    );

    const foodChipButton = screen.getByRole('button', { name: /ค่าข้าว/i });
    fireEvent.click(foodChipButton);
    expect(handleAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'ค่าข้าว',
        rule: 'daily',
      })
    );
  });

  it('triggers onRemoveItem when clicking delete button', () => {
    const handleRemove = vi.fn();
    render(
      <CategoryList
        items={sampleItems}
        itemSummaries={sampleSummaries}
        cycleDays={30}
        totalFunds={25000}
        onAddItem={vi.fn()}
        onUpdateItem={vi.fn()}
        onRemoveItem={handleRemove}
      />
    );

    const deleteButtons = screen.getAllByTitle(/ลบรายการนี้/i);
    fireEvent.click(deleteButtons[0]);
    expect(handleRemove).toHaveBeenCalledWith('1');
  });

  it('triggers onAddItem when clicking the direct header "+ เพิ่ม" button', () => {
    const handleAdd = vi.fn();
    render(
      <CategoryList
        items={sampleItems}
        itemSummaries={sampleSummaries}
        cycleDays={30}
        totalFunds={25000}
        onAddItem={handleAdd}
        onUpdateItem={vi.fn()}
        onRemoveItem={vi.fn()}
      />
    );

    const headerAddBtn = screen.getByRole('button', { name: /เพิ่ม$/i });
    fireEvent.click(headerAddBtn);
    expect(handleAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'รายการใหม่',
        rule: 'daily',
        value: 0,
      })
    );
  });

  it('renders "เลือกวัน" button for daily items and toggles calendar grid accordion', () => {
    const handleUpdate = vi.fn();
    render(
      <CategoryList
        items={sampleItems}
        itemSummaries={sampleSummaries}
        cycleDays={30}
        totalFunds={25000}
        onAddItem={vi.fn()}
        onUpdateItem={handleUpdate}
        onRemoveItem={vi.fn()}
      />
    );

    // Only 1 daily item ('ค่าข้าวประจำวัน') so there should be 1 'เลือกวัน' button
    const calendarBtns = screen.getAllByRole('button', { name: /เลือกวัน/i });
    expect(calendarBtns.length).toBe(1);

    // Click 'เลือกวัน'
    fireEvent.click(calendarBtns[0]);

    // Accordion opens, showing day headers 'จ', 'อ', 'พ', etc.
    expect(screen.getByText('จ')).toBeInTheDocument();
    expect(screen.getByText('อา')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /จ-ศ/i })).toBeInTheDocument();
  });
});
