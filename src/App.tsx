import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useBudgetPlanner } from './hooks/useBudgetPlanner';
import { Header } from './components/Header';
import { SetupCard } from './components/SetupCard';
import { CategoryList } from './components/CategoryList';
import { SavingsGoalCard } from './components/SavingsGoalCard';
import { SummaryDashboard } from './components/SummaryDashboard';
import { StickyBottomBar } from './components/StickyBottomBar';
import { ExportImportModal } from './components/ExportImportModal';
import { AllocationResultModal } from './components/AllocationResultModal';
import { Ambient3DBackground } from './components/Ambient3DBackground';

export function App() {
  const {
    state,
    summary,
    setTotalFunds,
    setCycleDays,
    addItem,
    updateItem,
    removeItem,
    setSavingsTarget,
    setCurrentSavings,
    resetPlan,
    exportJSON,
    importJSON,
  } = useBudgetPlanner();

  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  // Theme state: defaults to dark for modern midnight Gen Z aesthetics
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem('dejung_theme');
        if (stored) return stored === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch {
      // ignore
    }
    return true; // Default to sleek dark mode
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        window.localStorage.setItem('dejung_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        window.localStorage.setItem('dejung_theme', 'light');
      }
    } catch {
      // ignore
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#08090B] text-slate-800 dark:text-white pb-28 lg:pb-16 font-sans relative selection:bg-brand-lime selection:text-slate-950 transition-colors duration-300">
      {/* 3D Ambient WebGL Background Particles */}
      <Ambient3DBackground isDark={isDark} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header with Gen Z Logo & Theme Toggle */}
        <Header
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onReset={resetPlan}
          onOpenExportImport={() => setIsExportImportOpen(true)}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input and Setup */}
          <main className="lg:col-span-7 xl:col-span-7 space-y-5">
            {/* Step 1 & 2: Total Funds & Cycle Days */}
            <SetupCard
              totalFunds={state.totalFunds}
              cycleDays={state.cycleDays}
              onTotalFundsChange={setTotalFunds}
              onCycleDaysChange={setCycleDays}
            />

            {/* Step 3: Allocation Categories List */}
            <CategoryList
              items={state.items}
              itemSummaries={summary.itemSummaries}
              cycleDays={state.cycleDays}
              totalFunds={state.totalFunds}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />

            {/* Savings Goal Tracker */}
            <SavingsGoalCard
              savingsTarget={state.savingsTarget}
              currentSavings={state.currentSavings}
              totalSavingsAllocated={summary.totalSavingsAllocated}
              savingsProgressPercent={summary.savingsProgressPercent}
              savingsCyclesRequired={summary.savingsCyclesRequired}
              cycleDays={state.cycleDays}
              onSavingsTargetChange={setSavingsTarget}
              onCurrentSavingsChange={setCurrentSavings}
            />

            {/* Primary Trigger Button: View Allocation Result Slip */}
            <div className="pt-1 pb-2">
              <button
                type="button"
                onClick={() => setIsResultOpen(true)}
                className="w-full py-3.5 px-6 bg-brand-lime hover:bg-brand-mint text-slate-950 rounded-full font-medium text-sm flex items-center justify-center gap-2.5 transition shadow-lg hover:shadow-brand-lime/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>ดูสลิปสรุปผลการจัดสรรเงิน</span>
              </button>
            </div>
          </main>

          {/* Right Column: Visual Summary Dashboard with 3D Coin (Desktop Sticky) */}
          <aside className="hidden lg:block lg:col-span-5 xl:col-span-5 sticky top-6">
            <SummaryDashboard
              summary={summary}
              items={state.items}
              onOpenResult={() => setIsResultOpen(true)}
            />
          </aside>
        </div>
      </div>

      {/* Mobile / iPad Sticky Bottom Summary Bar */}
      <StickyBottomBar
        summary={summary}
        items={state.items}
        onOpenResult={() => setIsResultOpen(true)}
      />

      {/* Export / Import JSON Modal */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        exportJSON={exportJSON}
        importJSON={importJSON}
      />

      {/* Allocation Result Slip Modal */}
      <AllocationResultModal
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        totalFunds={state.totalFunds}
        cycleDays={state.cycleDays}
        items={state.items}
        itemSummaries={summary.itemSummaries}
        summary={summary}
        savingsTarget={state.savingsTarget}
        currentSavings={state.currentSavings}
      />
    </div>
  );
}

export default App;
