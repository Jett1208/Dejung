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
    <div className="fixed inset-0 z-50 bg-slate-950/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full glass-pill text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-normal text-slate-900 dark:text-white mb-1">
          จัดการข้อมูลและสำรองไฟล์
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-extralight mb-5">
          ส่งออกข้อมูลเพื่อเก็บไว้สำรอง หรือนำเข้าแผนงบประมาณจากเครื่องอื่น
        </p>

        {/* Export Section */}
        <div className="mb-5 glass-panel rounded-2xl p-4">
          <h4 className="text-sm font-normal text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
            <span>ส่งออกแผนปัจจุบัน</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-extralight mb-3">
            บันทึกแผนของคุณเป็นไฟล์ .json หรือคัดลอกข้อความ
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-2 px-4 bg-brand-lime hover:bg-brand-mint text-slate-950 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              ดาวน์โหลดไฟล์ .json
            </button>
            <button
              onClick={handleCopy}
              className="glass-pill py-2 px-4 rounded-full text-xs font-light text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-lime" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'คัดลอกแล้ว' : 'คัดลอก JSON'}
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="glass-panel rounded-2xl p-4">
          <h4 className="text-sm font-normal text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
            <span>นำเข้าแผนงบประมาณ</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-extralight mb-2.5">
            อัปโหลดไฟล์ .json หรือวางข้อมูล JSON ในช่องด้านล่าง
          </p>

          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-light file:bg-white/20 dark:file:bg-white/10 file:text-slate-700 dark:file:text-brand-lime hover:file:bg-white/30 mb-3 cursor-pointer"
          />

          <textarea
            rows={4}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="วางโค้ด JSON ที่นี่..."
            className="glass-input w-full p-3 text-xs font-mono rounded-2xl mb-3 text-slate-900 dark:text-white"
          />

          {error && (
            <div className="flex items-center gap-1.5 text-rose-500 text-xs mb-3 font-light">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-1.5 text-emerald-500 dark:text-brand-lime text-xs mb-3 font-light">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            onClick={handleImportSubmit}
            className="w-full py-2.5 bg-brand-lime hover:bg-brand-mint text-slate-950 rounded-full text-xs font-medium transition shadow-sm"
          >
            ยืนยันการนำเข้าข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
};
