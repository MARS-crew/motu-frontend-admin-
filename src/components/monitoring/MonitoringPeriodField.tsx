import { useCallback, useRef, useState } from 'react';

import { Chip } from '@/components/common/Chip';
import { DateField } from '@/components/common/DateField';
import type { DateRange } from '@/components/common/DateRangePicker';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { MONITORING_PERIOD_PRESETS } from '@/constants/monitoring';
import { useDismiss } from '@/hooks/useDismiss';
import type { MonitoringPeriod } from '@/types/monitoring';
import { formatMonthDay, parseISODate, toISODate } from '@/utils/date';

type MonitoringPeriodFieldProps = {
  id?: string;
  period: MonitoringPeriod;
  from: string | null;
  to: string | null;
  onChange: (next: { period: MonitoringPeriod; from: string | null; to: string | null }) => void;
};

// 발생 기간: 최근 24시간·7일·30일은 칩으로 바로 선택하고, 그 외는 달력에서 직접 설정합니다.
export function MonitoringPeriodField({
  id,
  period,
  from,
  to,
  onChange,
}: MonitoringPeriodFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => setIsOpen(false), []);
  useDismiss(containerRef, isOpen, handleClose);

  const handleSelectPreset = (value: Exclude<MonitoringPeriod, 'custom'>) => {
    onChange({ period: value, from: null, to: null });
    setIsOpen(false);
  };
  const handleApply = ({ start, end }: DateRange) => {
    // 기간을 모두 비우면 기본값(최근 24시간)으로 돌아갑니다.
    if (!start || !end) onChange({ period: '24h', from: null, to: null });
    else onChange({ period: 'custom', from: toISODate(start), to: toISODate(end) });
    setIsOpen(false);
  };

  const displayValue =
    period === 'custom' && from && to
      ? `${formatMonthDay(from)}~${formatMonthDay(to)}`
      : (MONITORING_PERIOD_PRESETS.find((preset) => preset.value === period)?.label ?? '');

  return (
    <div ref={containerRef} className="relative">
      <DateField
        id={id}
        value={displayValue}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={isOpen ? 'border-motu-black' : undefined}
      />
      {isOpen && (
        <DateRangePicker
          title="발생 기간"
          value={{ start: parseISODate(from), end: parseISODate(to) }}
          maxDate={new Date()}
          onApply={handleApply}
          onCancel={handleClose}
          className="absolute right-0 top-full z-20 mt-1.5"
        >
          <div className="flex gap-2">
            {MONITORING_PERIOD_PRESETS.map((preset) => (
              <Chip
                key={preset.value}
                isSelected={period === preset.value}
                onClick={() => handleSelectPreset(preset.value)}
              >
                {preset.label}
              </Chip>
            ))}
          </div>
        </DateRangePicker>
      )}
    </div>
  );
}
