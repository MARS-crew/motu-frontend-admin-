import type { FormEvent } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { Badge } from '@/components/common/Badge';
import { Field } from '@/components/common/Field';
import { InfoCard } from '@/components/common/InfoCard';
import { Notice } from '@/components/common/Notice';
import { Select } from '@/components/common/Select';
import type { TableColumn } from '@/components/common/Table';
import { Table } from '@/components/common/Table';
import { TextInput } from '@/components/common/TextInput';
import { MonitoringPeriodField } from '@/components/monitoring/MonitoringPeriodField';
import {
  ACTIVITY_ACTION_LABELS,
  ACTIVITY_RESULT_LABELS,
  ACTIVITY_RESULT_TONES,
  ACTIVITY_TARGET_FILTER_OPTIONS,
  getActivityActionFilterOptions,
} from '@/constants/admin';
import { ACTIVITY_LOGS_PREVIEW } from '@/constants/adminPreview';
import type { ActivityAction, ActivityLog, ActivityTargetType } from '@/types/admin';
import type { MonitoringPeriod } from '@/types/monitoring';
import { formatDateTimeText, formatMonthDayTime } from '@/utils/date';

type ActivityLogFilters = {
  adminLoginId: string;
  targetType: ActivityTargetType | 'ALL';
  action: ActivityAction | 'ALL';
  period: MonitoringPeriod;
  from: string | null;
  to: string | null;
};

const COLUMNS: TableColumn<ActivityLog>[] = [
  {
    id: 'createdAt',
    header: '작업 시각',
    cell: (row) => formatMonthDayTime(row.createdAt),
    isEmphasized: true,
  },
  { id: 'admin', header: '관리자', cell: (row) => row.adminLoginId },
  { id: 'target', header: '작업 대상', cell: (row) => row.targetLabel },
  { id: 'action', header: '수행 작업', cell: (row) => ACTIVITY_ACTION_LABELS[row.action] },
  {
    id: 'result',
    header: '결과',
    cell: (row) => (
      <Badge tone={ACTIVITY_RESULT_TONES[row.result]}>{ACTIVITY_RESULT_LABELS[row.result]}</Badge>
    ),
  },
];

// TODO(MOTU-29-1): 서버 검색(GET /admin/activity-logs)으로 교체합니다.
// 예시 데이터는 작업 기간과 관계없이 관리자·대상·수행 작업으로만 거릅니다.
const filterPreview = (logs: ActivityLog[], filters: ActivityLogFilters) => {
  const adminLoginId = filters.adminLoginId.trim().toLowerCase();
  return logs.filter(
    (log) =>
      (!adminLoginId || log.adminLoginId.toLowerCase().includes(adminLoginId)) &&
      (filters.targetType === 'ALL' || log.targetType === filters.targetType) &&
      (filters.action === 'ALL' || log.action === filters.action),
  );
};

// ADM-MON-04 관리자 활동 이력 (조건을 바꾸면 바로 목록에 반영, 이력은 수정·삭제 불가)
export default function ActivityLogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters: ActivityLogFilters = {
    adminLoginId: searchParams.get('admin') ?? '',
    targetType: (searchParams.get('target') as ActivityLogFilters['targetType']) ?? 'ALL',
    action: (searchParams.get('action') as ActivityLogFilters['action']) ?? 'ALL',
    period: (searchParams.get('period') as MonitoringPeriod) ?? '7d',
    from: searchParams.get('from'),
    to: searchParams.get('to'),
  };
  const [adminLoginId, setAdminLoginId] = useState(filters.adminLoginId);

  const logs = filterPreview(ACTIVITY_LOGS_PREVIEW, filters);
  const selectedId = searchParams.get('log') ?? logs[0]?.activityLogId ?? null;
  const selected = logs.find((log) => log.activityLogId === selectedId) ?? null;

  const updateFilters = (next: Partial<ActivityLogFilters>) => {
    const merged = { ...filters, ...next };
    const params = new URLSearchParams();
    if (merged.adminLoginId.trim()) params.set('admin', merged.adminLoginId.trim());
    if (merged.targetType !== 'ALL') params.set('target', merged.targetType);
    if (merged.action !== 'ALL') params.set('action', merged.action);
    if (merged.period !== '7d') params.set('period', merged.period);
    if (merged.period === 'custom' && merged.from && merged.to) {
      params.set('from', merged.from);
      params.set('to', merged.to);
    }
    setSearchParams(params, { replace: true });
  };

  const handleApplyAdmin = () => {
    if (adminLoginId.trim() !== filters.adminLoginId) updateFilters({ adminLoginId });
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleApplyAdmin();
  };
  const handleSelect = (log: ActivityLog) => {
    const params = new URLSearchParams(searchParams);
    params.set('log', log.activityLogId);
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-4 gap-3 rounded-[14px] border border-motu-border bg-white px-6 py-5"
      >
        <Field label="관리자" htmlFor="filter-admin">
          <TextInput
            id="filter-admin"
            placeholder="아이디"
            value={adminLoginId}
            onChange={(event) => setAdminLoginId(event.target.value)}
            onBlur={handleApplyAdmin}
          />
        </Field>
        <Field label="작업 대상" htmlFor="filter-target">
          <Select
            id="filter-target"
            options={ACTIVITY_TARGET_FILTER_OPTIONS}
            value={filters.targetType}
            // 대상을 바꾸면 수행 작업은 '전체'로 초기화합니다.
            onChange={(targetType) => updateFilters({ targetType, action: 'ALL' })}
          />
        </Field>
        <Field label="수행 작업" htmlFor="filter-action">
          <Select
            id="filter-action"
            options={getActivityActionFilterOptions(filters.targetType)}
            value={filters.action}
            onChange={(action) => updateFilters({ action })}
          />
        </Field>
        <Field label="작업 기간" htmlFor="filter-period">
          <MonitoringPeriodField
            id="filter-period"
            period={filters.period}
            from={filters.from}
            to={filters.to}
            onChange={updateFilters}
          />
        </Field>
      </form>

      <Table
        columns={COLUMNS}
        rows={logs}
        getRowKey={(row) => row.activityLogId}
        gridClassName="grid-cols-[2fr_2fr_2fr_3fr_1.5fr]"
        emptyMessage="조건에 맞는 활동 이력이 없습니다."
        onRowClick={handleSelect}
        selectedRowKey={selected?.activityLogId ?? null}
      />

      {selected && (
        <InfoCard
          title="선택 이력 상세"
          items={[
            { label: '변경 전', value: selected.before || '-' },
            { label: '변경 후', value: selected.after || '-' },
            { label: '처리 사유', value: selected.reason || '-' },
            { label: '접속 IP', value: selected.ipAddress },
            { label: '처리일시', value: formatDateTimeText(selected.createdAt) },
          ]}
        />
      )}

      <Notice>활동 이력은 운영 기록이므로 수정·삭제할 수 없습니다.</Notice>
    </div>
  );
}
