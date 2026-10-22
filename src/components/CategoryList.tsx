import React from 'react';
import { Layers, PlusCircle, Inbox, Plus } from 'lucide-react';
import type { AllocationItem, ItemCalculation } from '../domain/types';
import { CategoryItem } from './CategoryItem';
import { QuickAddChips } from './QuickAddChips';

interface CategoryListProps {
  items: AllocationItem[];
  itemSummaries: ItemCalculation[];
  cycleDays: number;
  totalFunds?: number;
  onAddItem: (item: Omit<AllocationItem, 'id'>) => void;
  onUpdateItem: (id: string, updates: Partial<AllocationItem>) => void;
  onRemoveItem: (id: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  items,
  itemSummaries,
  cycleDays,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}) => {
  const summaryMap = new Map<string, ItemCalculation>(
    itemSummaries.map((s) => [s.id, s])
  );

  return (
    <div className="glass-panel rounded-3xl p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-brand-lime text-slate-950 flex items-center justify-center text-xs font-medium shadow-xs">
            3
          </span>
          <Layers className="w-4 h-4 text-emerald-600 dark:text-brand-lime" />
          <h2 className="text-base font-normal text-slate-900 dark:text-white">
            รายการแบ่งจ่าย
          </h2>
          <span className="glass-pill text-xs text-slate-600 dark:text-slate-300 font-light px-2.5 py-0.5 rounded-full">
            {items.length} รายการ
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            onAddItem({
              name: 'ค่าใช้จ่ายใหม่',
              rule: 'daily',
              value: 100,
              isSavings: false,
            })
          }
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-lime hover:bg-brand-mint text-slate-950 font-medium rounded-full text-xs transition shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>เพิ่ม</span>
        </button>
      </div>

      {/* Quick-Add Chips */}
      <QuickAddChips onAdd={onAddItem} />

      {/* Categories Rows */}
      {items.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-white/10">
          <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-light text-slate-600 dark:text-slate-300 mb-1">
            ยังไม่มีรายการแบ่งจ่าย
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-extralight mb-3">
            แตะปุ่มลัดด้านบน เช่น "+ ค่าข้าว" หรือ "+ ค่าน้ำมัน" เพื่อเริ่มเพิ่มรายการได้เลย
          </p>
          <button
            type="button"
            onClick={() =>
              onAddItem({
                name: 'ค่าอาหาร',
                rule: 'daily',
                value: 150,
                isSavings: false,
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-lime hover:bg-brand-mint text-slate-950 rounded-full text-xs font-medium shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>เพิ่มรายการแรก</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <CategoryItem
              key={item.id}
              item={item}
              summary={summaryMap.get(item.id)}
              cycleDays={cycleDays}
              onUpdate={(updates) => onUpdateItem(item.id, updates)}
              onRemove={() => onRemoveItem(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
