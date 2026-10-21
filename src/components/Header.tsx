import React, { useState } from 'react';
import { WalletCards, RotateCcw, FileText, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenExportImport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onOpenExportImport }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleConfirmReset = () => {
    onReset();
    setShowResetConfirm(false);
  };

  return (
    <>
      <header className="flex items-center justify-between py-4 px-4 md:px-0 border-b border-slate-200/80 mb-6 bg-white md:bg-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <WalletCards className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              Dejung <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-1">Planner</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">เว็บจัดสรรงบประมาณอัจฉริยะ</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExportImport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition"
            title="ส่งออก / นำเข้าข้อมูล"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">สำรองไฟล์</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100/80 rounded-xl transition"
            title="รีเซ็ตข้อมูลทั้งหมด"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">รีเซ็ต</span>
          </button>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">ต้องการรีเซ็ตข้อมูลใช่หรือไม่?</h3>
            <p className="text-xs text-slate-500 mb-5">
              ข้อมูลที่จัดสรรไว้ทั้งหมดจะถูกล้างกลับเป็นค่าเริ่มต้น กรุณาสำรองไฟล์ไว้หากต้องการเก็บข้อมูล
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
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
