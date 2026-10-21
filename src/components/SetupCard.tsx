import React from 'react';
import { Wallet, Calendar, Sparkles } from 'lucide-react';

interface SetupCardProps {
  totalFunds: number;
  cycleDays: number;
  onTotalFundsChange: (value: number) => void;
  onCycleDaysChange: (value: number) => void;
}

export const SetupCard: React.FC<SetupCardProps> = ({
  totalFunds,
  cycleDays,
  onTotalFundsChange,
  onCycleDaysChange,
}) => {
  const quickDays = [30, 15, 7];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 mb-6">
      {/* Friendly Guide Banner */}
      <div className="flex items-center gap-2 p-3 bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl mb-6 text-xs sm:text-sm font-light text-slate-700 dark:text-[rgba(255,235,210,0.8)]">
        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-brand-lime shrink-0" />
        <span>เริ่มต้นใน 3 ขั้นตอน: ใส่เงินก้อน ➔ ตั้งจำนวนวัน ➔ เพิ่มรายการแบ่งจ่าย</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Total Funds */}
        <div>
          <label className="flex items-center gap-2 text-sm font-light text-slate-700 dark:text-[rgba(255,248,240,0.9)] mb-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white/15 text-white flex items-center justify-center text-xs font-normal">
              1
            </span>
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
            <span>เงินก้อนตั้งต้น</span>
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="เช่น 25,000"
              value={totalFunds === 0 ? '' : totalFunds}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                onTotalFundsChange(val);
              }}
              className="glass-input w-full pl-5 pr-14 py-3 text-lg font-normal text-slate-900 dark:text-white"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-light text-slate-400 dark:text-[rgba(255,220,180,0.4)]">
              บาท
            </span>
          </div>
          <p className="text-[11px] font-extralight text-slate-400 dark:text-[rgba(255,220,180,0.4)] mt-1.5 ml-2">
            เงินเดือน หรือยอดเงินที่มีสำหรับจัดสรรในรอบนี้
          </p>
        </div>

        {/* Step 2: Budget Cycle Days */}
        <div>
          <label className="flex items-center gap-2 text-sm font-light text-slate-700 dark:text-[rgba(255,248,240,0.9)] mb-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white/15 text-white flex items-center justify-center text-xs font-normal">
              2
            </span>
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
            <span>รอบเวลา</span>
          </label>

          {/* Full-width Input for Days */}
          <div className="relative mb-2.5">
            <input
              type="number"
              inputMode="decimal"
              placeholder="เช่น 30"
              value={cycleDays === 0 ? '' : cycleDays}
              onChange={(e) => {
                const val = e.target.value === '' ? 1 : Number(e.target.value);
                onCycleDaysChange(val);
              }}
              className="glass-input w-full pl-5 pr-14 py-3 text-lg font-normal text-slate-900 dark:text-white"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-light text-slate-400 dark:text-[rgba(255,220,180,0.4)]">
              วัน
            </span>
          </div>

          {/* Quick Preset Pills Row */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-extralight text-slate-500 dark:text-slate-400">
              ปุ่มลัด:
            </span>
            {quickDays.map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => onCycleDaysChange(days)}
                className={`px-3 py-1 text-xs rounded-full transition shrink-0 ${
                  cycleDays === days
                    ? 'bg-brand-lime text-slate-950 font-medium shadow-xs'
                    : 'glass-pill font-light text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {days} วัน
              </button>
            ))}
          </div>

          <p className="text-[11px] font-extralight text-slate-400 dark:text-[rgba(255,220,180,0.4)] mt-1 ml-2">
            ใช้คำนวณค่าใช้จ่ายรายวันและเงินเฉลี่ยต่อวัน
          </p>
        </div>
      </div>
    </div>
  );
};
