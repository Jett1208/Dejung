import { describe, it, expect } from 'vitest';
import { generateSummaryText, downloadSlipImage } from '../src/utils/slipGenerator';
import type { AllocationItem, CalculationSummary, ItemCalculation } from '../src/domain/types';

describe('slipGenerator utils', () => {
  const mockItems: AllocationItem[] = [
    { id: '1', name: 'ค่าข้าว', rule: 'daily', value: 150, isSavings: false },
    { id: '2', name: 'เงินออม', rule: 'percentage', value: 20, isSavings: true },
  ];

  const mockItemSummaries: ItemCalculation[] = [
    { id: '1', name: 'ค่าข้าว', calculatedAmount: 4500, percentageOfTotal: 18, isSavings: false },
    { id: '2', name: 'เงินออม', calculatedAmount: 5000, percentageOfTotal: 20, isSavings: true },
  ];

  const mockSummary: CalculationSummary = {
    totalFunds: 25000,
    cycleDays: 30,
    totalAllocated: 9500,
    unallocatedBalance: 15500,
    freeDailyAllowance: 516.66,
    isOverAllocated: false,
    overAllocatedAmount: 0,
    totalSavingsAllocated: 5000,
    savingsProgressPercent: 10,
    savingsCyclesRequired: 9,
    itemSummaries: mockItemSummaries,
  };

  it('generates friendly Thai summary text with all core figures', () => {
    const text = generateSummaryText({
      totalFunds: 25000,
      cycleDays: 30,
      items: mockItems,
      itemSummaries: mockItemSummaries,
      summary: mockSummary,
      savingsTarget: 50000,
      currentSavings: 5000,
    });

    expect(text).toContain('สรุปแผนจัดสรรงบประมาณ — Dejung');
    expect(text).toContain('รอบเวลา: 30 วัน');
    expect(text).toContain('เงินก้อนตั้งต้น: ฿25,000 บาท');
    expect(text).toContain('ยอดแบ่งจ่ายทั้งหมด: ฿9,500 บาท');
    expect(text).toContain('ค่าข้าว: ฿4,500 (150 บ./วัน)');
    expect(text).toContain('เงินออม: ฿5,000 (20%) [เงินออม]');
    expect(text).toContain('เงินกินใช้อิสระต่อวัน: ฿517 บ./วัน');
    expect(text).toContain('เงินคงเหลือติดกระเป๋า: ฿15,500 บาท');
    expect(text).toContain('เป้าหมายเงินออม: ฿50,000');
    expect(text).toContain('สร้างด้วย Dejung — วางแผนการเงินอย่างสบายใจ');
    expect(text).not.toContain('ผู้ช่วยจัดสรรงบประมาณ');
  });

  it('handles over-allocation in text summary', () => {
    const overSummary: CalculationSummary = {
      ...mockSummary,
      totalAllocated: 30000,
      unallocatedBalance: -5000,
      freeDailyAllowance: 0,
      isOverAllocated: true,
      overAllocatedAmount: 5000,
    };

    const text = generateSummaryText({
      totalFunds: 25000,
      cycleDays: 30,
      items: mockItems,
      itemSummaries: mockItemSummaries,
      summary: overSummary,
    });

    expect(text).toContain('⚠️ งบเกิน: ฿5,000 บาท');
    expect(text).toContain('💡 คำแนะนำ: ปรับลดรายการค่าใช้จ่ายเพื่อรักษาสมดุล');
  });

  it('downloadSlipImage runs safely in test environment', async () => {
    // In headless jsdom, canvas getContext might be dummy, should return without throwing
    const result = await downloadSlipImage({
      totalFunds: 25000,
      cycleDays: 30,
      items: mockItems,
      itemSummaries: mockItemSummaries,
      summary: mockSummary,
    });

    // In jsdom without canvas native package, getContext('2d') returns null or mock
    expect(typeof result).toBe('boolean');
  });
});
