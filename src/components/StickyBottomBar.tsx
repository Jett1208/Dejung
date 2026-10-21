import React, { useState } from 'react';
import { ChevronUp, Coins, X, PieChart, AlertTriangle } from 'lucide-react';
import type { CalculationSummary, AllocationItem } from '../domain/types';
import { DonutChart } from './DonutChart';
import { Dejung3DCoin } from './Dejung3DCoin';

interface StickyBottomBarProps {
  summary: CalculationSummary;
  items: AllocationItem[];
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({ summary, items }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Floating Bottom Bar (Mobile/iPad) - Tappable anywhere */}
      <div
        onClick={() => setIsExpanded(true)}
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] cursor-pointer transition select-none ${
          summary.isOverAllocated
            ? 'bg-rose-50/95 dark:bg-rose-950/95 border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-200'
            : 'bg-white/95 dark:bg-midnight-950/95 border-slate-200 dark:border-midnight-border text-slate-800 dark:text-white'
        }`}
      >
        <div className="max-w-md mx-auto flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                summary.isOverAllocated
                  ? 'bg-rose-200/80 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-brand-lime'
              }`}
            >
              {summary.isOverAllocated ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Coins className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[11px] font-bold uppercase ${
                    summary.isOverAllocated ? 'text-rose-700 dark:text-rose-300' : 'text-slate-400 dark:text-slate-400'
                  }`}
                >
                  เงินคงเหลือ
                </span>
                {summary.isOverAllocated && (
                  <span className="text-[10px] font-extrabold text-white bg-rose-600 px-1.5 py-0.2 rounded-full">
                    งบเกิน
                  </span>
                )}
              </div>
              <div
                className={`text-lg font-black leading-tight ${
                  summary.isOverAllocated ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                }`}
              >
                {summary.isOverAllocated ? '-' : ''}฿{Math.abs(summary.unallocatedBalance).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <div
                className={`text-[10px] font-semibold ${
                  summary.isOverAllocated ? 'text-rose-700 dark:text-rose-300' : 'text-slate-400 dark:text-slate-400'
                }`}
              >
                ใช้อิสระได้
              </div>
              <div
                className={`text-xs font-extrabold ${
                  summary.isOverAllocated ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-brand-lime'
                }`}
              >
                {summary.isOverAllocated ? '0 ฿/วัน (เกินงบ)' : `฿${Math.round(summary.freeDailyAllowance)}/วัน`}
              </div>
            </div>

            <div className="flex items-center gap-1 px-3 py-2 bg-slate-900 dark:bg-brand-lime text-white dark:text-slate-900 rounded-xl text-xs font-bold transition shadow-sm pointer-events-auto">
              <PieChart className="w-3.5 h-3.5" />
              <span>สรุปภาพรวม</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Bottom Drawer / Sheet */}
      {isExpanded && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex flex-col justify-end">
          <div
            className="fixed inset-0"
            onClick={() => setIsExpanded(false)}
          />

          <div className="relative bg-white dark:bg-midnight-900 rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl z-10 animate-in slide-in-from-bottom duration-300 border-t border-slate-100 dark:border-midnight-border">
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-midnight-border rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-600 dark:text-brand-lime" />
                <span>สรุปภาพรวมงบประมาณ</span>
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-midnight-border"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stat Pill */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div
                className={`p-3 rounded-xl border ${
                  summary.isOverAllocated
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
                    : 'bg-slate-50 dark:bg-midnight-card border-slate-100 dark:border-midnight-border'
                }`}
              >
                <span
                  className={`text-[11px] font-bold ${
                    summary.isOverAllocated ? 'text-rose-700 dark:text-rose-300' : 'text-slate-400 dark:text-slate-400'
                  }`}
                >
                  เงินคงเหลือ
                </span>
                <p
                  className={`text-lg font-black ${
                    summary.isOverAllocated ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {summary.isOverAllocated ? '-' : ''}฿{Math.abs(summary.unallocatedBalance).toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-slate-900 dark:bg-midnight-card text-white rounded-xl border border-transparent dark:border-midnight-border">
                <span className="text-[11px] font-bold text-slate-300 dark:text-slate-400">ใช้อิสระได้เฉลี่ย</span>
                <p className="text-lg font-black text-emerald-400 dark:text-brand-lime">
                  {summary.isOverAllocated
                    ? '0 ฿/วัน (เกินงบ)'
                    : `฿${Math.round(summary.freeDailyAllowance)}/วัน`}
                </p>
              </div>
            </div>

            {/* 3D Coin preview inside drawer */}
            <div className="my-2 p-3 bg-slate-50 dark:bg-midnight-card/60 rounded-2xl flex items-center justify-around border border-slate-100 dark:border-midnight-border/60">
              <Dejung3DCoin
                isOverAllocated={summary.isOverAllocated}
                unallocatedBalance={summary.unallocatedBalance}
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 max-w-[160px]">
                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-0.5">3D Mood Indicator</span>
                เหรียญนำโชคเปล่งแสงตามสถานะงบประมาณ
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
              className="w-full mt-6 py-3 bg-slate-100 dark:bg-midnight-card hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </>
  );
};
