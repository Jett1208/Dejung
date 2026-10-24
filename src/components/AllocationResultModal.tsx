import React, { useState } from 'react';
import { X, Download, Copy, Check, Sparkles, AlertTriangle, Layers, Calendar, Wallet } from 'lucide-react';
import type { AllocationItem, CalculationSummary, ItemCalculation } from '../domain/types';
import { generateSummaryText, downloadSlipImage } from '../utils/slipGenerator';
import { formatCompactNumber, formatFullCurrency } from '../utils/numberFormat';

interface AllocationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalFunds: number;
  cycleDays: number;
  items: AllocationItem[];
  itemSummaries: ItemCalculation[];
  summary: CalculationSummary;
  savingsTarget?: number;
  currentSavings?: number;
}

export const AllocationResultModal: React.FC<AllocationResultModalProps> = ({
  isOpen,
  onClose,
  totalFunds,
  cycleDays,
  items,
  itemSummaries,
  summary,
  savingsTarget,
  currentSavings,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const summaryMap = new Map<string, ItemCalculation>(itemSummaries.map((s) => [s.id, s]));

  const slipData = {
    totalFunds,
    cycleDays,
    items,
    itemSummaries,
    summary,
    savingsTarget,
    currentSavings,
  };

  const handleCopy = async () => {
    try {
      const text = generateSummaryText(slipData);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadSlipImage(slipData);
    } finally {
      setDownloading(false);
    }
  };

  const todayStr = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="glass-panel rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full glass-pill text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
          title="ปิดหน้าต่าง"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Slip Header */}
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-brand-lime text-slate-950 flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            D
          </div>
          <div>
            <h3 className="text-lg font-normal text-slate-900 dark:text-white leading-tight">
              สลิปสรุปผลการจัดสรรงบ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-extralight mt-0.5">
              Dejung • {todayStr}
            </p>
          </div>
        </div>

        {/* Over-allocation Alert if any */}
        {summary.isOverAllocated && (
          <div className="glass-panel border-rose-500/40 rounded-2xl p-3.5 mb-4 flex items-start gap-2.5 text-rose-800 dark:text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span
                className="font-normal block"
                title={formatFullCurrency(summary.overAllocatedAmount)}
              >
                จัดสรรเกินงบไป ฿{formatCompactNumber(summary.overAllocatedAmount)} บาท
              </span>
              <span className="font-extralight text-rose-600/80 dark:text-rose-400/80">
                แนะนำให้ปรับลดรายการลงเพื่อให้มีเงินกินใช้อิสระต่อวัน
              </span>
            </div>
          </div>
        )}

        {/* 3-Col Quick Stats Card */}
        <div className="glass-panel rounded-2xl p-3.5 sm:p-4 mb-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-[11px] font-extralight text-slate-400 block mb-0.5 flex items-center justify-center gap-1">
              <Wallet className="w-3 h-3 text-emerald-600 dark:text-brand-lime" />
              เงินก้อนตั้งต้น
            </span>
            <span
              className="text-sm sm:text-base font-normal text-slate-900 dark:text-white"
              title={formatFullCurrency(totalFunds)}
            >
              ฿{formatCompactNumber(totalFunds)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-extralight text-slate-400 block mb-0.5 flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-600 dark:text-brand-lime" />
              รอบเวลา
            </span>
            <span className="text-sm sm:text-base font-normal text-slate-900 dark:text-white">
              {cycleDays} วัน
            </span>
          </div>
          <div>
            <span className="text-[11px] font-extralight text-slate-400 block mb-0.5 flex items-center justify-center gap-1">
              <Layers className="w-3 h-3 text-emerald-600 dark:text-brand-lime" />
              แบ่งจ่ายแล้ว
            </span>
            <span
              className="text-sm sm:text-base font-normal text-slate-900 dark:text-white"
              title={formatFullCurrency(summary.totalAllocated)}
            >
              ฿{formatCompactNumber(summary.totalAllocated)}
            </span>
          </div>
        </div>

        {/* Hero Highlight Card: Free Daily Allowance & Remaining */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-4 ring-1 ring-brand-lime/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-light text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-lime" />
              เงินกินใช้อิสระเฉลี่ยต่อวัน
            </span>
            <span className="text-[11px] font-extralight text-slate-400">
              {summary.isOverAllocated ? 'งบเกิน' : 'เงินคงเหลือ'}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <div
              className="text-2xl sm:text-3xl font-medium text-emerald-600 dark:text-brand-lime"
              title={formatFullCurrency(summary.freeDailyAllowance)}
            >
              {summary.isOverAllocated ? (
                <span className="text-rose-500 text-xl font-normal">0 ฿/วัน</span>
              ) : (
                `฿${formatCompactNumber(Math.round(summary.freeDailyAllowance))} บ./วัน`
              )}
            </div>

            <div
              title={formatFullCurrency(summary.unallocatedBalance)}
              className={`text-base sm:text-lg font-normal ${
                summary.isOverAllocated ? 'text-rose-500' : 'text-slate-900 dark:text-white'
              }`}
            >
              {summary.isOverAllocated ? '-' : ''}฿{formatCompactNumber(Math.abs(summary.unallocatedBalance))}
            </div>
          </div>

          <p className="text-[11px] font-extralight text-slate-400 dark:text-slate-400 mt-2">
            {summary.isOverAllocated
              ? 'ไม่มียอดเงินคงเหลือสำหรับกินใช้อิสระ'
              : 'เงินกินใช้ ช้อปปิ้ง หรือจ่ายนอกแผนได้ต่อวัน โดยไม่กระทบค่าใช้จ่ายคงที่ที่ตั้งไว้'}
          </p>
          <p className="text-[10px] font-extralight text-slate-400/80 dark:text-slate-500 mt-1 border-t border-white/5 pt-1.5">
            * คำนวณตามแผนที่คุณตั้งไว้เพื่อจำลองการจัดสรร • ไม่มีการตัดเงินหรือย้ายเงินจริงระหว่างบัญชี
          </p>
        </div>

        {/* Items List Section */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-light text-slate-600 dark:text-slate-300">
              รายการที่แบ่งไว้ในรอบนี้
            </span>
            <span className="text-xs font-extralight text-slate-400">
              {items.length} รายการ
            </span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-5 glass-panel rounded-2xl text-xs font-extralight text-slate-400">
              ยังไม่มีรายการแบ่งจ่าย
            </div>
          ) : (
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {items.map((item) => {
                const calc = summaryMap.get(item.id)?.calculatedAmount ?? 0;
                const ruleText =
                  item.rule === 'daily'
                    ? item.selectedDays
                      ? `${item.value} บ./วัน × ${item.selectedDays.filter(Boolean).length} วัน`
                      : `${item.value} บ./วัน`
                    : item.rule === 'percentage'
                    ? `${item.value}%`
                    : 'คงที่';

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs py-2 px-3 rounded-xl glass-panel"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="font-light text-slate-800 dark:text-slate-200 truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-extralight text-slate-400">
                        ({ruleText}){item.isSavings ? ' • ออม' : ''}
                      </span>
                    </div>
                    <span
                      className="font-normal text-slate-900 dark:text-white shrink-0"
                      title={formatFullCurrency(calc)}
                    >
                      ฿{formatCompactNumber(calc)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons: Download Slip, Copy Text, Close */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Download Slip PNG Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="py-2.5 px-4 bg-brand-lime hover:bg-brand-mint text-slate-950 rounded-full text-xs font-medium flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'กำลังสร้างรูปสลิป...' : 'บันทึกรูปสลิป (PNG)'}</span>
            </button>

            {/* Copy Summary Text Button */}
            <button
              onClick={handleCopy}
              className="glass-pill py-2.5 px-4 rounded-full text-xs font-light text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-brand-lime" />
                  <span className="text-emerald-600 dark:text-brand-lime font-normal">คัดลอกข้อความแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอกข้อความสรุป</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 glass-pill text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full text-xs font-extralight transition"
          >
            ปิดหน้าต่าง / กลับไปแก้ไขต่อ
          </button>
        </div>
      </div>
    </div>
  );
};
