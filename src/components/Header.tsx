import React, { useState } from 'react';
import { RotateCcw, FileText, AlertTriangle, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onReset: () => void;
  onOpenExportImport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onReset,
  onOpenExportImport,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleConfirmReset = () => {
    onReset();
    setShowResetConfirm(false);
  };

  return (
    <>
      <header className="flex items-center justify-between py-4 px-4 md:px-0 border-b border-slate-200/80 dark:border-midnight-border/80 mb-6 bg-white/70 dark:bg-midnight-900/70 backdrop-blur-md md:bg-transparent rounded-2xl md:rounded-none">
        <div className="flex items-center gap-3">
          {/* Brand Gen Z Logo */}
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-midnight-900/20 dark:shadow-brand-lime/10 border border-slate-200/50 dark:border-midnight-border shrink-0 hover:scale-105 transition-transform duration-300">
            <img
              src="/logo.svg"
              alt="Dejung Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                Dejung
              </h1>
              <span className="text-[10px] font-bold text-slate-900 bg-brand-lime px-2 py-0.5 rounded-full shadow-xs">
                Gen Z Planner
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 font-medium mt-0.5">
              เว็บจัดสรรงบประมาณอัจฉริยะ 3D
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center w-8 h-8 text-slate-600 dark:text-brand-lime bg-white dark:bg-midnight-card hover:bg-slate-100 dark:hover:bg-midnight-border border border-slate-200 dark:border-midnight-border rounded-xl shadow-xs transition"
            title={isDark ? 'เปลี่ยนเป็นโหมดสว่าง (Light Mode)' : 'เปลี่ยนเป็นโหมดมืด (Dark Mode)'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-brand-lime" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Export/Import Backup */}
          <button
            onClick={onOpenExportImport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-midnight-card hover:bg-slate-50 dark:hover:bg-midnight-border border border-slate-200 dark:border-midnight-border rounded-xl shadow-xs transition"
            title="ส่งออก / นำเข้าข้อมูล"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">สำรองไฟล์</span>
          </button>

          {/* Reset Plan */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100/80 dark:hover:bg-rose-900/60 border border-transparent dark:border-rose-900/40 rounded-xl transition"
            title="รีเซ็ตข้อมูลทั้งหมด"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">รีเซ็ต</span>
          </button>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-midnight-card border border-slate-100 dark:border-midnight-border rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              ต้องการรีเซ็ตข้อมูลใช่หรือไม่?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              ข้อมูลที่จัดสรรไว้ทั้งหมดจะถูกล้างกลับเป็นค่าเริ่มต้น กรุณาสำรองไฟล์ไว้หากต้องการเก็บข้อมูล
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-midnight-border hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                ยืนยันการรีเซ็ต
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
