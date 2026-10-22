import React, { useEffect } from 'react';
import { X, Sparkles, Target, Layers, Box, RotateCcw, Sliders } from 'lucide-react';
import type { AppSettings } from '../hooks/useAppSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onResetSettings: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSetting,
  onResetSettings,
}) => {
  // ESC key listener to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-panel rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/5 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-lime/15 text-emerald-600 dark:text-brand-lime flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 id="settings-modal-title" className="text-base font-normal text-slate-900 dark:text-white leading-tight">
                ตั้งค่าระบบ (Settings)
              </h3>
              <p className="text-xs font-light text-slate-500 dark:text-[rgba(255,235,210,0.65)]">
                ปรับแต่งการแสดงผลและลูกเล่นของ Dejung
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-white/10 transition"
            aria-label="ปิดหน้าต่างตั้งค่า"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Setting Items */}
        <div className="space-y-3.5 mb-6">
          {/* Toggle 1: Animations */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-3 pr-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-brand-lime flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-normal text-slate-900 dark:text-white">
                  แอนิเมชันและการเคลื่อนไหว (60fps Motion)
                </p>
                <p className="text-[11px] font-extralight text-slate-500 dark:text-slate-400">
                  เอฟเฟกต์การเปิดการ์ด และแรงตอบสนองสัมผัสของปุ่ม
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.enableAnimations}
              onClick={() => onUpdateSetting('enableAnimations', !settings.enableAnimations)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.enableAnimations ? 'bg-brand-lime' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.enableAnimations ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Savings Goal */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-3 pr-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-500 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                <Target className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-normal text-slate-900 dark:text-white">
                  เป้าหมายเงินออม (Savings Goal)
                </p>
                <p className="text-[11px] font-extralight text-slate-500 dark:text-slate-400">
                  แสดงการ์ดคำนวณเป้าหมายเงินออมและจำลองระยะเวลาสะสม
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.showSavingsGoal}
              onClick={() => onUpdateSetting('showSavingsGoal', !settings.showSavingsGoal)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.showSavingsGoal ? 'bg-brand-lime' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.showSavingsGoal ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 3: Categories List */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-3 pr-2">
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 text-violet-500 dark:text-violet-400 flex items-center justify-center shrink-0 mt-0.5">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-normal text-slate-900 dark:text-white">
                  รายการแบ่งจ่าย (Allocation Categories)
                </p>
                <p className="text-[11px] font-extralight text-slate-500 dark:text-slate-400">
                  แสดงรายการค่าใช้จ่ายและหมวดหมู่การจัดสรรทั้งหมด
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.showCategories}
              onClick={() => onUpdateSetting('showCategories', !settings.showCategories)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.showCategories ? 'bg-brand-lime' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.showCategories ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 4: 3D Ambient Background */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-3 pr-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Box className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-normal text-slate-900 dark:text-white">
                  พื้นหลัง 3 มิติขยับได้ (3D Ambient Particles)
                </p>
                <p className="text-[11px] font-extralight text-slate-500 dark:text-slate-400">
                  แสดงละอองแสงอนุภาค 3D สีเขียวพลิ้วไหวในพื้นหลัง
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.enable3DBackground}
              onClick={() => onUpdateSetting('enable3DBackground', !settings.enable3DBackground)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.enable3DBackground ? 'bg-brand-lime' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.enable3DBackground ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetSettings}
            className="flex items-center gap-1.5 text-xs font-extralight text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>คืนค่าเริ่มต้น</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-brand-lime hover:bg-brand-mint text-slate-950 rounded-full text-xs font-medium transition shadow-sm active:scale-95"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  );
};
