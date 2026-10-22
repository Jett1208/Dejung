import React from 'react';
import { Plus, Utensils, Fuel, PiggyBank } from 'lucide-react';
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
    },
    {
      label: 'ค่าน้ำมัน',
      icon: Fuel,
      rule: 'fixed' as AllocationRule,
      defaultVal: 1500,
      isSavings: false,
    },
    {
      label: 'เงินออม',
      icon: PiggyBank,
      rule: 'percentage' as AllocationRule,
      defaultVal: 20,
      isSavings: true,
    },
  ];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-light text-slate-500 dark:text-slate-400 tracking-wide">
          เพิ่มรายการด่วน
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
              className="glass-pill flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-light text-slate-700 dark:text-slate-200 transition shrink-0 hover:text-slate-900 dark:hover:text-white"
            >
              <Plus className="w-3 h-3 text-slate-400" />
              <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-lime" />
              <span className="font-normal">{chip.label}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extralight">
                ({chip.rule === 'daily' ? 'รายวัน' : chip.rule === 'percentage' ? '%' : 'คงที่'})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
