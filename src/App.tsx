import { useState } from 'react';
import { useBudgetPlanner } from './hooks/useBudgetPlanner';
import { Header } from './components/Header';
import { SetupCard } from './components/SetupCard';
import { CategoryList } from './components/CategoryList';
import { SavingsGoalCard } from './components/SavingsGoalCard';
import { SummaryDashboard } from './components/SummaryDashboard';
import { StickyBottomBar } from './components/StickyBottomBar';
import { ExportImportModal } from './components/ExportImportModal';

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

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 pb-28 lg:pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <Header
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
          </main>

          {/* Right Column: Visual Summary Dashboard (Desktop Sticky) */}
          <aside className="hidden lg:block lg:col-span-5 xl:col-span-5 sticky top-6">
            <SummaryDashboard summary={summary} items={state.items} />
          </aside>
        </div>
      </div>

      {/* Mobile / iPad Sticky Bottom Summary Bar */}
      <StickyBottomBar summary={summary} items={state.items} />

      {/* Export / Import JSON Modal */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        exportJSON={exportJSON}
        importJSON={importJSON}
      />
    </div>
  );
}

export default App;
