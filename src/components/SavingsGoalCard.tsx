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
    <div className="glass-panel rounded-3xl p-5 mb-5">
      <div className="flex items-center gap-2.5 mb-4">
        <Target className="w-5 h-5 text-emerald-600 dark:text-brand-lime shrink-0" />
        <div>
          <h3 className="text-base font-normal text-slate-900 dark:text-white leading-tight">
            เป้าหมายการออม
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-400 font-extralight mt-0.5">
            จำลองระยะเวลาการออมสะสมสู่เป้าหมาย
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Savings Target Input */}
        <div>
          <label className="block text-xs font-light text-slate-600 dark:text-slate-300 mb-1.5">
            เป้าหมายเงินออมที่ต้องการ
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
              className="glass-input w-full pl-4 pr-12 py-2.5 font-normal text-slate-800 dark:text-white text-base transition"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-light text-slate-400">
              บาท
            </span>
          </div>
        </div>

        {/* Current Savings Input */}
        <div>
          <label className="block text-xs font-light text-slate-600 dark:text-slate-300 mb-1.5">
            เงินออมสะสมที่มีอยู่แล้ว
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
              className="glass-input w-full pl-4 pr-12 py-2.5 font-normal text-slate-800 dark:text-white text-base transition"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-light text-slate-400">
              บาท
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {savingsTarget > 0 && (
        <div className="glass-panel rounded-2xl p-4 mb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-600 dark:text-slate-300 font-light flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-lime" />
              ความคืบหน้าสะสม
            </span>
            <span className="text-emerald-600 dark:text-brand-lime font-medium text-sm">
              {savingsProgressPercent}%
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200/50 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-lime to-brand-mint rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, savingsProgressPercent)}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-extralight mt-1.5">
            <span>มีอยู่แล้ว ฿{currentSavings.toLocaleString()}</span>
            <span>เป้าหมาย ฿{savingsTarget.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Trajectory Calculation Message */}
      <div className="text-xs p-3.5 rounded-2xl border transition flex items-start gap-2.5 glass-panel">
        {isGoalReached ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-brand-lime shrink-0 mt-0.5" />
            <div>
              <p className="font-normal text-slate-800 dark:text-slate-100">🎉 ยอดเยี่ยมมาก! คุณบรรลุเป้าหมายเงินออมนี้เรียบร้อยแล้ว</p>
            </div>
          </>
        ) : savingsTarget > 0 && totalSavingsAllocated > 0 ? (
          <>
            <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-brand-lime shrink-0 mt-0.5" />
            <div>
              <p className="font-normal text-slate-800 dark:text-slate-100">
                ด้วยยอดเงินออมรอบนี้ (฿{totalSavingsAllocated.toLocaleString()}) จะถึงเป้าหมายในอีก {savingsCyclesRequired} รอบ (ประมาณ {savingsCyclesRequired * cycleDays} วัน)
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 font-extralight mt-0.5">
                ยอดที่ยังขาดอีก ฿{Math.max(0, savingsTarget - currentSavings).toLocaleString()} บาท
              </p>
            </div>
          </>
        ) : totalSavingsAllocated === 0 ? (
          <>
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-light text-amber-800 dark:text-amber-300">
                คุณยังไม่ได้จัดสรรเงินออมในรอบนี้ (แตะปุ่ม "เงินออม" ในรายการแบ่งจ่ายด้านบน เพื่อนำยอดมาคำนวณเป้าหมาย)
              </p>
            </div>
          </>
        ) : (
          <>
            <Target className="w-4 h-4 text-emerald-500 dark:text-brand-lime shrink-0 mt-0.5" />
            <div>
              <p className="font-light text-slate-600 dark:text-slate-300">
                ตั้งเป้าหมายเงินออมด้านบน เพื่อดูการคาดการณ์จำนวนรอบที่ต้องเก็บเงิน
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
