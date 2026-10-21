import React from 'react';
import {
  PieChart as PieIcon,
  AlertTriangle,
  Coins,
  CalendarDays,
} from 'lucide-react';
import type { CalculationSummary, AllocationItem } from '../domain/types';
import { DonutChart } from './DonutChart';

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
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-900 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-rose-800">
              จัดสรรเงินเกินงบไป ฿{summary.overAllocatedAmount.toLocaleString()} บาท ({percentAllocated}%)
            </h4>
            <p className="text-xs text-rose-600/90 mt-0.5">
              ยอดรวมรายการจัดสรรสูงกว่าเงินก้อนตั้งต้น กรุณาปรับลดจำนวนเงินในรายการเพื่อรักษาสมดุล
            </p>
          </div>
        </div>
      )}

      {/* Main Unallocated Balance Card */}
      <div
        className={`rounded-2xl p-5 shadow-sm border transition ${
          summary.isOverAllocated
            ? 'bg-rose-50/50 border-rose-200'
            : summary.unallocatedBalance === 0 && summary.totalFunds > 0
            ? 'bg-emerald-50/50 border-emerald-200'
            : 'bg-white border-slate-100'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-emerald-600" />
            เงินคงเหลือ (Unallocated Balance)
          </span>
          {summary.isOverAllocated ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
              งบเกิน
            </span>
          ) : summary.unallocatedBalance === 0 && summary.totalFunds > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
              จัดสรรครบพอดี
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
              รอจัดสรร
            </span>
          )}
        </div>

        <div
          className={`text-3xl sm:text-4xl font-black tracking-tight leading-none mb-2 ${
            summary.isOverAllocated ? 'text-rose-600' : 'text-slate-900'
          }`}
        >
          {summary.isOverAllocated ? '-' : ''}฿{Math.abs(summary.unallocatedBalance).toLocaleString()}
        </div>

        {/* Progress Bar of Funds */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              summary.isOverAllocated ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, percentAllocated)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>จัดสรรแล้ว ฿{summary.totalAllocated.toLocaleString()} ({percentAllocated}%)</span>
          <span>จากเงินก้อน ฿{summary.totalFunds.toLocaleString()}</span>
        </div>
      </div>

      {/* Free Daily Allowance Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-emerald-400" />
            ใช้อิสระได้เฉลี่ยต่อวัน (Free Daily Allowance)
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            {summary.cycleDays} วัน
          </span>
        </div>

        <div className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">
          {summary.isOverAllocated ? (
            <span className="text-rose-400 text-xl font-bold">0 ฿/วัน (เกินงบ)</span>
          ) : (
            `฿${Math.round(summary.freeDailyAllowance).toLocaleString()} บ./วัน`
          )}
        </div>

        <p className="text-xs text-slate-300/80">
          {summary.isOverAllocated
            ? 'เนื่องจากจัดสรรเกินงบประมาณ จึงไม่มีเงินคงเหลือสำหรับใช้อิสระต่อวัน'
            : 'เงินช้อปปิ้งหรือกินใช้นอกงบ ที่ใช้ได้ต่อวันโดยไม่กระทบค่าใช้จ่ายที่ตั้งไว้'}
        </p>
      </div>

      {/* Visual Donut Chart Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <PieIcon className="w-4 h-4 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">
            สัดส่วนการจัดสรร (Visual Distribution)
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
