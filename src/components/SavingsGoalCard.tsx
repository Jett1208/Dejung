import React from 'react';
import { Target, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

interface SavingsGoalCardProps {
  savingsTarget: number;
  currentSavings: number;
  totalSavingsAllocated: number;
  savingsProgressPercent: number;
  savingsCyclesRequired: number;
  cycleDays?: number;
  onSavingsTargetChange: (value: number) => void;
  onCurrentSavingsChange: (value: number) => void;
}

export const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({
  savingsTarget,
  currentSavings,
  totalSavingsAllocated,
  savingsProgressPercent,
  savingsCyclesRequired,
  cycleDays = 30,
  onSavingsTargetChange,
  onCurrentSavingsChange,
}) => {
  const isGoalReached = savingsTarget > 0 && currentSavings >= savingsTarget;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-none">
            เป้าหมายเงินออม (Savings Goal Tracker)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            จำลองระยะเวลาการออมสะสมสู่เป้าหมายใหญ่
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Savings Target Input */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            เป้าหมายเงินออมที่ต้องการ (Savings Target)
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="เช่น 50,000"
              value={savingsTarget === 0 ? '' : savingsTarget}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                onSavingsTargetChange(val);
              }}
              className="w-full pl-3 pr-12 py-2.5 font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-base transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
              บาท
            </span>
          </div>
        </div>

        {/* Current Savings Input */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            เงินออมสะสมที่มีอยู่แล้ว (Current Savings)
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="เช่น 20,000 (ถ้ามี)"
              value={currentSavings === 0 ? '' : currentSavings}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                onCurrentSavingsChange(val);
              }}
              className="w-full pl-3 pr-12 py-2.5 font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-base transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
              บาท
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {savingsTarget > 0 && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-3">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-600 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              ความคืบหน้าสะสม
            </span>
            <span className="text-emerald-700 font-extrabold text-sm">
              {savingsProgressPercent}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, savingsProgressPercent)}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
            <span>มีอยู่แล้ว ฿{currentSavings.toLocaleString()}</span>
            <span>เป้าหมาย ฿{savingsTarget.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Trajectory Calculation Message */}
      <div className="text-xs p-3 rounded-xl border transition flex items-start gap-2.5 bg-emerald-50/60 border-emerald-200 text-emerald-900">
        {isGoalReached ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">🎉 ยอดเยี่ยมมาก! คุณบรรลุเป้าหมายเงินออมนี้เรียบร้อยแล้ว</p>
            </div>
          </>
        ) : savingsTarget > 0 && totalSavingsAllocated > 0 ? (
          <>
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                ด้วยยอดเงินออมรอบนี้ (฿{totalSavingsAllocated.toLocaleString()}) จะถึงเป้าหมายในอีก {savingsCyclesRequired} รอบ (ประมาณ {savingsCyclesRequired * cycleDays} วัน)
              </p>
              <p className="text-[11px] text-emerald-700/80 mt-0.5">
                ยอดที่ยังขาดอีก ฿{Math.max(0, savingsTarget - currentSavings).toLocaleString()} บาท
              </p>
            </div>
          </>
        ) : totalSavingsAllocated === 0 ? (
          <>
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">
                คุณยังไม่ได้จัดสรรเงินออมในรอบนี้ (แตะปุ่ม "เงินออม" ในรายการแบ่งจ่ายด้านบน เพื่อนำยอดมาคำนวณเป้าหมาย)
              </p>
            </div>
          </>
        ) : (
          <>
            <Target className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-emerald-800">
                ตั้งเป้าหมายเงินออมด้านบน เพื่อดูการคาดการณ์จำนวนรอบที่ต้องเก็บเงิน
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
