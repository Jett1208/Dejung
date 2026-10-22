import React from 'react';
import {
  PieChart as PieIcon,
  AlertTriangle,
  Coins,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import type { CalculationSummary, AllocationItem } from '../domain/types';
import { DonutChart } from './DonutChart';
import { Dejung3DCoin } from './Dejung3DCoin';
import { formatCompactNumber, formatFullCurrency } from '../utils/numberFormat';

interface SummaryDashboardProps {
  summary: CalculationSummary;
  items: AllocationItem[];
  onOpenResult?: () => void;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ summary, items, onOpenResult }) => {
  const percentAllocated = summary.totalFunds > 0
    ? Math.round((summary.totalAllocated / summary.totalFunds) * 100)
    : 0;

  const balanceStr = `${summary.isOverAllocated ? '-' : ''}฿${Math.abs(summary.unallocatedBalance).toLocaleString()}`;
  const balanceFontSize =
    balanceStr.length <= 8
      ? 'text-3xl sm:text-4xl'
      : balanceStr.length <= 11
      ? 'text-2xl sm:text-3xl'
      : 'text-xl sm:text-2xl';

  return (
    <div className="space-y-4">
      {/* Over-allocation warning banner */}
      {summary.isOverAllocated && (
        <div className="glass-panel border-rose-500/40 rounded-3xl p-4 flex items-start gap-3 text-rose-800 dark:text-rose-200 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4
              className="text-sm font-normal text-rose-700 dark:text-rose-300"
              title={formatFullCurrency(summary.overAllocatedAmount)}
            >
              จัดสรรเงินเกินงบไป ฿{formatCompactNumber(summary.overAllocatedAmount)} บาท ({percentAllocated}%)
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
          {summary.totalFunds === 0 ? (
            <span className="glass-pill px-2.5 py-0.5 rounded-full text-[11px] font-extralight text-amber-600 dark:text-amber-400 border border-amber-500/20">
              รอใส่เงินก้อนตั้งต้น
            </span>
          ) : summary.isOverAllocated ? (
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
          <div className="flex-1 min-w-0">
            {summary.totalFunds === 0 ? (
              <div className="text-xl sm:text-2xl font-normal text-amber-600 dark:text-amber-400 leading-snug mb-3">
                ใส่เงินที่มีในรอบนี้เพื่อคำนวณ
              </div>
            ) : (
              <div
                title={formatFullCurrency(summary.unallocatedBalance)}
                className={`${balanceFontSize} font-normal tracking-tight leading-none mb-3 break-all ${
                  summary.isOverAllocated ? 'text-rose-500' : 'text-slate-900 dark:text-white'
                }`}
              >
                {balanceStr}
              </div>
            )}

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
              <span title={formatFullCurrency(summary.totalAllocated)}>
                จัดสรรแล้ว ฿{formatCompactNumber(summary.totalAllocated)} ({percentAllocated}%)
              </span>
              <span title={formatFullCurrency(summary.totalFunds)}>
                จากเงินก้อน ฿{formatCompactNumber(summary.totalFunds)}
              </span>
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

        <div
          className="text-2xl sm:text-3xl font-normal text-emerald-600 dark:text-brand-lime mb-1.5"
          title={formatFullCurrency(summary.freeDailyAllowance)}
        >
          {summary.totalFunds === 0 ? (
            <span className="text-slate-400 text-lg font-light">ใส่เงินก้อนเพื่อเริ่มคำนวณ</span>
          ) : summary.isOverAllocated ? (
            <span className="text-rose-400 text-xl font-normal">0 ฿/วัน (เกินงบ)</span>
          ) : (
            `฿${formatCompactNumber(Math.round(summary.freeDailyAllowance))} บ./วัน`
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-extralight mb-1">
          {summary.totalFunds === 0
            ? 'กรอกเงินก้อนตั้งต้นในขั้นตอนที่ 1 เพื่อคำนวณเงินกินใช้อิสระต่อวัน'
            : summary.isOverAllocated
            ? 'เนื่องจากจัดสรรเกินงบประมาณ จึงไม่มีเงินคงเหลือสำหรับใช้อิสระต่อวัน'
            : 'เงินช้อปปิ้งหรือกินใช้นอกงบ ที่ใช้ได้ต่อวันโดยไม่กระทบค่าใช้จ่ายที่ตั้งไว้'}
        </p>

        <p className="text-[10px] font-extralight text-slate-400/80 dark:text-slate-500 mt-2 border-t border-white/5 pt-1.5">
          * ผลคำนวณตามแผนที่ตั้งไว้ • ไม่มีการตัดเงินหรือย้ายเงินจริงระหว่างบัญชี
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

        {onOpenResult && (
          <button
            type="button"
            onClick={onOpenResult}
            className="w-full mt-5 py-3 px-4 bg-brand-lime hover:bg-brand-mint text-slate-950 font-medium text-xs rounded-full flex items-center justify-center gap-2 transition shadow-sm hover:scale-[1.01] active:scale-[0.99]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ดูสลิปสรุปผลการจัดสรร</span>
          </button>
        )}
      </div>
    </div>
  );
};
