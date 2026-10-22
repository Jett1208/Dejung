/**
 * Formats a number compactly:
 * - < 100,000: standard comma-separated format e.g. "25,000", "99,999"
 * - >= 100,000 and < 1,000,000: "100k", "250.5k" (omits trailing .0)
 * - >= 1,000,000: "1M", "2.5M" (omits trailing .0)
 * - Negative numbers retain minus sign: "-100k", "-1.5M"
 */
export function formatCompactNumber(value: number): string {
  if (value === 0 || !Number.isFinite(value)) return '0';

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs < 100_000) {
    return `${sign}${Math.round(abs).toLocaleString('en-US')}`;
  }

  if (abs < 1_000_000) {
    const kVal = abs / 1_000;
    const formatted = (kVal % 1 === 0 ? kVal.toFixed(0) : kVal.toFixed(1)).replace(/\.0$/, '');
    return `${sign}${formatted}k`;
  }

  const mVal = abs / 1_000_000;
  const formatted = (mVal % 1 === 0 ? mVal.toFixed(0) : mVal.toFixed(1)).replace(/\.0$/, '');
  return `${sign}${formatted}M`;
}

/**
 * Returns formatted full Thai currency string for tooltips / titles e.g. "฿100,000 บาท"
 */
export function formatFullCurrency(value: number): string {
  if (!Number.isFinite(value)) return '฿0 บาท';
  const sign = value < 0 ? '-' : '';
  return `${sign}฿${Math.abs(Math.round(value)).toLocaleString('en-US')} บาท`;
}
