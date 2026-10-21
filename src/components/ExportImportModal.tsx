import React, { useState } from 'react';
import { X, Download, Upload, Copy, Check, AlertCircle } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportJSON: () => string;
  importJSON: (jsonString: string) => boolean;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  exportJSON,
  importJSON,
}) => {
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const jsonContent = exportJSON();

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dejung-budget-plan-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    setError(null);
    setSuccessMsg(null);
    if (!importText.trim()) {
      setError('กรุณาวางโค้ด JSON ก่อนนำเข้า');
      return;
    }

    const ok = importJSON(importText);
    if (ok) {
      setSuccessMsg('นำเข้าแผนงบประมาณสำเร็จเรียบร้อย!');
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
        setImportText('');
      }, 1200);
    } else {
      setError('รูปแบบไฟล์ JSON ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-midnight-card border border-slate-100 dark:border-midnight-border rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-midnight-border text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          จัดการข้อมูลและสำรองไฟล์
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          ส่งออกข้อมูลเพื่อเก็บไว้สำรอง หรือนำเข้าแผนงบประมาณจากเครื่องอื่น
        </p>

        {/* Export Section */}
        <div className="mb-6 bg-slate-50 dark:bg-midnight-950/70 p-4 rounded-2xl border border-slate-200 dark:border-midnight-border">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
            <span>ส่งออกแผนปัจจุบัน (Export)</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            บันทึกแผนของคุณเป็นไฟล์ .json หรือคัดลอกข้อความ
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-brand-lime dark:hover:bg-brand-mint text-white dark:text-slate-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              ดาวน์โหลดไฟล์ .json
            </button>
            <button
              onClick={handleCopy}
              className="py-2 px-3 bg-white dark:bg-midnight-card border border-slate-200 dark:border-midnight-border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-lime" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'คัดลอกแล้ว' : 'คัดลอก JSON'}
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-slate-50 dark:bg-midnight-950/70 p-4 rounded-2xl border border-slate-200 dark:border-midnight-border">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
            <span>นำเข้าแผนงบประมาณ (Import)</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            อัปโหลดไฟล์ .json หรือวางข้อมูล JSON ในช่องด้านล่าง
          </p>

          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 dark:file:bg-midnight-border file:text-emerald-800 dark:file:text-brand-lime hover:file:bg-emerald-200 mb-3"
          />

          <textarea
            rows={4}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="วางโค้ด JSON ที่นี่..."
            className="w-full p-2.5 text-xs font-mono bg-white dark:bg-midnight-950 border border-slate-200 dark:border-midnight-border text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-brand-lime mb-3"
          />

          {error && (
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs mb-3 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-brand-lime text-xs mb-3 font-medium">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            onClick={handleImportSubmit}
            className="w-full py-2.5 bg-slate-900 dark:bg-brand-lime hover:bg-slate-800 dark:hover:bg-brand-mint text-white dark:text-slate-900 rounded-xl text-xs font-bold transition shadow-sm"
          >
            ยืนยันการนำเข้าข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
};
