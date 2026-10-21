import React from 'react';
import { Layers, PlusCircle, Inbox } from 'lucide-react';
import { AllocationItem, ItemCalculation } from '../domain/types';
import { CategoryItem } from './CategoryItem';
import { QuickAddChips } from './QuickAddChips';

interface CategoryListProps {
  items: AllocationItem[];
  itemSummaries: ItemCalculation[];
  cycleDays: number;
  totalFunds: number;
  onAddItem: (item: Omit<AllocationItem, 'id'>) => void;
  onUpdateItem: (id: string, updates: Partial<AllocationItem>) => void;
  onRemoveItem: (id: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  items,
  itemSummaries,
  cycleDays,
  totalFunds,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}) => {
  const summaryMap = new Map<string, ItemCalculation>(
    itemSummaries.map((s) => [s.id, s])
  );

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
            3
          </span>
          <Layers className="w-4 h-4 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">
            รายการแบ่งจ่าย (Allocation Items)
          </h2>
          <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
            {items.length} รายการ
          </span>
        </div>
      </div>

      {/* Quick-Add Chips */}
      <QuickAddChips onAdd={onAddItem} />

      {/* Categories Rows */}
      {items.length === 0 ? (
        <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600 mb-1">ยังไม่มีรายการแบ่งจ่าย</p>
          <p className="text-xs text-slate-400 mb-3">
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
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
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
