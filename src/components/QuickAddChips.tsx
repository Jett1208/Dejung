import React from 'react';
import { Plus, Utensils, Fuel, Coffee, PiggyBank } from 'lucide-react';
import { AllocationItem, AllocationRule } from '../domain/types';

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
      color: 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200',
    },
    {
      label: 'ค่าน้ำมัน',
      icon: Fuel,
      rule: 'fixed' as AllocationRule,
      defaultVal: 1500,
      isSavings: false,
      color: 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200',
    },
    {
      label: 'ค่ากาแฟ',
      icon: Coffee,
      rule: 'daily' as AllocationRule,
      defaultVal: 60,
      isSavings: false,
      color: 'hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200',
    },
    {
      label: 'เงินออม',
      icon: PiggyBank,
      rule: 'percentage' as AllocationRule,
      defaultVal: 20,
      isSavings: true,
      color: 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200',
    },
  ];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
              className={`flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition shrink-0 shadow-xs ${chip.color}`}
            >
              <Plus className="w-3 h-3 text-slate-400" />
              <Icon className="w-3.5 h-3.5" />
              <span>{chip.label}</span>
              <span className="text-[10px] text-slate-400 font-normal">
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
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/80 rounded-xl text-xs font-bold text-emerald-800 transition shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>เพิ่มเอง</span>
        </button>
      </div>
    </div>
  );
};
