import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';

import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { buttonClassName } from '@/components/common/buttonClassName';
import { Field } from '@/components/common/Field';
import { Select } from '@/components/common/Select';
import type { TableColumn } from '@/components/common/Table';
import { Table } from '@/components/common/Table';
import { TextInput } from '@/components/common/TextInput';
import {
  ADMIN_STATUS_FILTER_OPTIONS,
  ADMIN_STATUS_LABELS,
  ADMIN_STATUS_TONES,
} from '@/constants/admin';
import { ADMIN_ACCOUNTS_PREVIEW } from '@/constants/adminPreview';
import { getAdminManagePath, ROUTES } from '@/constants/routes';
import type { AdminAccount, AdminAccountFilters } from '@/types/admin';
import { formatDateTimeText, formatMonthDay, formatMonthDayTime } from '@/utils/date';

const COLUMNS: TableColumn<AdminAccount>[] = [
  { id: 'loginId', header: '아이디', cell: (row) => row.loginId, isEmphasized: true },
  { id: 'name', header: '이름', cell: (row) => row.name },
  { id: 'email', header: '이메일', cell: (row) => row.email },
  {
    id: 'status',
    header: '상태',
    cell: (row) => (
      <Badge tone={ADMIN_STATUS_TONES[row.status]}>{ADMIN_STATUS_LABELS[row.status]}</Badge>
    ),
  },
  { id: 'duty', header: '담당 업무', cell: (row) => row.duty || '-' },
  { id: 'createdAt', header: '생성일', cell: (row) => formatMonthDay(row.createdAt) },
  {
    id: 'lastLoginAt',
    header: '최근 로그인',
    cell: (row) => (row.lastLoginAt ? formatMonthDayTime(row.lastLoginAt) : '-'),
  },
];

// TODO(MOTU-29-1): 서버 검색으로 교체합니다. 퍼블리싱 확인용으로 예시 데이터를 거릅니다.
const filterPreview = (accounts: AdminAccount[], filters: AdminAccountFilters) => {
  const keyword = filters.keyword.trim().toLowerCase();
  return accounts.filter(
    (account) =>
      (!keyword ||
        [account.loginId, account.name, account.email].some((value) =>
          value.toLowerCase().includes(keyword),
        )) &&
      (filters.status === 'ALL' || account.status === filters.status),
  );
};

// ADM-ACC-01 관리자 계정 목록 (행을 누르면 하단에 상세를 표시)
export default function AdminsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters: AdminAccountFilters = {
    keyword: searchParams.get('keyword') ?? '',
    status: (searchParams.get('status') as AdminAccountFilters['status']) ?? 'ALL',
  };
  const [draft, setDraft] = useState(filters);

  const accounts = filterPreview(ADMIN_ACCOUNTS_PREVIEW, filters);
  const selectedLoginId = searchParams.get('selected') ?? accounts[0]?.loginId ?? null;
  const selected = accounts.find((account) => account.loginId === selectedLoginId) ?? null;

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (draft.keyword.trim()) params.set('keyword', draft.keyword.trim());
    if (draft.status !== 'ALL') params.set('status', draft.status);
    setSearchParams(params);
  };
  const handleSelect = (account: AdminAccount) => {
    const params = new URLSearchParams(searchParams);
    params.set('selected', account.loginId);
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={handleSearch}
        className="flex items-end gap-3 rounded-[14px] border border-motu-border bg-white px-6 py-5"
      >
        <Field label="검색" htmlFor="filter-keyword" className="flex-1">
          <TextInput
            id="filter-keyword"
            placeholder="아이디·이름·이메일"
            value={draft.keyword}
            onChange={(event) => setDraft((prev) => ({ ...prev, keyword: event.target.value }))}
          />
        </Field>
        <Field label="계정 상태" htmlFor="filter-status" className="flex-1">
          <Select
            id="filter-status"
            options={ADMIN_STATUS_FILTER_OPTIONS}
            value={draft.status}
            onChange={(status) => setDraft((prev) => ({ ...prev, status }))}
          />
        </Field>
        <Button type="submit">검색</Button>
        <Link to={ROUTES.ADMIN_MANAGE} className={buttonClassName({ variant: 'secondary' })}>
          계정 생성
        </Link>
      </form>

      <Table
        columns={COLUMNS}
        rows={accounts}
        getRowKey={(row) => row.loginId}
        gridClassName="grid-cols-[4fr_4fr_4fr_3fr_4fr_3fr_4fr]"
        emptyMessage="조건에 맞는 관리자 계정이 없습니다."
        onRowClick={handleSelect}
        selectedRowKey={selected?.loginId ?? null}
      />

      {selected && (
        <section className="flex items-center gap-4 rounded-[14px] border border-motu-border bg-white px-6 py-5">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-body-sm font-medium text-motu-text-secondary">
            <h2 className="text-title-md font-bold text-motu-text-primary">
              선택 계정 상세 · {selected.loginId} / {selected.name}
            </h2>
            <p>
              이메일 {selected.email} · 생성일 {formatDateTimeText(selected.createdAt)}
            </p>
            <p>
              상태 {ADMIN_STATUS_LABELS[selected.status]} · 담당 업무 {selected.duty || '-'}
            </p>
          </div>
          <Link to={getAdminManagePath(selected.loginId)} className={buttonClassName()}>
            상태 변경
          </Link>
        </section>
      )}
    </div>
  );
}
