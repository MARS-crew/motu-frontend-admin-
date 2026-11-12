import { useState } from 'react';

import calendarIcon from '@/assets/icons/calendar.svg';
import chevronLeftIcon from '@/assets/icons/calendar-chevron-left.svg';
import chevronRightDisabledIcon from '@/assets/icons/calendar-chevron-right-disabled.svg';
import { Button } from '@/components/common/Button';
import { FIELD_BOX_CLASS_NAME } from '@/components/common/fieldBoxClassName';
import { cn } from '@/utils/cn';
import {
  addMonths,
  formatDate,
  getCalendarWeeks,
  isSameDay,
  startOfDay,
  WEEKDAY_LABELS,
} from '@/utils/date';

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

type DateRangePickerProps = {
  title: string;
  value: DateRange;
  // [적용] 시 선택한 기간을 넘깁니다. 둘 다 비어 있으면 전체 기간입니다.
  onApply: (range: DateRange) => void;
  // [취소] 시 기존 값을 유지하고 닫습니다.
  onCancel: () => void;
  // 이 날짜 이후는 선택할 수 없습니다. (오늘 이후 집계가 없는 경우 등)
  maxDate?: Date;
  className?: string;
};

// 시작일·종료일 달력 팝오버입니다. (대시보드 직접 설정, 상장 신청 기간 등)
// 첫 클릭은 시작일, 두 번째 클릭은 종료일입니다. 시작일보다 이전 날짜를 누르면 시작일을 다시 고릅니다.
export function DateRangePicker({
  title,
  value,
  onApply,
  onCancel,
  maxDate,
  className,
}: DateRangePickerProps) {
  const [range, setRange] = useState<DateRange>(value);
  const [month, setMonth] = useState(() =>
    addMonths(value.end ?? value.start ?? maxDate ?? new Date(), 0),
  );

  const maxDay = maxDate ? startOfDay(maxDate) : null;
  const canGoNext = !maxDay || addMonths(month, 1) <= maxDay;
  const weeks = getCalendarWeeks(month);

  const handleSelectDay = (day: Date) => {
    setRange((prev) => {
      if (!prev.start || prev.end || day < prev.start) return { start: day, end: null };
      return { start: prev.start, end: day };
    });
  };
  const handlePrevMonth = () => setMonth((prev) => addMonths(prev, -1));
  const handleNextMonth = () => setMonth((prev) => addMonths(prev, 1));
  const handleReset = () => setRange({ start: null, end: null });
  // 종료일 없이 적용하면 하루만 선택한 것으로 봅니다.
  const handleApply = () => onApply({ start: range.start, end: range.end ?? range.start });

  const getDayState = (day: Date) => {
    const { start, end } = range;
    if (end ? isSameDay(day, end) : start && isSameDay(day, start)) return 'edge';
    if (start && end && day >= start && day <= end) return 'inRange';
    return 'none';
  };

  return (
    <div
      role="dialog"
      aria-label={title}
      className={cn(
        'flex w-[344px] flex-col gap-3.5 rounded-xl border border-motu-border bg-white p-5 shadow-popover',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <p className="flex-1 text-body-md font-bold text-motu-text-primary">
          {title} · {month.getFullYear()}년 {month.getMonth() + 1}월
        </p>
        <button type="button" aria-label="이전 달" onClick={handlePrevMonth}>
          <img src={chevronLeftIcon} alt="" width={18} height={18} />
        </button>
        <button type="button" aria-label="다음 달" disabled={!canGoNext} onClick={handleNextMonth}>
          {canGoNext ? (
            <img src={chevronLeftIcon} alt="" width={18} height={18} className="rotate-180" />
          ) : (
            <img src={chevronRightDisabledIcon} alt="" width={18} height={18} />
          )}
        </button>
      </div>

      <div className="flex gap-2">
        {[
          { label: '시작일', date: range.start },
          { label: '종료일', date: range.end },
        ].map(({ label, date }) => (
          <div key={label} className="flex flex-1 flex-col gap-2">
            <p className="text-label-md font-medium text-motu-text-secondary">{label}</p>
            <div className={cn(FIELD_BOX_CLASS_NAME, 'flex h-11 items-center gap-2')}>
              <span className={cn('flex-1', !date && 'text-motu-text-tertiary')}>
                {date ? formatDate(date) : '선택'}
              </span>
              <img src={calendarIcon} alt="" width={16} height={15} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="grid grid-cols-7">
          {WEEKDAY_LABELS.map((label) => (
            <span
              key={label}
              className="flex h-8 items-center justify-center text-body-sm font-medium text-motu-text-secondary"
            >
              {label}
            </span>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={week[0].toISOString()} className="grid grid-cols-7">
            {week.map((day) => {
              const isOtherMonth = day.getMonth() !== month.getMonth();
              const isDisabled = Boolean(maxDay && day > maxDay);
              const state = getDayState(day);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={isDisabled}
                  aria-pressed={state !== 'none'}
                  aria-label={formatDate(day)}
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    'flex h-8 items-center justify-center rounded-lg text-body-sm font-bold',
                    state === 'edge' && 'bg-motu-black text-white',
                    state === 'inRange' && 'bg-motu-bg-secondary text-motu-text-primary',
                    state === 'none' && 'text-motu-text-primary hover:bg-motu-bg',
                    (isOtherMonth || isDisabled) && state === 'none' && 'opacity-35',
                    isDisabled && 'cursor-not-allowed hover:bg-transparent',
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="neutral" size="sm" onClick={handleReset}>
          초기화
        </Button>
        <div className="flex-1" />
        <Button variant="secondary" size="sm" onClick={onCancel}>
          취소
        </Button>
        <Button size="sm" onClick={handleApply}>
          적용
        </Button>
      </div>
    </div>
  );
}
