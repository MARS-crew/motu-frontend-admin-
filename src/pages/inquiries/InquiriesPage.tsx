import type { FormEvent } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { Pagination } from '@/components/common/Pagination';
import { Select } from '@/components/common/Select';
import type { TableColumn } from '@/components/common/Table';
import { Table } from '@/components/common/Table';
import { TextInput } from '@/components/common/TextInput';
import { InquiryDetailCard } from '@/components/inquiry/InquiryDetailCard';
import {
  INQUIRY_STATUS_FILTER_OPTIONS,
  INQUIRY_STATUS_LABELS,
  INQUIRY_STATUS_TONES,
  INQUIRY_TYPE_FILTER_OPTIONS,
  INQUIRY_TYPE_LABELS,
} from '@/constants/inquiry';
import { useInquiriesQuery, useInquiryDetailQuery } from '@/queries/useInquiriesQuery';
import type { InquiryFilters, InquirySummary } from '@/types/inquiry';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatMonthDayTime } from '@/utils/date';

const COLUMNS: TableColumn<InquirySummary>[] = [
  { id: 'code', header: '접수번호', cell: (row) => row.inquiryCode, isEmphasized: true },
  { id: 'type', header: '문의 유형', cell: (row) => INQUIRY_TYPE_LABELS[row.type] },
  { id: 'createdAt', header: '접수 시각', cell: (row) => formatMonthDayTime(row.createdAt) },
  {
    id: 'status',
    header: '상태',
    cell: (row) => (
      <Badge tone={INQUIRY_STATUS_TONES[row.status]}>{INQUIRY_STATUS_LABELS[row.status]}</Badge>
    ),
  },
  { id: 'handler', header: '담당자', cell: (row) => row.handlerName ?? '—' },
];

// ADM-INQ-01 계정·인증 문의 관리 (비로그인 계정·인증 문의의 조회·처리·이메일 답변, 최신순, 20건씩)
export default function InquiriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters: InquiryFilters = {
    status: (searchParams.get('status') as InquiryFilters['status']) ?? 'ALL',
    type: (searchParams.get('type') as InquiryFilters['type']) ?? 'ALL',
    keyword: searchParams.get('keyword') ?? '',
    page: Math.max(Number(searchParams.get('page')) || 1, 1),
  };
  const [draft, setDraft] = useState(filters);

  const { data, isPending, isError, error } = useInquiriesQuery(filters);
  const rows = data?.inquiries ?? [];
  // 선택 전에는 첫 번째(가장 최근) 문의를 보여줍니다.
  const selectedId = searchParams.get('selected') ?? rows[0]?.inquiryId ?? null;
  const { data: selected } = useInquiryDetailQuery(selectedId ? Number(selectedId) : null);

  const emptyMessage = isPending
    ? '문의를 불러오는 중입니다.'
    : isError
      ? getApiErrorMessage(error)
      : '조건에 맞는 문의가 없습니다.';

  const applyParams = (next: InquiryFilters) => {
    const params = new URLSearchParams();
    if (next.status !== 'ALL') params.set('status', next.status);
    if (next.type !== 'ALL') params.set('type', next.type);
    if (next.keyword.trim()) params.set('keyword', next.keyword.trim());
    if (next.page > 1) params.set('page', String(next.page));
    setSearchParams(params);
  };

  // 검색 조건을 바꾸면 첫 페이지부터 봅니다.
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyParams({ ...draft, page: 1 });
  };
  const handleChangePage = (page: number) => applyParams({ ...filters, page });
  const handleSelect = (inquiry: InquirySummary) => {
    const params = new URLSearchParams(searchParams);
    params.set('selected', inquiry.inquiryId);
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={handleSearch}
        className="flex items-end gap-3 rounded-[14px] border border-motu-border bg-white px-6 py-5"
      >
        <Field label="상태" htmlFor="filter-status" className="flex-1">
          <Select
            id="filter-status"
            options={INQUIRY_STATUS_FILTER_OPTIONS}
            value={draft.status}
            onChange={(status) => setDraft((prev) => ({ ...prev, status }))}
          />
        </Field>
        <Field label="문의 유형" htmlFor="filter-type" className="flex-1">
          <Select
            id="filter-type"
            options={INQUIRY_TYPE_FILTER_OPTIONS}
            value={draft.type}
            onChange={(type) => setDraft((prev) => ({ ...prev, type }))}
          />
        </Field>
        <Field label="접수번호 검색" htmlFor="filter-keyword" className="flex-1">
          <TextInput
            id="filter-keyword"
            placeholder="INQ-000"
            value={draft.keyword}
            onChange={(event) => setDraft((prev) => ({ ...prev, keyword: event.target.value }))}
          />
        </Field>
        <Button type="submit">검색</Button>
      </form>

      <Table
        columns={COLUMNS}
        rows={rows}
        getRowKey={(row) => row.inquiryId}
        gridClassName="grid-cols-[180fr_300fr_220fr_200fr_234fr]"
        emptyMessage={emptyMessage}
        onRowClick={handleSelect}
        selectedRowKey={selectedId}
      />
      <Pagination
        page={filters.page}
        totalPages={data?.totalPages ?? 1}
        onChange={handleChangePage}
      />

      {selected && <InquiryDetailCard key={selected.inquiryId} inquiry={selected} />}
    </div>
  );
}
