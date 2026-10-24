import React, { useState } from 'react';
import { Trash2, PiggyBank, CalendarDays } from 'lucide-react';
import type { AllocationItem, AllocationRule, ItemCalculation } from '../domain/types';
import { CompactNumberInput } from './CompactNumberInput';
import { DayCalendarGrid } from './DayCalendarGrid';
import { formatCompactNumber, formatFullCurrency } from '../utils/numberFormat';

interface CategoryItemProps {
  item: AllocationItem;
  summary?: ItemCalculation;
  cycleDays: number;
  onUpdate: (updates: Partial<AllocationItem>) => void;
  onRemove: () => void;
}

/** Default: all 28 days selected (backward-compatible) */
const ALL_DAYS = new Array<boolean>(28).fill(true);

export const CategoryItem: React.FC<CategoryItemProps> = ({
  item,
  summary,
  cycleDays,
  onUpdate,
  onRemove,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const rules: { rule: AllocationRule; label: string; unit: string }[] = [
    { rule: 'daily', label: 'รายวัน', unit: 'บ./วัน' },
    { rule: 'fixed', label: 'คงที่', unit: 'บาท' },
    { rule: 'percentage', label: '% ก้อน', unit: '%' },
  ];

  const calculatedAmount = summary?.calculatedAmount ?? 0;
  const percentage = summary?.percentageOfTotal ?? 0;

  // Determine day count for display
  const isDaily = item.rule === 'daily';
  const currentDays = item.selectedDays ?? ALL_DAYS;
  const selectedDayCount = isDaily && item.selectedDays
    ? item.selectedDays.filter(Boolean).length
    : cycleDays;

  const handleCalendarChange = (days: boolean[]) => {
    onUpdate({ selectedDays: days });
  };

  const handleRuleChange = (rule: AllocationRule) => {
    // If switching away from daily, keep selectedDays for later
    // If switching to daily and no selectedDays, initialize with all selected
    const updates: Partial<AllocationItem> = { rule };
    if (rule === 'daily' && !item.selectedDays) {
      updates.selectedDays = [...ALL_DAYS];
    }
    onUpdate(updates);
  };

  // Day count display text
  const dayCountText = isDaily
    ? item.selectedDays
      ? `(${selectedDayCount}/28 วัน)`
      : `(${cycleDays} วัน)`
    : '';

  return (
    <div
      className={`glass-panel rounded-3xl p-4 transition shadow-sm ${
        item.isSavings
          ? 'ring-1 ring-emerald-500/30 dark:ring-brand-lime/30'
          : ''
      }`}
    >
      {/* ── Row 1: Name + Action Badges ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        {/* Name Input */}
        <div className="flex-1">
          <input
            type="text"
            value={item.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="ชื่อรายการ เช่น ค่าอาหาร"
            className="w-full font-normal text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-transparent text-base border-b border-transparent hover:border-slate-300 dark:hover:border-white/20 focus:border-brand-lime focus:outline-none transition pb-0.5"
          />
        </div>

        {/* Action badges: Calendar (daily only) + isSavings toggle + Delete */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Calendar toggle button — only for daily rule */}
          {isDaily && (
            <button
              type="button"
              onClick={() => {
                // Initialize selectedDays on first open if needed
                if (!item.selectedDays) {
                  onUpdate({ selectedDays: [...ALL_DAYS] });
                }
                setCalendarOpen((prev) => !prev);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition ${
                calendarOpen
                  ? 'bg-brand-lime text-slate-950 font-medium shadow-xs'
                  : 'glass-pill font-light text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
              title="เปิดปฏิทินเลือกวันที่ใช้จ่าย"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>เลือกวัน</span>
              {item.selectedDays && (
                <span className={`tabular-nums ${
                  calendarOpen ? 'text-slate-950/70' : 'text-brand-lime'
                }`}>
                  {selectedDayCount}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => onUpdate({ isSavings: !item.isSavings })}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition ${
              item.isSavings
                ? 'bg-brand-lime text-slate-950 font-medium shadow-xs'
                : 'glass-pill font-light text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
            title="ระบุว่ารายการนี้เป็นเงินออมสำหรับเชื่อมกับเป้าหมายออม"
          >
            <PiggyBank className="w-3.5 h-3.5" />
            <span>เงินออม</span>
          </button>

          <button
            type="button"
            onClick={onRemove}
            title="ลบรายการนี้"
            className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Row 2: Rule Selector + Value Input + Computed Badge ── */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Rule selector tabs */}
        <div className="sm:col-span-6 flex glass-pill p-1 rounded-full">
          {rules.map((r) => (
            <button
              key={r.rule}
              type="button"
              onClick={() => handleRuleChange(r.rule)}
              className={`flex-1 py-1 text-xs rounded-full transition text-center ${
                item.rule === r.rule
                  ? 'bg-white/80 dark:bg-white/15 text-slate-900 dark:text-white font-medium shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 font-light hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Value input */}
        <div className="sm:col-span-6 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <CompactNumberInput
              value={item.value}
              onChange={(value) => onUpdate({ value })}
              placeholder="0"
              unit={item.rule === 'daily' ? 'บ./วัน' : item.rule === 'percentage' ? '%' : 'บาท'}
              className="glass-input w-full pl-4 pr-14 py-2 font-normal text-slate-800 dark:text-white text-base transition"
            />
          </div>

          {/* Computed amount badge */}
          <div
            className="shrink-0 text-right min-w-[70px] cursor-help"
            title={formatFullCurrency(calculatedAmount)}
          >
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              = ฿{formatCompactNumber(calculatedAmount)}
            </div>
            <div className="text-[11px] font-extralight text-slate-400 dark:text-slate-500">
              {percentage}% {dayCountText}
            </div>
          </div>
        </div>
      </div>

      {/* ── Inline Calendar Accordion (daily rule only) ── */}
      {isDaily && (
        <div className={`calendar-accordion ${calendarOpen ? 'expanded' : ''} mt-3`}>
          <div className="calendar-inner">
            <div className="pt-3 border-t border-white/5">
              <DayCalendarGrid
                selectedDays={currentDays}
                onChange={handleCalendarChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
