import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Briefcase,
  Palmtree,
  CalendarCheck,
  Eraser,
} from 'lucide-react';

/* ─────────────────── Types ─────────────────── */
interface DayCalendarGridProps {
  selectedDays: boolean[]; // 28-slot boolean array (4 weeks × 7 days)
  onChange: (days: boolean[]) => void;
}

/* ─────────────────── Constants ─────────────────── */
const DAY_HEADERS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'] as const;
const WEEK_LABELS = ['ส.1', 'ส.2', 'ส.3', 'ส.4'] as const;

/** Weekday indices across all 4 weeks */
const WEEKDAY_INDICES = [
  0, 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25,
];

/** Weekend indices across all 4 weeks */
const WEEKEND_INDICES = [5, 6, 12, 13, 19, 20, 26, 27];

/* ─────────────────── Helpers ─────────────────── */
const arraysEqual = (a: boolean[], b: boolean[]): boolean =>
  a.length === b.length && a.every((v, i) => v === b[i]);

const makePattern = (indices: number[]): boolean[] => {
  const days = new Array<boolean>(28).fill(false);
  indices.forEach((i) => (days[i] = true));
  return days;
};

const ALL_TRUE = new Array<boolean>(28).fill(true);
const ALL_FALSE = new Array<boolean>(28).fill(false);
const WEEKDAYS_PATTERN = makePattern(WEEKDAY_INDICES);
const WEEKENDS_PATTERN = makePattern(WEEKEND_INDICES);

type DragMode = 'select' | 'deselect' | null;

/* ─────────────────── Component ─────────────────── */
export const DayCalendarGrid: React.FC<DayCalendarGridProps> = ({
  selectedDays,
  onChange,
}) => {
  /* --- Drag state (refs to avoid re-renders mid-drag) --- */
  const dragMode = useRef<DragMode>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectedCount = selectedDays.filter(Boolean).length;

  /* --- Keep a live ref of selectedDays to avoid stale closures mid-drag --- */
  const daysRef = useRef(selectedDays);
  useEffect(() => {
    daysRef.current = selectedDays;
  }, [selectedDays]);

  const gridRef = useRef<HTMLDivElement>(null);
  const lastDragIndex = useRef<number>(-1);

  /* --- Pointer-drag handlers --- */
  const handlePointerDown = useCallback(
    (index: number, e: React.PointerEvent) => {
      e.preventDefault();
      // Determine paint mode based on current cell state
      dragMode.current = daysRef.current[index] ? 'deselect' : 'select';
      lastDragIndex.current = index;
      setIsDragging(true);

      // Apply immediately to the starting cell
      const next = [...daysRef.current];
      next[index] = dragMode.current === 'select';
      onChange(next);
    },
    [onChange],
  );

  /** Resolve which day-cell the pointer is over using elementFromPoint */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragMode.current) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;
      const attr = el.getAttribute('data-day-index');
      if (attr === null) return;
      const index = Number(attr);
      if (index === lastDragIndex.current) return;
      lastDragIndex.current = index;

      const next = [...daysRef.current];
      const target = dragMode.current === 'select';
      if (next[index] !== target) {
        next[index] = target;
        onChange(next);
      }
    },
    [onChange],
  );

  const handlePointerUp = useCallback(() => {
    dragMode.current = null;
    lastDragIndex.current = -1;
    setIsDragging(false);
  }, []);

  /* --- Shortcut chips definition --- */
  const shortcuts = [
    {
      label: 'จ-ศ',
      icon: Briefcase,
      pattern: WEEKDAYS_PATTERN,
    },
    {
      label: 'ส-อา',
      icon: Palmtree,
      pattern: WEEKENDS_PATTERN,
    },
    {
      label: 'ทุกวัน',
      icon: CalendarCheck,
      pattern: ALL_TRUE,
    },
    {
      label: 'ล้างทั้งหมด',
      icon: Eraser,
      pattern: ALL_FALSE,
    },
  ];

  /* --- Render --- */
  return (
    <div className="select-none">
      {/* ── Header: Title + Summary ── */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-light text-slate-500 dark:text-slate-400 tracking-wide">
          วันที่ใช้จ่าย
        </span>
        <span
          data-testid="selected-days-summary"
          className="text-xs font-light text-slate-400 dark:text-slate-500 tabular-nums"
        >
          <span
            data-testid="selected-days-count"
            className="text-brand-lime font-normal"
          >
            {selectedCount}
          </span>
          /28 วัน
        </span>
      </div>

      {/* ── Calendar Grid ── */}
      <div
        ref={gridRef}
        className="rounded-xl overflow-hidden"
        style={{ touchAction: 'none' }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Day-name header row */}
        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 mb-1">
          {/* Empty cell for week-label column */}
          <div className="w-8" />
          {DAY_HEADERS.map((day, i) => {
            const isWeekend = i >= 5;
            return (
              <div
                key={day}
                className={`text-center text-[11px] font-light pb-1 ${
                  isWeekend
                    ? 'text-brand-lime/50'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Week rows */}
        {Array.from({ length: 4 }, (_, week) => (
          <div
            key={week}
            className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 mb-1"
          >
            {/* Week label */}
            <div className="w-8 flex items-center justify-center">
              <span className="text-[10px] font-extralight text-slate-500 dark:text-slate-600">
                {WEEK_LABELS[week]}
              </span>
            </div>

            {/* Day cells */}
            {Array.from({ length: 7 }, (_, dayOfWeek) => {
              const index = week * 7 + dayOfWeek;
              const isSelected = selectedDays[index];

              return (
                <button
                  key={index}
                  type="button"
                  data-day-index={index}
                  aria-pressed={isSelected}
                  aria-label={`วัน${DAY_HEADERS[dayOfWeek]} สัปดาห์ ${week + 1} วันที่ ${index + 1}`}
                  className={`
                    w-full aspect-square min-w-[34px] min-h-[34px] sm:min-w-[38px] sm:min-h-[38px] rounded-lg text-xs
                    flex items-center justify-center
                    transition-all duration-150 ease-out
                    outline-none cursor-pointer
                    ${
                      isSelected
                        ? 'bg-brand-lime text-slate-950 font-medium shadow-sm scale-[0.98]'
                        : 'bg-white/5 dark:bg-white/5 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }
                    ${
                      isDragging
                        ? '' /* suppress hover ring while dragging */
                        : 'hover:ring-1 hover:ring-brand-lime/50 active:scale-95'
                    }
                  `}
                  onPointerDown={(e) => handlePointerDown(index, e)}
                  /* Single click fallback handled by pointerDown already */
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Shortcut Chips ── */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
        {shortcuts.map((shortcut) => {
          const Icon = shortcut.icon;
          const isActive = arraysEqual(selectedDays, shortcut.pattern);

          return (
            <button
              key={shortcut.label}
              type="button"
              onClick={() => onChange([...shortcut.pattern])}
              className={`
                glass-pill flex items-center gap-1.5 px-3 py-1.5
                rounded-full text-xs font-light shrink-0
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-brand-lime/20 !border-brand-lime/40 text-brand-lime font-normal'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }
              `}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive
                    ? 'text-brand-lime'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span>{shortcut.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
