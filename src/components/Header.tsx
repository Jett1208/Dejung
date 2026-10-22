import React, { useState } from 'react';
import { RotateCcw, FileText, AlertTriangle, Sun, Moon, Settings } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onReset: () => void;
  onOpenExportImport: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onReset,
  onOpenExportImport,
  onOpenSettings,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleConfirmReset = () => {
    onReset();
    setShowResetConfirm(false);
  };

  return (
    <>
      <header className="flex items-center justify-between py-3.5 px-4 sm:px-6 mb-7 glass-panel rounded-full sticky top-[max(0.5rem,env(safe-area-inset-top))] z-30 shadow-md backdrop-blur-xl">
        {/* Brand Logo & Clean Title */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Dejung Logo"
            className="w-9 h-9 rounded-xl object-cover shadow-sm hover:scale-105 transition-transform"
          />

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-normal tracking-tight text-slate-900 dark:text-white leading-none">
              Dejung
            </h1>
          </div>
        </div>

        {/* Action Controls (Glass Pills) */}
        <div className="flex items-center gap-2">
          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center w-9 h-9 text-slate-700 dark:text-[rgba(255,248,240,0.9)] glass-pill"
            title="ตั้งค่าระบบ"
            aria-label="ตั้งค่าระบบ"
          >
            <Settings className="w-4 h-4 text-slate-700 dark:text-[rgba(255,248,240,0.9)]" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center w-9 h-9 text-slate-700 dark:text-[rgba(255,248,240,0.9)] glass-pill"
            title={isDark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-brand-lime" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Backup File Button */}
          <button
            onClick={onOpenExportImport}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-light text-slate-700 dark:text-[rgba(255,248,240,0.9)] glass-pill"
            title="ส่งออก / นำเข้าข้อมูล"
          >
            <FileText className="w-3.5 h-3.5 opacity-70" />
            <span className="hidden sm:inline">สำรองไฟล์</span>
          </button>

          {/* Reset Plan Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-light text-rose-600 dark:text-rose-400 glass-pill hover:bg-rose-500/10 hover:border-rose-400/30"
            title="รีเซ็ตข้อมูลทั้งหมด"
          >
            <RotateCcw className="w-3.5 h-3.5 opacity-80" />
            <span className="hidden sm:inline">รีเซ็ต</span>
          </button>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-normal text-slate-900 dark:text-white mb-1">
              ต้องการรีเซ็ตข้อมูลใช่หรือไม่?
            </h3>
            <p className="text-xs font-light text-slate-500 dark:text-[rgba(255,235,210,0.65)] mb-5">
              ข้อมูลที่จัดสรรไว้ทั้งหมดจะถูกล้างกลับเป็นค่าเริ่มต้น กรุณาสำรองไฟล์ไว้หากต้องการเก็บข้อมูล
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 glass-pill text-xs font-light"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-normal rounded-full transition shadow-sm"
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
