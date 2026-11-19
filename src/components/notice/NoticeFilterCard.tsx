import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link } from 'react-router';

import { buttonClassName } from '@/components/common/buttonClassName';
import { DateRangeField } from '@/components/common/DateRangeField';
import { Field } from '@/components/common/Field';
import { Select } from '@/components/common/Select';
import { TextInput } from '@/components/common/TextInput';
import { NOTICE_STATUS_FILTER_OPTIONS, NOTICE_TYPE_FILTER_OPTIONS } from '@/constants/notice';
import { ROUTES } from '@/constants/routes';
import type { NoticeFilters } from '@/types/notice';
import { parseISODate, toISODate } from '@/utils/date';

type NoticeFilterCardProps = {
  filters: NoticeFilters;
  onChange: (next: Partial<Omit<NoticeFilters, 'page'>>) => void;
};

// ADM-NTC-01 조회 조건 (선택하면 바로 목록에 반영, 검색어는 Enter·포커스 이동 시 반영)
export function NoticeFilterCard({ filters, onChange }: NoticeFilterCardProps) {
  const [keyword, setKeyword] = useState(filters.keyword);

  const handleApplyKeyword = () => {
    if (keyword.trim() !== filters.keyword) onChange({ keyword });
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleApplyKeyword();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 rounded-[14px] border border-motu-border bg-white px-6 py-5"
    >
      <Field label="공지 검색" htmlFor="filter-keyword" className="flex-1">
        <TextInput
          id="filter-keyword"
          placeholder="제목·공지 ID"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onBlur={handleApplyKeyword}
        />
      </Field>
      <Field label="공지 구분" htmlFor="filter-type" className="flex-1">
        <Select
          id="filter-type"
          options={NOTICE_TYPE_FILTER_OPTIONS}
          value={filters.type}
          onChange={(type) => onChange({ type })}
        />
      </Field>
      <Field label="게시 상태" htmlFor="filter-status" className="flex-1">
        <Select
          id="filter-status"
          options={NOTICE_STATUS_FILTER_OPTIONS}
          value={filters.status}
          onChange={(status) => onChange({ status })}
        />
      </Field>
      <Field label="게시 기간" htmlFor="filter-period" className="flex-1">
        <DateRangeField
          id="filter-period"
          title="게시 기간"
          value={{ start: parseISODate(filters.from), end: parseISODate(filters.to) }}
          onChange={({ start, end }) =>
            onChange({ from: start ? toISODate(start) : null, to: end ? toISODate(end) : null })
          }
        />
      </Field>
      <Link to={ROUTES.NOTICE_NEW} className={buttonClassName()}>
        공지 작성
      </Link>
    </form>
  );
}
