import React from 'react';
import { Trash2, PiggyBank } from 'lucide-react';
import type { AllocationItem, AllocationRule, ItemCalculation } from '../domain/types';

interface CategoryItemProps {
  item: AllocationItem;
  summary?: ItemCalculation;
  cycleDays: number;
  onUpdate: (updates: Partial<AllocationItem>) => void;
  onRemove: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  item,
  summary,
  cycleDays,
  onUpdate,
  onRemove,
}) => {
  const rules: { rule: AllocationRule; label: string; unit: string }[] = [
    { rule: 'daily', label: 'รายวัน', unit: 'บ./วัน' },
    { rule: 'fixed', label: 'คงที่', unit: 'บาท' },
    { rule: 'percentage', label: '% ก้อน', unit: '%' },
  ];

  const calculatedAmount = summary?.calculatedAmount ?? 0;
  const percentage = summary?.percentageOfTotal ?? 0;

  return (
    <div
      className={`bg-white rounded-2xl p-4 border transition shadow-xs ${
        item.isSavings
          ? 'border-emerald-200 bg-gradient-to-r from-emerald-50/30 to-white'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        {/* Name Input */}
        <div className="flex-1">
          <input
            type="text"
            value={item.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="ชื่อรายการ เช่น ค่าอาหาร"
            className="w-full font-bold text-slate-800 placeholder-slate-400 bg-transparent text-base border-b border-transparent hover:border-slate-200 focus:border-emerald-500 focus:outline-none transition pb-0.5"
          />
        </div>

        {/* Action badges: isSavings toggle + Delete */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onUpdate({ isSavings: !item.isSavings })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              item.isSavings
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Rule selector tabs */}
        <div className="sm:col-span-6 flex bg-slate-100 p-1 rounded-xl">
          {rules.map((r) => (
            <button
              key={r.rule}
              type="button"
              onClick={() => onUpdate({ rule: r.rule })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition text-center ${
                item.rule === r.rule
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Value input */}
        <div className="sm:col-span-6 flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              inputMode="decimal"
              value={item.value === 0 ? '' : item.value}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                onUpdate({ value: val });
              }}
              placeholder="0"
              className="w-full pl-3 pr-14 py-2 font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-base transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
              {item.rule === 'daily' ? 'บ./วัน' : item.rule === 'percentage' ? '%' : 'บาท'}
            </span>
          </div>

          {/* Computed amount badge */}
          <div className="shrink-0 text-right min-w-[90px]">
            <div className="text-sm font-extrabold text-slate-900">
              = ฿{calculatedAmount.toLocaleString()}
            </div>
            <div className="text-[11px] font-medium text-slate-400">
              {percentage}% {item.rule === 'daily' ? `(${cycleDays} วัน)` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
