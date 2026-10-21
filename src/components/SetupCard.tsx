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
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-5">
      {/* Friendly Guide Banner */}
      <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl mb-5 text-sm font-medium">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>วางแผนงบง่ายๆ ใน 3 ขั้นตอน: ใส่เงินก้อน ➔ ตั้งจำนวนวัน ➔ เพิ่มรายการแบ่งจ่าย</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Step 1: Total Funds */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>เงินก้อนตั้งต้น (Total Funds)</span>
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
              className="w-full pl-4 pr-12 py-3 text-lg font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
              บาท
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">เงินเดือน หรือยอดเงินที่มีสำหรับจัดสรรในรอบนี้</p>
        </div>

        {/* Step 2: Budget Cycle Days */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>รอบเวลา (Budget Cycle)</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                inputMode="decimal"
                placeholder="เช่น 30"
                value={cycleDays === 0 ? '' : cycleDays}
                onChange={(e) => {
                  const val = e.target.value === '' ? 1 : Number(e.target.value);
                  onCycleDaysChange(val);
                }}
                className="w-full pl-4 pr-10 py-3 text-lg font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                วัน
              </span>
            </div>
            {quickDays.map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => onCycleDaysChange(days)}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
                  cycleDays === days
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {days} วัน
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-1">ใช้คำนวณค่าใช้จ่ายรายวันและเงินเฉลี่ยต่อวัน</p>
        </div>
      </div>
    </div>
  );
};
