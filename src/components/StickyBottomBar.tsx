import React, { useState } from 'react';
import { ChevronUp, Coins, X, PieChart, Sparkles } from 'lucide-react';
import type { CalculationSummary, AllocationItem } from '../domain/types';
import { DonutChart } from './DonutChart';
import { Dejung3DCoin } from './Dejung3DCoin';

interface StickyBottomBarProps {
  summary: CalculationSummary;
  items: AllocationItem[];
  onOpenResult?: () => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({ summary, items, onOpenResult }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Floating Bottom Bar (Mobile/iPad) - Tappable anywhere */}
      <div
        onClick={() => setIsExpanded(true)}
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel rounded-t-3xl border-b-0 px-4 py-3 cursor-pointer transition select-none ${
          summary.isOverAllocated
            ? 'ring-1 ring-rose-500/40 text-rose-800 dark:text-rose-200'
            : 'text-slate-800 dark:text-white'
        }`}
      >
        <div className="max-w-md mx-auto flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3">
            <Coins className="w-5 h-5 text-emerald-600 dark:text-brand-lime shrink-0" />

            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[11px] font-light ${
                    summary.isOverAllocated ? 'text-rose-600 dark:text-rose-300' : 'text-slate-400 dark:text-slate-400'
                  }`}
                >
                  เงินคงเหลือ
                </span>
                {summary.isOverAllocated && (
                  <span className="text-[10px] font-normal text-white bg-rose-500 px-1.5 py-0.2 rounded-full">
                    งบเกิน
                  </span>
                )}
              </div>
              <div
                className={`text-lg font-normal leading-tight ${
                  summary.isOverAllocated ? 'text-rose-500' : 'text-slate-900 dark:text-white'
                }`}
              >
                {summary.isOverAllocated ? '-' : ''}฿{Math.abs(summary.unallocatedBalance).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <div
                className={`text-[10px] font-extralight ${
                  summary.isOverAllocated ? 'text-rose-600 dark:text-rose-300' : 'text-slate-400 dark:text-slate-400'
                }`}
              >
                ใช้อิสระได้
              </div>
              <div
                className={`text-xs font-normal ${
                  summary.isOverAllocated ? 'text-rose-500' : 'text-emerald-600 dark:text-brand-lime'
                }`}
              >
                {summary.isOverAllocated ? '0 ฿/วัน (เกินงบ)' : `฿${Math.round(summary.freeDailyAllowance)}/วัน`}
              </div>
            </div>

            <div className="glass-pill flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-light text-slate-800 dark:text-white pointer-events-auto shadow-xs">
              <PieChart className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-lime" />
              <span>สรุปภาพรวม</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Bottom Drawer / Sheet */}
      {isExpanded && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/40 dark:bg-black/60 backdrop-blur-md flex flex-col justify-end">
          <div
            className="fixed inset-0"
            onClick={() => setIsExpanded(false)}
          />

          <div className="relative glass-panel rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 z-10 animate-in slide-in-from-bottom duration-300">
            {/* Handle bar */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-normal text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
                <span>สรุปภาพรวมงบประมาณ</span>
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white glass-pill"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Stat Pill */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div
                className={`p-3.5 rounded-2xl glass-panel ${
                  summary.isOverAllocated
                    ? 'ring-1 ring-rose-500/40'
                    : ''
                }`}
              >
                <span
                  className={`text-[11px] font-light ${
                    summary.isOverAllocated ? 'text-rose-600 dark:text-rose-300' : 'text-slate-400'
                  }`}
                >
                  เงินคงเหลือ
                </span>
                <p
                  className={`text-lg font-normal ${
                    summary.isOverAllocated ? 'text-rose-500' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {summary.isOverAllocated ? '-' : ''}฿{Math.abs(summary.unallocatedBalance).toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl glass-panel">
                <span className="text-[11px] font-light text-slate-400">ใช้อิสระเฉลี่ย</span>
                <p className="text-lg font-normal text-emerald-600 dark:text-brand-lime">
                  {summary.isOverAllocated
                    ? '0 ฿/วัน (เกินงบ)'
                    : `฿${Math.round(summary.freeDailyAllowance)}/วัน`}
                </p>
              </div>
            </div>

            {/* 3D Coin preview inside drawer */}
            <div className="my-3 p-4 glass-panel rounded-2xl flex items-center justify-around">
              <Dejung3DCoin
                isOverAllocated={summary.isOverAllocated}
                unallocatedBalance={summary.unallocatedBalance}
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 max-w-[160px]">
                <span className="font-normal text-slate-700 dark:text-slate-200 block mb-0.5">3D เหรียญนำโชค</span>
                <span className="font-extralight">เปล่งแสงตอบสนองตามสถานะงบประมาณ</span>
              </div>
            </div>

            {/* Donut Chart inside drawer */}
            <DonutChart
              items={items}
              itemSummaries={summary.itemSummaries}
              totalFunds={summary.totalFunds}
              unallocatedBalance={summary.unallocatedBalance}
            />

            {onOpenResult && (
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  onOpenResult();
                }}
                className="w-full mt-4 py-3 bg-brand-lime hover:bg-brand-mint text-slate-950 font-medium text-xs rounded-full flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>เปิดดูสลิปสรุปผลการจัดสรร</span>
              </button>
            )}

            <button
              onClick={() => setIsExpanded(false)}
              className="w-full mt-3 py-2.5 glass-pill text-slate-700 dark:text-slate-200 text-xs font-light rounded-full transition"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </>
  );
};
