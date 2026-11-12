import { useCallback, useRef, useState } from 'react';

import { Chip } from '@/components/common/Chip';
import type { DateRange } from '@/components/common/DateRangePicker';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { BarChart } from '@/components/dashboard/BarChart';
import {
  TRADE_METRIC_OPTIONS,
  TRADE_METRIC_TEXTS,
  TRADE_RANGE_OPTIONS,
} from '@/constants/dashboard';
import { TRADE_TREND_PREVIEW } from '@/constants/dashboardPreview';
import { useDismiss } from '@/hooks/useDismiss';
import type { TradeMetric, TradeRange } from '@/types/dashboard';
import { formatDate } from '@/utils/date';
import { formatCompactKorean, formatNumber } from '@/utils/format';

const formatTotal = (metric: TradeMetric, total: number) =>
  metric === 'volume' ? `${formatNumber(total)}주` : `${formatCompactKorean(total)} P`;

// ADM-DB-01 거래량·거래대금 추이 (조회 구간은 차트에만 적용합니다)
export function TradeTrendCard() {
  const [metric, setMetric] = useState<TradeMetric>('volume');
  const [range, setRange] = useState<TradeRange>('1d');
  const [customRange, setCustomRange] = useState<DateRange>({ start: null, end: null });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleClosePicker = useCallback(() => setIsPickerOpen(false), []);
  useDismiss(pickerRef, isPickerOpen, handleClosePicker);

  const handleSelectRange = (value: TradeRange) => {
    if (value === 'custom') {
      setIsPickerOpen((prev) => !prev);
      return;
    }
    setRange(value);
    setIsPickerOpen(false);
  };
  const handleApplyCustomRange = (value: DateRange) => {
    setCustomRange(value);
    // 기간을 모두 비우고 적용하면 전체 기간으로 봅니다.
    setRange(value.start ? 'custom' : 'all');
    setIsPickerOpen(false);
  };

  // TODO(MOTU-19-2): metric·range(customRange) 로 거래 추이 API 조회
  const trend = TRADE_TREND_PREVIEW[metric];
  const texts = TRADE_METRIC_TEXTS[metric];
  const periodLabel =
    range === 'custom' && customRange.start && customRange.end
      ? `${formatDate(customRange.start)} ~ ${formatDate(customRange.end)}`
      : trend.periodLabel;

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-4 rounded-[14px] border border-motu-border bg-white px-6 py-5">
      <div className="flex items-center gap-3">
        <h2 className="flex-1 text-title-md font-bold text-motu-text-primary">{texts.title}</h2>
        {TRADE_METRIC_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            isSelected={metric === option.value}
            onClick={() => setMetric(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>

      <div className="flex gap-2">
        {TRADE_RANGE_OPTIONS.filter((option) => option.value !== 'custom').map((option) => (
          <Chip
            key={option.value}
            isSelected={range === option.value}
            onClick={() => handleSelectRange(option.value)}
          >
            {option.label}
          </Chip>
        ))}
        <div ref={pickerRef} className="relative">
          <Chip
            isSelected={range === 'custom'}
            aria-expanded={isPickerOpen}
            onClick={() => handleSelectRange('custom')}
          >
            직접 설정
          </Chip>
          {isPickerOpen && (
            <DateRangePicker
              title="직접 설정"
              value={customRange}
              maxDate={new Date()}
              onApply={handleApplyCustomRange}
              onCancel={handleClosePicker}
              className="absolute left-0 top-full z-10 mt-2"
            />
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-2.5 whitespace-nowrap">
        <p className="text-body-sm font-medium text-motu-text-secondary">{texts.totalLabel}</p>
        <p className="text-title-lg font-bold text-motu-text-primary">
          {formatTotal(metric, trend.total)}
        </p>
        <p className="text-label-md font-medium text-motu-text-tertiary">{periodLabel}</p>
      </div>

      <BarChart values={trend.values} xLabels={trend.xLabels} label={texts.title} />

      <p className="text-right text-label-sm font-medium text-motu-text-tertiary">
        {texts.unitLabel}
      </p>
    </section>
  );
}
