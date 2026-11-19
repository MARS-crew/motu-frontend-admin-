import type {
  ActivityLog,
  ActivityLogDetail,
  ActivityLogFilters,
  AdminActivityLogItem,
  AdminActivityLogResponse,
  AdminActivityLogsParams,
} from '@/types/admin';
import { toLocalDateTime } from '@/utils/date';
import { formatMemberCode } from '@/utils/member';
import { toPeriodParams } from '@/utils/monitoring';
import { formatProductCode } from '@/utils/product';

export const toActivityLogsParams = (
  filters: ActivityLogFilters,
  size: number,
): AdminActivityLogsParams => ({
  adminLoginId: filters.adminLoginId.trim() || undefined,
  targetType: filters.targetType === 'ALL' ? undefined : filters.targetType,
  action: filters.action === 'ALL' ? undefined : filters.action,
  ...toPeriodParams(filters),
  page: filters.page,
  size,
});

// 상품·회원은 화면 표기 ID 를 앞에 붙입니다. (PRD-018 · SaaS Index)
const toTargetLabel = (log: AdminActivityLogItem) => {
  if (log.targetType === 'STOCK') return `${formatProductCode(log.targetId)} · ${log.targetLabel}`;
  if (log.targetType === 'USER') return `${formatMemberCode(log.targetId)} · ${log.targetLabel}`;
  return log.targetLabel;
};

export const toActivityLog = (log: AdminActivityLogItem): ActivityLog => ({
  activityLogId: String(log.activityLogId),
  createdAt: toLocalDateTime(log.createDate),
  adminLoginId: log.adminLoginId,
  targetType: log.targetType,
  targetLabel: toTargetLabel(log),
  action: log.action,
  result: log.result,
});

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

// { 항목: 값 } → '항목: 값' 줄 목록
const formatValues = (values: Record<string, unknown> | null) => {
  const entries = Object.entries(values ?? {});
  return entries.length > 0
    ? entries.map(([field, value]) => `${field}: ${formatValue(value)}`).join('\n')
    : '-';
};

export const toActivityLogDetail = (log: AdminActivityLogResponse): ActivityLogDetail => ({
  before: formatValues(log.before),
  after: formatValues(log.after),
  reason: log.reason || '-',
  ipAddress: log.ipAddress || '-',
});
