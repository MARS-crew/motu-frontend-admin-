import type { FormEvent } from 'react';
import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { DateRangeField } from '@/components/common/DateRangeField';
import { Field } from '@/components/common/Field';
import { Select } from '@/components/common/Select';
import { TextInput } from '@/components/common/TextInput';
import {
  LISTING_CATEGORY_FILTER_OPTIONS,
  LISTING_STATUS_FILTER_OPTIONS,
} from '@/constants/listing';
import type { ListingApplicationFilters } from '@/types/listing';
import { parseISODate, toISODate } from '@/utils/date';

type ListingFilterCardProps = {
  filters: ListingApplicationFilters;
  onSearch: (filters: ListingApplicationFilters) => void;
};

// ADM-LST-01 검색 조건 (입력값은 [검색]을 눌렀을 때 목록에 반영합니다)
export function ListingFilterCard({ filters, onSearch }: ListingFilterCardProps) {
  const [draft, setDraft] = useState(filters);

  const updateDraft = (next: Partial<ListingApplicationFilters>) =>
    setDraft((prev) => ({ ...prev, ...next }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(draft);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 rounded-[14px] border border-motu-border bg-white px-6 py-5"
    >
      <Field label="신청 상태" htmlFor="filter-status" className="flex-1">
        <Select
          id="filter-status"
          options={LISTING_STATUS_FILTER_OPTIONS}
          value={draft.status}
          onChange={(status) => updateDraft({ status })}
        />
      </Field>
      <Field label="신청자" htmlFor="filter-applicant" className="flex-1">
        <TextInput
          id="filter-applicant"
          placeholder="이름·아이디"
          value={draft.applicant}
          onChange={(event) => updateDraft({ applicant: event.target.value })}
        />
      </Field>
      <Field label="카테고리" htmlFor="filter-category" className="flex-1">
        <Select
          id="filter-category"
          options={LISTING_CATEGORY_FILTER_OPTIONS}
          value={draft.category}
          onChange={(category) => updateDraft({ category })}
        />
      </Field>
      <Field label="신청 기간" htmlFor="filter-period" className="flex-1">
        <DateRangeField
          id="filter-period"
          title="신청 기간"
          maxDate={new Date()}
          value={{ start: parseISODate(draft.appliedFrom), end: parseISODate(draft.appliedTo) }}
          onChange={({ start, end }) =>
            updateDraft({
              appliedFrom: start ? toISODate(start) : null,
              appliedTo: end ? toISODate(end) : null,
            })
          }
        />
      </Field>
      <Button type="submit">검색</Button>
    </form>
  );
}
