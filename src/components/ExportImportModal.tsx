import React, { useState } from 'react';
import { X, Download, Upload, Copy, Check, AlertCircle, KeyRound, FileCode, Sparkles, Loader2 } from 'lucide-react';
import type { BudgetState } from '../domain/types';
import { savePlanToCloud, loadPlanFromCloud, sanitizeShareCode } from '../utils/shareCode';
import { ImportPreviewModal } from './ImportPreviewModal';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportJSON: () => string;
  importJSON: (jsonString: string) => boolean;
  budgetState: BudgetState;
  onApplyPlan: (state: BudgetState) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  exportJSON,
  importJSON,
  budgetState,
  onApplyPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'json'>('code');

  // 6-Character Share Code State
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [isFetchingCode, setIsFetchingCode] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeSuccessMsg, setCodeSuccessMsg] = useState<string | null>(null);

  // Safety Preview Modal State
  const [previewPlan, setPreviewPlan] = useState<BudgetState | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewCode, setPreviewCode] = useState('');

  // Legacy JSON State
  const [importText, setImportText] = useState('');
  const [jsonCopied, setJsonCopied] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonSuccessMsg, setJsonSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const jsonContent = exportJSON();

  // Handle 6-character Code Export
  const handleGenerateCode = async () => {
    setIsGenerating(true);
    setCodeError(null);
    try {
      const res = await savePlanToCloud(budgetState);
      if (res.success && res.code) {
        setGeneratedCode(res.code);
      } else {
        setCodeError(res.error || 'เกิดข้อผิดพลาดในการสร้างรหัส');
      }
    } catch {
      setCodeError('ไม่สามารถเชื่อมต่อคลาวด์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Handle 6-character Code Import
  const handleFetchCode = async () => {
    setCodeError(null);
    setCodeSuccessMsg(null);
    const clean = sanitizeShareCode(inputCode);
    if (clean.length !== 6) {
      setCodeError('กรุณากรอกรหัสตัวอักษร 6 หลักให้ครบถ้วน');
      return;
    }

    setIsFetchingCode(true);
    try {
      const res = await loadPlanFromCloud(clean);
      if (res.success && res.state) {
        setPreviewPlan(res.state);
        setPreviewCode(clean);
        setIsPreviewOpen(true);
      } else {
        setCodeError(res.error || 'ไม่พบแผนงบประมาณสำหรับรหัสนี้');
      }
    } catch {
      setCodeError('เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาตรวจสอบรหัสอีกครั้ง');
    } finally {
      setIsFetchingCode(false);
    }
  };

  // Confirm Safety Preview
  const handleConfirmPreview = (state: BudgetState) => {
    onApplyPlan(state);
    setIsPreviewOpen(false);
    setPreviewPlan(null);
    setCodeSuccessMsg('นำเข้าแผนงบประมาณสำเร็จเรียบร้อย!');
    setTimeout(() => {
      setCodeSuccessMsg(null);
      setInputCode('');
      onClose();
    }, 1200);
  };

  // Handle JSON Copy/Download
  const handleCopyJSON = () => {
    navigator.clipboard.writeText(jsonContent);
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dejung-budget-plan-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSONSubmit = () => {
    setJsonError(null);
    setJsonSuccessMsg(null);
    if (!importText.trim()) {
      setJsonError('กรุณาวางโค้ด JSON ก่อนนำเข้า');
      return;
    }

    const ok = importJSON(importText);
    if (ok) {
      setJsonSuccessMsg('นำเข้าแผนงบประมาณสำเร็จเรียบร้อย!');
      setTimeout(() => {
        onClose();
        setJsonSuccessMsg(null);
        setImportText('');
      }, 1200);
    } else {
      setJsonError('รูปแบบไฟล์ JSON ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
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
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/50 dark:bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
        <div className="glass-panel rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-2 rounded-full glass-pill text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-normal text-slate-900 dark:text-white mb-1">
            จัดการข้อมูลและสำรองแผน
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-extralight mb-4">
            แชร์แผนข้ามอุปกรณ์ด้วยรหัสด่วน หรือสำรองเป็นไฟล์ JSON
          </p>

          {/* Navigation Tabs */}
          <div className="flex gap-2 p-1 glass-panel rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-normal flex items-center justify-center gap-1.5 transition ${
                activeTab === 'code'
                  ? 'bg-brand-lime text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>รหัสแชร์ 6 หลัก (ด่วน)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-normal flex items-center justify-center gap-1.5 transition ${
                activeTab === 'json'
                  ? 'bg-brand-lime text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>ไฟล์ JSON (ถาวร)</span>
            </button>
          </div>

          {/* TAB 1: 6-Character Share Code */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              {/* Export with 6-char code */}
              <div className="glass-panel rounded-2xl p-4">
                <h4 className="text-sm font-normal text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
                  <span>ส่งออกแผนเป็นรหัส 6 หลัก</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-extralight mb-3">
                  สร้างรหัสสั้นๆ 6 ตัว เพื่อนำไปพิมพ์เปิดบน iPad หรือส่งต่อให้เพื่อนได้ง่ายทันที
                </p>

                {generatedCode ? (
                  <div className="animate-in fade-in duration-300">
                    {/* Stylized OTP boxes */}
                    <div className="flex justify-center gap-2 my-3">
                      {generatedCode.split('').map((char, i) => (
                        <div
                          key={i}
                          className="w-10 h-12 rounded-xl bg-brand-lime/10 border border-brand-lime/50 text-emerald-600 dark:text-brand-lime font-mono font-bold text-xl flex items-center justify-center shadow-xs"
                        >
                          {char}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="flex-1 py-2.5 px-4 bg-brand-lime hover:bg-brand-mint text-slate-950 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition shadow-sm"
                      >
                        {codeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{codeCopied ? 'คัดลอกรหัสแล้ว!' : 'คัดลอกรหัส 6 หลัก'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGenerateCode}
                        disabled={isGenerating}
                        className="glass-pill py-2.5 px-3 rounded-full text-xs font-light text-slate-700 dark:text-slate-300"
                        title="สร้างรหัสใหม่"
                      >
                        สุ่มรหัสใหม่
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    disabled={isGenerating}
                    className="w-full py-2.5 px-4 bg-brand-lime hover:bg-brand-mint text-slate-950 rounded-full text-xs font-medium flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>กำลังเชื่อมต่อคลาวด์และสร้างรหัส...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>กดสร้างรหัสแผน 6 หลัก (Quick Code)</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Import with 6-char code */}
              <div className="glass-panel rounded-2xl p-4">
                <h4 className="text-sm font-normal text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
                  <span>นำเข้าแผนด้วยรหัส 6 หลัก</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-extralight mb-3">
                  กรอกรหัส 6 หลักที่ได้จากเครื่องอื่นเพื่อดึงแผนมาใช้
                </p>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    maxLength={6}
                    value={inputCode}
                    onChange={(e) => setInputCode(sanitizeShareCode(e.target.value))}
                    placeholder="เช่น DJ7K9B"
                    className="glass-input flex-1 px-4 py-2 text-center font-mono font-medium text-base tracking-widest text-slate-900 dark:text-white uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleFetchCode}
                    disabled={isFetchingCode || inputCode.length !== 6}
                    className="py-2 px-5 bg-brand-lime hover:bg-brand-mint text-slate-950 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition shadow-sm disabled:opacity-40"
                  >
                    {isFetchingCode ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>ดึงแผน</span>
                  </button>
                </div>

                {codeError && (
                  <div className="flex items-center gap-1.5 text-rose-500 text-xs mb-2 font-light">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{codeError}</span>
                  </div>
                )}

                {codeSuccessMsg && (
                  <div className="flex items-center gap-1.5 text-emerald-500 dark:text-brand-lime text-xs mb-2 font-light">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{codeSuccessMsg}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Legacy JSON Mode */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              {/* Export JSON */}
              <div className="glass-panel rounded-2xl p-4">
                <h4 className="text-sm font-normal text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
                  <span>ส่งออกไฟล์สำรอง .json</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-extralight mb-3">
                  บันทึกข้อมูลเก็บไว้ในเครื่องแบบออฟไลน์ 100%
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadJSON}
                    className="flex-1 py-2 px-4 bg-brand-lime hover:bg-brand-mint text-slate-950 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    ดาวน์โหลดไฟล์ .json
                  </button>
                  <button
                    onClick={handleCopyJSON}
                    className="glass-pill py-2 px-4 rounded-full text-xs font-light text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition"
                  >
                    {jsonCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-lime" /> : <Copy className="w-3.5 h-3.5" />}
                    {jsonCopied ? 'คัดลอกแล้ว' : 'คัดลอก JSON'}
                  </button>
                </div>
              </div>

              {/* Import JSON */}
              <div className="glass-panel rounded-2xl p-4">
                <h4 className="text-sm font-normal text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
                  <span>นำเข้าแผนงบประมาณจาก JSON</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-extralight mb-2.5">
                  อัปโหลดไฟล์ .json หรือวางข้อมูล JSON
                </p>

                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-light file:bg-white/20 dark:file:bg-white/10 file:text-slate-700 dark:file:text-brand-lime hover:file:bg-white/30 mb-3 cursor-pointer"
                />

                <textarea
                  rows={3}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="วางโค้ด JSON ที่นี่..."
                  className="glass-input w-full p-3 text-xs font-mono rounded-2xl mb-3 text-slate-900 dark:text-white"
                />

                {jsonError && (
                  <div className="flex items-center gap-1.5 text-rose-500 text-xs mb-3 font-light">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{jsonError}</span>
                  </div>
                )}

                {jsonSuccessMsg && (
                  <div className="flex items-center gap-1.5 text-emerald-500 dark:text-brand-lime text-xs mb-3 font-light">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{jsonSuccessMsg}</span>
                  </div>
                )}

                <button
                  onClick={handleImportJSONSubmit}
                  className="w-full py-2.5 bg-brand-lime hover:bg-brand-mint text-slate-950 rounded-full text-xs font-medium transition shadow-sm"
                >
                  ยืนยันการนำเข้าข้อมูล JSON
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Safety Preview Modal */}
      <ImportPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onConfirm={handleConfirmPreview}
        plan={previewPlan}
        code={previewCode}
      />
    </>
  );
};
