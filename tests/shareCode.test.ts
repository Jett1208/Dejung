import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateShareCode,
  sanitizeShareCode,
  validateBudgetState,
  savePlanToCloud,
  loadPlanFromCloud,
  CROCKFORD_BASE32,
} from '../src/utils/shareCode';
import type { BudgetState } from '../src/domain/types';

describe('shareCode utility', () => {
  const mockBudgetState: BudgetState = {
    totalFunds: 25000,
    cycleDays: 30,
    items: [
      { id: 'item_1', name: 'ค่าข้าว', rule: 'daily', value: 150, isSavings: false },
    ],
    savingsTarget: 50000,
    currentSavings: 10000,
  };

  it('generates 6-character codes using Crockford Base32 alphabet', () => {
    for (let i = 0; i < 20; i++) {
      const code = generateShareCode();
      expect(code).toHaveLength(6);
      for (const char of code) {
        expect(CROCKFORD_BASE32).toContain(char);
      }
    }
  });

  it('sanitizes share codes (uppercases, strips illegal characters, truncates to 6)', () => {
    expect(sanitizeShareCode(' dj7k9b ')).toBe('DJ7K9B');
    expect(sanitizeShareCode('dj-7k-9b-xyz')).toBe('DJ7K9B');
    // Crockford excludes I, O, 1, 0
    expect(sanitizeShareCode('IO10A8')).toBe('A8');
  });

  describe('validateBudgetState', () => {
    it('validates a correct budget state object', () => {
      const result = validateBudgetState(mockBudgetState);
      expect(result).not.toBeNull();
      expect(result?.totalFunds).toBe(25000);
      expect(result?.cycleDays).toBe(30);
      expect(result?.items).toHaveLength(1);
    });

    it('returns null for invalid or nullish objects', () => {
      expect(validateBudgetState(null)).toBeNull();
      expect(validateBudgetState('string')).toBeNull();
      expect(validateBudgetState({ totalFunds: -10, cycleDays: 0 })).toBeNull();
    });

    it('sanitizes item fields and rules safely', () => {
      const input = {
        totalFunds: '30000',
        cycleDays: '15',
        items: [
          { name: 'กาแฟ', rule: 'unknown_rule', value: '70' },
          { name: '', rule: 'percentage', value: -5 },
        ],
      };
      const result = validateBudgetState(input);
      expect(result).not.toBeNull();
      expect(result?.totalFunds).toBe(30000);
      expect(result?.cycleDays).toBe(15);
      expect(result?.items[0].rule).toBe('fixed');
      expect(result?.items[0].value).toBe(70);
      expect(result?.items[1].rule).toBe('percentage');
      expect(result?.items[1].value).toBe(0);
    });
  });

  describe('cloud save & load', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('saves plan to cloud endpoint and returns generated 6-character code', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, code: 'DJ7K9B' }),
        text: async () => 'OK',
      });

      const res = await savePlanToCloud(mockBudgetState);
      expect(res.success).toBe(true);
      expect(res.code).toHaveLength(6);
    });

    it('loads and validates plan by 6-character code', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: mockBudgetState }),
        text: async () => JSON.stringify(mockBudgetState),
      });

      const res = await loadPlanFromCloud('DJ7K9B');
      expect(res.success).toBe(true);
      expect(res.state?.totalFunds).toBe(25000);
      expect(res.state?.items).toHaveLength(1);
    });

    it('rejects loading when code length is not 6', async () => {
      const res = await loadPlanFromCloud('ABC');
      expect(res.success).toBe(false);
      expect(res.error).toContain('6 หลัก');
    });
  });
});
