import React, { useState } from 'react';
import { formatCompactNumber, formatFullCurrency } from '../utils/numberFormat';

interface CompactNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  unit?: string;
  min?: number;
  max?: number;
  'aria-label'?: string;
}

export const CompactNumberInput: React.FC<CompactNumberInputProps> = ({
  value,
  onChange,
  placeholder = '0',
  className = '',
  unit,
  min,
  max,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [draftValue, setDraftValue] = useState(value === 0 ? '' : value.toString());

  // While typing/focused: show real raw digits (e.g. 100000)
  // When blurred: show compact formatted text (e.g. 100k or 25,000)
  const displayValue = isFocused
    ? draftValue
    : value === 0
    ? ''
    : formatCompactNumber(value);

  const handleFocus = () => {
    setIsFocused(true);
    setDraftValue(value === 0 ? '' : value.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
    let parsed = draftValue.trim() === '' ? 0 : Number(draftValue);
    if (isNaN(parsed)) parsed = 0;
    if (min !== undefined && parsed < min) parsed = min;
    if (max !== undefined && parsed > max) parsed = max;
    onChange(parsed);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow digits and optional decimal point
    if (/^[0-9]*\.?[0-9]*$/.test(val) || val === '') {
      setDraftValue(val);
      const parsed = val === '' ? 0 : Number(val);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
        title={value > 0 ? formatFullCurrency(value) : undefined}
        className={className}
        {...props}
      />
      {unit && (
        <span className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-xs font-light text-slate-400 dark:text-slate-400 pointer-events-none select-none">
          {unit}
        </span>
      )}
    </div>
  );
};
