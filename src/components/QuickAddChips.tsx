import React from 'react';
import { Plus, Utensils, Fuel, Coffee, PiggyBank } from 'lucide-react';
import type { AllocationItem, AllocationRule } from '../domain/types';

interface QuickAddChipsProps {
  onAdd: (item: Omit<AllocationItem, 'id'>) => void;
}

export const QuickAddChips: React.FC<QuickAddChipsProps> = ({ onAdd }) => {
  const chips = [
    {
      label: 'ค่าข้าว',
      icon: Utensils,
      rule: 'daily' as AllocationRule,
      defaultVal: 150,
      isSavings: false,
      color: 'hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40 dark:hover:text-amber-300 dark:hover:border-amber-700/50',
    },
    {
      label: 'ค่าน้ำมัน',
      icon: Fuel,
      rule: 'fixed' as AllocationRule,
      defaultVal: 1500,
      isSavings: false,
      color: 'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 dark:hover:border-blue-700/50',
    },
    {
      label: 'ค่ากาแฟ',
      icon: Coffee,
      rule: 'daily' as AllocationRule,
      defaultVal: 60,
      isSavings: false,
      color: 'hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-950/40 dark:hover:text-orange-300 dark:hover:border-orange-700/50',
    },
    {
      label: 'เงินออม',
      icon: PiggyBank,
      rule: 'percentage' as AllocationRule,
      defaultVal: 20,
      isSavings: true,
      color: 'hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-brand-lime dark:hover:border-brand-lime/40',
    },
  ];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          ปุ่มลัดเพิ่มรายการเร็ว (Quick Add)
        </span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        {chips.map((chip) => {
          const Icon = chip.icon;
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() =>
                onAdd({
                  name: chip.label,
                  rule: chip.rule,
                  value: chip.defaultVal,
                  isSavings: chip.isSavings,
                })
              }
              className={`flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-midnight-950/90 border border-slate-200 dark:border-midnight-border rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition shrink-0 shadow-xs ${chip.color}`}
            >
              <Plus className="w-3 h-3 text-slate-400" />
              <Icon className="w-3.5 h-3.5" />
              <span>{chip.label}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                ({chip.rule === 'daily' ? 'รายวัน' : chip.rule === 'percentage' ? '%' : 'คงที่'})
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() =>
            onAdd({
              name: 'ค่าใช้จ่ายใหม่',
              rule: 'daily',
              value: 100,
              isSavings: false,
            })
          }
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 rounded-xl text-xs font-bold text-emerald-800 dark:text-brand-mint transition shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>เพิ่มเอง</span>
        </button>
      </div>
    </div>
  );
};
