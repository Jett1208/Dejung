import React from 'react';
import type { AllocationItem, ItemCalculation } from '../domain/types';

interface DonutChartProps {
  items: AllocationItem[];
  itemSummaries: ItemCalculation[];
  totalFunds: number;
  unallocatedBalance: number;
}

const PALETTE = [
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#f97316', // Orange
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#14b8a6', // Teal
];

export const DonutChart: React.FC<DonutChartProps> = ({
  items,
  itemSummaries,
  totalFunds,
  unallocatedBalance,
}) => {
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
        <div className="w-36 h-36 rounded-full border-8 border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400 font-bold mb-3">
          ไม่มีข้อมูล
        </div>
        <p className="text-xs text-slate-400">ใส่เงินก้อนและเพิ่มรายการเพื่อดูกราฟสัดส่วน</p>
      </div>
    );
  }

  // Calculate slices
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
            stroke="#e2e8f0"
            strokeWidth="16"
          />

          {/* Slices */}
          {slices.map((slice) => (
            <circle
              key={slice.id}
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={slice.color}
              strokeWidth="16"
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          ))}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            จัดสรรแล้ว
          </span>
          <span className="text-2xl font-black text-slate-900 leading-tight">
            {allocatedPercent}%
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            {unallocatedBalance < 0 ? 'เกินงบ' : `เหลือ ${Math.round(unallocatedPercent)}%`}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="mt-5 space-y-2 max-h-48 overflow-y-auto pr-1">
        {slices.map((slice) => (
          <div
            key={slice.id}
            className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0"
          >
            <div className="flex items-center gap-2 truncate pr-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="font-semibold text-slate-700 truncate">{slice.name}</span>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-slate-900">฿{slice.amount.toLocaleString()}</span>
              <span className="text-slate-400 ml-1.5 text-[11px]">({slice.percent}%)</span>
            </div>
          </div>
        ))}

        {unallocatedBalance > 0 && (
          <div className="flex items-center justify-between text-xs py-1 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
              <span>รอจัดสรร</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-600">
                ฿{unallocatedBalance.toLocaleString()}
              </span>
              <span className="text-slate-400 ml-1.5 text-[11px]">
                ({Math.round(unallocatedPercent)}%)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
