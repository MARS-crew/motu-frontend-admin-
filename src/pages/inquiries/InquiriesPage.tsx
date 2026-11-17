import type { FormEvent } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { Select } from '@/components/common/Select';
import type { TableColumn } from '@/components/common/Table';
import { Table } from '@/components/common/Table';
import { TextInput } from '@/components/common/TextInput';
import { InquiryDetailCard } from '@/components/inquiry/InquiryDetailCard';
import { CURRENT_ADMIN_LOGIN_ID_PREVIEW } from '@/constants/adminPreview';
import {
  INQUIRY_STATUS_FILTER_OPTIONS,
  INQUIRY_STATUS_LABELS,
  INQUIRY_STATUS_TONES,
  INQUIRY_TYPE_FILTER_OPTIONS,
  INQUIRY_TYPE_LABELS,
} from '@/constants/inquiry';
import { INQUIRIES_PREVIEW } from '@/constants/inquiryPreview';
import type { Inquiry, InquiryFilters } from '@/types/inquiry';
import { formatMonthDayTime } from '@/utils/date';

const COLUMNS: TableColumn<Inquiry>[] = [
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
  { id: 'handler', header: '담당자', cell: (row) => row.handlerLoginId ?? '—' },
];

// TODO(MOTU-30-1): 서버 검색으로 교체합니다. 퍼블리싱 확인용으로 예시 데이터를 거릅니다.
const filterPreview = (inquiries: Inquiry[], filters: InquiryFilters) => {
  const keyword = filters.keyword.trim().toLowerCase();
  return inquiries.filter(
    (inquiry) =>
      (filters.status === 'ALL' || inquiry.status === filters.status) &&
      (filters.type === 'ALL' || inquiry.type === filters.type) &&
      (!keyword || inquiry.inquiryCode.toLowerCase().includes(keyword)),
  );
};

const toLocalDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// ADM-INQ-01 계정·인증 문의 관리 (비로그인 계정·인증 문의의 조회·처리·이메일 답변, 최신순)
export default function InquiriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters: InquiryFilters = {
    status: (searchParams.get('status') as InquiryFilters['status']) ?? 'ALL',
    type: (searchParams.get('type') as InquiryFilters['type']) ?? 'ALL',
    keyword: searchParams.get('keyword') ?? '',
  };
  const [draft, setDraft] = useState(filters);
  // TODO(MOTU-30-1): 처리 시작·답변 발송 API 연동 후 서버 응답으로 갱신합니다.
  const [inquiries, setInquiries] = useState(INQUIRIES_PREVIEW);

  const rows = filterPreview(inquiries, filters);
  const selectedCode = searchParams.get('selected') ?? rows[0]?.inquiryCode ?? null;
  const selected = rows.find((inquiry) => inquiry.inquiryCode === selectedCode) ?? null;

  const updateInquiry = (inquiryCode: string, next: Partial<Inquiry>) =>
    setInquiries((prev) =>
      prev.map((inquiry) =>
        inquiry.inquiryCode === inquiryCode ? { ...inquiry, ...next } : inquiry,
      ),
    );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (draft.status !== 'ALL') params.set('status', draft.status);
    if (draft.type !== 'ALL') params.set('type', draft.type);
    if (draft.keyword.trim()) params.set('keyword', draft.keyword.trim());
    setSearchParams(params);
  };
  const handleSelect = (inquiry: Inquiry) => {
    const params = new URLSearchParams(searchParams);
    params.set('selected', inquiry.inquiryCode);
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
        getRowKey={(row) => row.inquiryCode}
        gridClassName="grid-cols-[180fr_300fr_220fr_200fr_234fr]"
        emptyMessage="조건에 맞는 문의가 없습니다."
        onRowClick={handleSelect}
        selectedRowKey={selected?.inquiryCode ?? null}
      />

      {selected && (
        <InquiryDetailCard
          key={selected.inquiryCode}
          inquiry={selected}
          // [처리 시작]은 로그인한 관리자를 담당자로 기록합니다.
          onStart={() =>
            updateInquiry(selected.inquiryCode, {
              status: 'IN_PROGRESS',
              handlerLoginId: CURRENT_ADMIN_LOGIN_ID_PREVIEW,
            })
          }
          onAnswer={(answer) =>
            updateInquiry(selected.inquiryCode, {
              status: 'APPROVED',
              answer,
              answeredAt: toLocalDateTime(new Date()),
            })
          }
        />
      )}
    </div>
  );
}
