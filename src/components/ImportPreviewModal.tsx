import React from 'react';
import { X, Check, AlertTriangle, Wallet, Calendar, Layers, Target } from 'lucide-react';
import type { BudgetState } from '../domain/types';
import { formatCompactNumber, formatFullCurrency } from '../utils/numberFormat';

interface ImportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (state: BudgetState) => void;
  plan: BudgetState | null;
  code: string;
}

export const ImportPreviewModal: React.FC<ImportPreviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  plan,
  code,
}) => {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full glass-pill text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-brand-lime text-slate-950 flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
            D
          </div>
          <div>
            <h3 className="text-lg font-normal text-slate-900 dark:text-white leading-tight">
              พรีวิวก่อนนำเข้าแผน
            </h3>
            <p className="text-xs text-slate-400 font-extralight mt-0.5">
              รหัสแผน: <span className="font-mono font-medium text-emerald-600 dark:text-brand-lime tracking-widest">{code}</span>
            </p>
          </div>
        </div>

        {/* Replacement Warning */}
        <div className="glass-panel border-amber-500/40 rounded-2xl p-3.5 mb-4 flex items-start gap-2.5 text-amber-800 dark:text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="font-light leading-relaxed">
            เมื่อยืนยันนำเข้า แผนงบประมาณนี้จะ<strong className="font-medium text-amber-900 dark:text-amber-100"> บันทึกแทนที่แผนปัจจุบัน</strong> บนอุปกรณ์นี้
          </p>
        </div>

        {/* Key Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="glass-panel p-3.5 rounded-2xl">
            <span className="text-[11px] font-extralight text-slate-400 flex items-center gap-1.5 mb-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-lime" />
              เงินก้อนตั้งต้น
            </span>
            <p
              className="text-lg font-normal text-slate-900 dark:text-white"
              title={formatFullCurrency(plan.totalFunds)}
            >
              ฿{formatCompactNumber(plan.totalFunds)}
            </p>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl">
            <span className="text-[11px] font-extralight text-slate-400 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-lime" />
              รอบเวลา
            </span>
            <p className="text-lg font-normal text-slate-900 dark:text-white">
              {plan.cycleDays} วัน
            </p>
          </div>
        </div>

        {/* Items Preview */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="font-light text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-lime" />
              รายการในแผน ({plan.items.length})
            </span>
            {plan.savingsTarget > 0 && (
              <span className="text-[11px] text-emerald-600 dark:text-brand-lime flex items-center gap-1 font-light">
                <Target className="w-3 h-3" />
                เป้าออม ฿{formatCompactNumber(plan.savingsTarget)}
              </span>
            )}
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
            {plan.items.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400 glass-panel rounded-xl font-extralight">
                ไม่มีรายการแบ่งจ่าย (มีเฉพาะเงินก้อนตั้งต้น)
              </div>
            ) : (
              plan.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs py-2 px-3 rounded-xl glass-panel"
                >
                  <span className="font-light text-slate-800 dark:text-slate-200 truncate pr-2">
                    {item.name}
                  </span>
                  <span className="font-normal text-slate-900 dark:text-white shrink-0">
                    {item.rule === 'percentage'
                      ? `${item.value}%`
                      : item.rule === 'daily'
                      ? `${item.value} บ./วัน`
                      : `฿${formatCompactNumber(item.value)}`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => onConfirm(plan)}
            className="w-full py-3 px-4 bg-brand-lime hover:bg-brand-mint text-slate-950 font-medium text-xs rounded-full flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>ยืนยันนำเข้าแผนนี้</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 glass-pill text-slate-400 hover:text-slate-600 dark:hover:text-white font-extralight text-xs rounded-full transition cursor-pointer"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};
