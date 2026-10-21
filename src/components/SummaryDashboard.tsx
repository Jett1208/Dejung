import React from 'react';
import {
  PieChart as PieIcon,
  AlertTriangle,
  Coins,
  CalendarDays,
} from 'lucide-react';
import type { CalculationSummary, AllocationItem } from '../domain/types';
import { DonutChart } from './DonutChart';
import { Dejung3DCoin } from './Dejung3DCoin';

interface SummaryDashboardProps {
  summary: CalculationSummary;
  items: AllocationItem[];
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ summary, items }) => {
  const percentAllocated = summary.totalFunds > 0
    ? Math.round((summary.totalAllocated / summary.totalFunds) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Over-allocation warning banner */}
      {summary.isOverAllocated && (
        <div className="glass-panel border-rose-500/40 rounded-3xl p-4 flex items-start gap-3 text-rose-800 dark:text-rose-200 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-normal text-rose-700 dark:text-rose-300">
              จัดสรรเงินเกินงบไป ฿{summary.overAllocatedAmount.toLocaleString()} บาท ({percentAllocated}%)
            </h4>
            <p className="text-xs text-rose-600/80 dark:text-rose-400/80 font-extralight mt-0.5">
              ยอดรวมรายการจัดสรรสูงกว่าเงินก้อนตั้งต้น กรุณาปรับลดจำนวนเงินในรายการเพื่อรักษาสมดุล
            </p>
          </div>
        </div>
      )}

      {/* Main Unallocated Balance Card with 3D Coin */}
      <div
        className={`glass-panel rounded-3xl p-6 transition ${
          summary.isOverAllocated
            ? 'ring-1 ring-rose-500/40'
            : summary.unallocatedBalance === 0 && summary.totalFunds > 0
            ? 'ring-1 ring-brand-lime/40'
            : ''
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-light text-slate-500 dark:text-slate-400 tracking-wide flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
            เงินคงเหลือ
          </span>
          {summary.isOverAllocated ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              งบเกิน
            </span>
          ) : summary.unallocatedBalance === 0 && summary.totalFunds > 0 ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-brand-lime/10 text-emerald-700 dark:text-brand-lime border border-brand-lime/30">
              จัดสรรครบพอดี
            </span>
          ) : (
            <span className="glass-pill px-2.5 py-0.5 rounded-full text-[11px] font-extralight text-slate-500 dark:text-slate-400">
              รอจัดสรร
            </span>
          )}
        </div>

        {/* Balance amount + 3D Coin Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div
              className={`text-3xl sm:text-4xl font-normal tracking-tight leading-none mb-3 ${
                summary.isOverAllocated ? 'text-rose-500' : 'text-slate-900 dark:text-white'
              }`}
            >
              {summary.isOverAllocated ? '-' : ''}฿{Math.abs(summary.unallocatedBalance).toLocaleString()}
            </div>

            {/* Progress Bar of Funds */}
            <div className="w-full bg-slate-200/50 dark:bg-white/10 h-2 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  summary.isOverAllocated ? 'bg-rose-500' : 'bg-brand-lime'
                }`}
                style={{ width: `${Math.min(100, percentAllocated)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-extralight">
              <span>จัดสรรแล้ว ฿{summary.totalAllocated.toLocaleString()} ({percentAllocated}%)</span>
              <span>จากเงินก้อน ฿{summary.totalFunds.toLocaleString()}</span>
            </div>
          </div>

          {/* Interactive 3D Coin */}
          <div className="shrink-0 hidden sm:block">
            <Dejung3DCoin
              isOverAllocated={summary.isOverAllocated}
              unallocatedBalance={summary.unallocatedBalance}
            />
          </div>
        </div>
      </div>

      {/* Free Daily Allowance Card */}
      <div className="glass-panel rounded-3xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-light text-slate-500 dark:text-slate-400 tracking-wide flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
            ใช้อิสระเฉลี่ยต่อวัน
          </span>
          <span className="glass-pill text-[11px] font-extralight text-slate-400 px-2 py-0.5 rounded-full">
            {summary.cycleDays} วัน
          </span>
        </div>

        <div className="text-2xl sm:text-3xl font-normal text-emerald-600 dark:text-brand-lime mb-1.5">
          {summary.isOverAllocated ? (
            <span className="text-rose-400 text-xl font-normal">0 ฿/วัน (เกินงบ)</span>
          ) : (
            `฿${Math.round(summary.freeDailyAllowance).toLocaleString()} บ./วัน`
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-extralight">
          {summary.isOverAllocated
            ? 'เนื่องจากจัดสรรเกินงบประมาณ จึงไม่มีเงินคงเหลือสำหรับใช้อิสระต่อวัน'
            : 'เงินช้อปปิ้งหรือกินใช้นอกงบ ที่ใช้ได้ต่อวันโดยไม่กระทบค่าใช้จ่ายที่ตั้งไว้'}
        </p>
      </div>

      {/* Visual Donut Chart Card */}
      <div className="glass-panel rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieIcon className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
          <h3 className="text-base font-normal text-slate-900 dark:text-white">
            สัดส่วนการจัดสรร
          </h3>
        </div>

        <DonutChart
          items={items}
          itemSummaries={summary.itemSummaries}
          totalFunds={summary.totalFunds}
          unallocatedBalance={summary.unallocatedBalance}
        />
      </div>
    </div>
  );
};
