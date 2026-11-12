import type { FormEvent } from 'react';
import { useState } from 'react';

import { Field } from '@/components/common/Field';
import { Select } from '@/components/common/Select';
import { TextInput } from '@/components/common/TextInput';
import { MonitoringPeriodField } from '@/components/monitoring/MonitoringPeriodField';
import {
  ABNORMAL_TRADE_STATUS_FILTER_OPTIONS,
  ABNORMAL_TRADE_TYPE_FILTER_OPTIONS,
} from '@/constants/monitoring';
import type { MonitoringFilters } from '@/types/monitoring';

type MonitoringFilterCardProps = {
  filters: MonitoringFilters;
  onChange: (next: Partial<MonitoringFilters>) => void;
};

// ADM-MON-01 조회 조건 (선택하면 바로 목록에 반영, ID 검색은 Enter·포커스 이동 시 반영)
export function MonitoringFilterCard({ filters, onChange }: MonitoringFilterCardProps) {
  const [targetId, setTargetId] = useState(filters.targetId);

  const handleApplyTargetId = () => {
    if (targetId.trim() !== filters.targetId) onChange({ targetId });
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleApplyTargetId();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-4 gap-3 rounded-[14px] border border-motu-border bg-white px-6 py-5"
    >
      <Field label="탐지 유형" htmlFor="filter-type">
        <Select
          id="filter-type"
          options={ABNORMAL_TRADE_TYPE_FILTER_OPTIONS}
          value={filters.type}
          onChange={(type) => onChange({ type })}
        />
      </Field>
      <Field label="처리 상태" htmlFor="filter-status">
        <Select
          id="filter-status"
          options={ABNORMAL_TRADE_STATUS_FILTER_OPTIONS}
          value={filters.status}
          onChange={(status) => onChange({ status })}
        />
      </Field>
      <Field label="발생 기간" htmlFor="filter-period">
        <MonitoringPeriodField
          id="filter-period"
          period={filters.period}
          from={filters.from}
          to={filters.to}
          onChange={onChange}
        />
      </Field>
      <Field label="상품·회원" htmlFor="filter-target">
        <TextInput
          id="filter-target"
          placeholder="ID 검색"
          value={targetId}
          onChange={(event) => setTargetId(event.target.value)}
          onBlur={handleApplyTargetId}
        />
      </Field>
    </form>
  );
}
