import React, { useState } from 'react';
import { ChevronUp, Coins, X, PieChart } from 'lucide-react';
import type { CalculationSummary, AllocationItem } from '../domain/types';
import { DonutChart } from './DonutChart';

interface StickyBottomBarProps {
  summary: CalculationSummary;
  items: AllocationItem[];
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({ summary, items }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Floating Bottom Bar (Mobile/iPad) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                summary.isOverAllocated
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <Coins className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  เงินคงเหลือ
                </span>
                {summary.isOverAllocated && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                    งบเกิน
                  </span>
                )}
              </div>
              <div
                className={`text-lg font-black leading-tight ${
                  summary.isOverAllocated ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {summary.isOverAllocated ? '-' : ''}฿{Math.abs(summary.unallocatedBalance).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-semibold text-slate-400">ใช้อิสระได้</div>
              <div className="text-xs font-extrabold text-emerald-600">
                {summary.isOverAllocated ? '0 บ./วัน' : `฿${Math.round(summary.freeDailyAllowance)}/วัน`}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-1 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>สรุปภาพรวม</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Bottom Drawer / Sheet */}
      {isExpanded && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end">
          <div
            className="fixed inset-0"
            onClick={() => setIsExpanded(false)}
          />

          <div className="relative bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-600" />
                <span>สรุปภาพรวมงบประมาณ</span>
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stat Pill */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400">เงินคงเหลือ</span>
                <p
                  className={`text-lg font-black ${
                    summary.isOverAllocated ? 'text-rose-600' : 'text-slate-900'
                  }`}
                >
                  {summary.isOverAllocated ? '-' : ''}฿{Math.abs(summary.unallocatedBalance).toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-slate-900 text-white rounded-xl">
                <span className="text-[11px] font-bold text-slate-300">ใช้อิสระได้เฉลี่ย</span>
                <p className="text-lg font-black text-emerald-400">
                  {summary.isOverAllocated
                    ? '0 บ./วัน'
                    : `฿${Math.round(summary.freeDailyAllowance)}/วัน`}
                </p>
              </div>
            </div>

            {/* Donut Chart inside drawer */}
            <DonutChart
              items={items}
              itemSummaries={summary.itemSummaries}
              totalFunds={summary.totalFunds}
              unallocatedBalance={summary.unallocatedBalance}
            />

            <button
              onClick={() => setIsExpanded(false)}
              className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </>
  );
};
