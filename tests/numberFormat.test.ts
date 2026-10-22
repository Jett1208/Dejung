import { describe, it, expect } from 'vitest';
import { formatCompactNumber, formatFullCurrency } from '../src/utils/numberFormat';

describe('formatCompactNumber', () => {
  it('returns "0" for 0, NaN, or non-finite values', () => {
    expect(formatCompactNumber(0)).toBe('0');
    expect(formatCompactNumber(NaN)).toBe('0');
    expect(formatCompactNumber(Infinity)).toBe('0');
  });

  it('formats values strictly below 100,000 with standard commas', () => {
    expect(formatCompactNumber(45)).toBe('45');
    expect(formatCompactNumber(500)).toBe('500');
    expect(formatCompactNumber(1250)).toBe('1,250');
    expect(formatCompactNumber(25000)).toBe('25,000');
    expect(formatCompactNumber(99999)).toBe('99,999');
  });

  it('abbreviates values between 100,000 and 999,999 to "k"', () => {
    expect(formatCompactNumber(100000)).toBe('100k');
    expect(formatCompactNumber(150000)).toBe('150k');
    expect(formatCompactNumber(250500)).toBe('250.5k');
    expect(formatCompactNumber(999000)).toBe('999k');
  });

  it('abbreviates values of 1,000,000 and above to "M"', () => {
    expect(formatCompactNumber(1000000)).toBe('1M');
    expect(formatCompactNumber(1500000)).toBe('1.5M');
    expect(formatCompactNumber(25000000)).toBe('25M');
  });

  it('properly preserves negative signs', () => {
    expect(formatCompactNumber(-5000)).toBe('-5,000');
    expect(formatCompactNumber(-100000)).toBe('-100k');
    expect(formatCompactNumber(-2500000)).toBe('-2.5M');
  });
});

describe('formatFullCurrency', () => {
  it('formats positive and negative full Thai currency with ฿ and บาท', () => {
    expect(formatFullCurrency(0)).toBe('฿0 บาท');
    expect(formatFullCurrency(25000)).toBe('฿25,000 บาท');
    expect(formatFullCurrency(100000)).toBe('฿100,000 บาท');
    expect(formatFullCurrency(-50000)).toBe('-฿50,000 บาท');
    expect(formatFullCurrency(NaN)).toBe('฿0 บาท');
  });
});
