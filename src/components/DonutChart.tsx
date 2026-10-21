import React, { useState } from 'react';
import type { AllocationItem, ItemCalculation } from '../domain/types';

interface DonutChartProps {
  items: AllocationItem[];
  itemSummaries: ItemCalculation[];
  totalFunds: number;
  unallocatedBalance: number;
}

const PALETTE = [
  '#72F6BD', // Mint (Brand)
  '#D9FF62', // Lime (Brand)
  '#A985FF', // Purple (Brand)
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#f97316', // Orange
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

export const DonutChart: React.FC<DonutChartProps> = ({
  items,
  itemSummaries,
  totalFunds,
  unallocatedBalance,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const summaryMap = new Map<string, ItemCalculation>(
    itemSummaries.map((s) => [s.id, s])
  );

  const totalAllocated = items.reduce((acc, it) => {
    return acc + (summaryMap.get(it.id)?.calculatedAmount ?? 0);
  }, 0);

  // If no items and no funds, show blank placeholder ring
  if (totalFunds === 0 && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="w-36 h-36 rounded-full border-2 border-dashed border-slate-300 dark:border-white/10 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-light mb-3">
          ไม่มีข้อมูล
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-extralight">ใส่เงินก้อนและเพิ่มรายการเพื่อดูกราฟสัดส่วน</p>
      </div>
    );
  }

  // Radius = 60, circumference = 2 * PI * 60 = 376.99
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  // Base denominator for chart percentage
  const chartTotal = Math.max(totalFunds, totalAllocated);

  const slices: Array<{
    id: string;
    name: string;
    amount: number;
    percent: number;
    color: string;
    strokeDasharray: string;
    strokeDashoffset: number;
  }> = [];

  let currentOffset = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const amount = summaryMap.get(item.id)?.calculatedAmount ?? 0;
    const percent = chartTotal > 0 ? (amount / chartTotal) * 100 : 0;
    const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((currentOffset / 100) * circumference);
    const color = PALETTE[i % PALETTE.length];

    slices.push({
      id: item.id,
      name: item.name,
      amount,
      percent: Math.round(percent * 10) / 10,
      color,
      strokeDasharray,
      strokeDashoffset,
    });
    currentOffset += percent;
  }

  const unallocatedPercent = Math.max(0, 100 - currentOffset);
  const allocatedPercent = Math.min(100, Math.round(currentOffset * 10) / 10);
  const activeSlice = slices.find((s) => s.id === hoveredId);

  return (
    <div>
      <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background Ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-slate-200/60 dark:text-white/10"
            strokeWidth="16"
          />

          {/* Slices */}
          {slices.map((slice) => {
            const isHovered = slice.id === hoveredId;
            return (
              <circle
                key={slice.id}
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? '20' : '16'}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-300 ease-out"
                onMouseEnter={() => setHoveredId(slice.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            );
          })}
        </svg>

        {/* Center Text (Interactive) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          {activeSlice ? (
            <>
              <span className="text-[11px] font-light text-slate-500 dark:text-slate-400 truncate max-w-[110px]">
                {activeSlice.name}
              </span>
              <span className="text-xl font-medium text-slate-900 dark:text-white leading-tight">
                ฿{activeSlice.amount.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-brand-lime font-medium">
                {activeSlice.percent}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-light text-slate-400 dark:text-slate-500 tracking-wide">
                จัดสรรแล้ว
              </span>
              <span className="text-2xl font-medium text-slate-900 dark:text-white leading-tight">
                {allocatedPercent}%
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extralight">
                {unallocatedBalance < 0 ? 'เกินงบ' : `เหลือ ${Math.round(unallocatedPercent)}%`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div className="mt-5 space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {slices.map((slice) => {
          const isHovered = slice.id === hoveredId;
          return (
            <div
              key={slice.id}
              onMouseEnter={() => setHoveredId(slice.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`flex items-center justify-between text-xs py-1.5 px-2.5 rounded-full cursor-pointer transition ${
                isHovered
                  ? 'glass-pill shadow-xs'
                  : 'hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="font-light text-slate-700 dark:text-slate-200 truncate">{slice.name}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-medium text-slate-900 dark:text-white">฿{slice.amount.toLocaleString()}</span>
                <span className="text-slate-400 dark:text-slate-500 ml-1.5 text-[11px] font-extralight">({slice.percent}%)</span>
              </div>
            </div>
          );
        })}

        {unallocatedBalance > 0 && (
          <div className="flex items-center justify-between text-xs py-1.5 px-2.5 text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
              <span className="font-light">รอจัดสรร</span>
            </div>
            <div className="text-right">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                ฿{unallocatedBalance.toLocaleString()}
              </span>
              <span className="text-slate-400 dark:text-slate-500 ml-1.5 text-[11px] font-extralight">
                ({Math.round(unallocatedPercent)}%)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
