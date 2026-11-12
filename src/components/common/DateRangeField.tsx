import { useCallback, useRef, useState } from 'react';

import { DateField } from '@/components/common/DateField';
import type { DateRange } from '@/components/common/DateRangePicker';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { useDismiss } from '@/hooks/useDismiss';
import { formatDateRange } from '@/utils/date';

type DateRangeFieldProps = {
  // 달력 팝오버 제목
  title: string;
  value: DateRange;
  onChange: (range: DateRange) => void;
  id?: string;
  placeholder?: string;
  maxDate?: Date;
};

// 기간 입력 박스입니다. 누르면 아래에 시작·종료일 달력 팝오버를 엽니다.
export function DateRangeField({
  title,
  value,
  onChange,
  id,
  placeholder = '전체 기간',
  maxDate,
}: DateRangeFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => setIsOpen(false), []);
  useDismiss(containerRef, isOpen, handleClose);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleApply = (range: DateRange) => {
    onChange(range);
    setIsOpen(false);
  };

  const displayValue = value.start && value.end ? formatDateRange(value.start, value.end) : '';

  return (
    <div ref={containerRef} className="relative">
      <DateField
        id={id}
        value={displayValue}
        placeholder={placeholder}
        aria-expanded={isOpen}
        onClick={handleToggle}
        className={isOpen ? 'border-motu-black' : undefined}
      />
      {isOpen && (
        <DateRangePicker
          title={title}
          value={value}
          maxDate={maxDate}
          onApply={handleApply}
          onCancel={handleClose}
          className="absolute left-0 top-full z-20 mt-1.5"
        />
      )}
    </div>
  );
}
