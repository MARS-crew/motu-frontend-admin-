import type {
  AbnormalTradeDetail,
  AbnormalTradeSummary,
  AnomaliesParams,
  AnomalyItem,
  AnomalyResponse,
  MonitoringFilters,
  MonitoringPeriod,
} from '@/types/monitoring';
import { addDays, parseISODate, toISODate, toKSTStartOfDay, toLocalDateTime } from '@/utils/date';
import { formatNumber } from '@/utils/format';
import { formatMemberCode } from '@/utils/member';
import { formatProductCode } from '@/utils/product';

const HOUR_MS = 60 * 60 * 1000;

const PRESET_HOURS: Record<Exclude<MonitoringPeriod, 'custom'>, number> = {
  '24h': 24,
  '7d': 24 * 7,
  '30d': 24 * 30,
};

// 발생 기간 → API from·to (최근 N시간은 조회하는 시점 기준, 직접 설정은 KST 날짜 기준)
const toPeriodParams = (filters: MonitoringFilters) => {
  if (filters.period !== 'custom') {
    return { from: new Date(Date.now() - PRESET_HOURS[filters.period] * HOUR_MS).toISOString() };
  }
  const to = parseISODate(filters.to);
  return {
    from: filters.from ? toKSTStartOfDay(filters.from) : undefined,
    to: to ? toKSTStartOfDay(toISODate(addDays(to, 1))) : undefined,
  };
};

export const toAnomaliesParams = (filters: MonitoringFilters, size: number): AnomaliesParams => ({
  type: filters.type === 'ALL' ? undefined : filters.type,
  status: filters.status === 'ALL' ? undefined : filters.status,
  keyword: filters.targetId.trim() || undefined,
  ...toPeriodParams(filters),
  page: filters.page,
  size,
});

export const toAbnormalTradeSummary = (item: AnomalyItem): AbnormalTradeSummary => ({
  alertId: String(item.anomalyId),
  detectedAt: toLocalDateTime(item.detectedDate),
  type: item.type,
  productId: item.stockId === null ? null : String(item.stockId),
  productCode: item.stockId === null ? null : formatProductCode(item.stockId),
  productName: item.stockName,
  memberId: String(item.userId),
  memberCode: formatMemberCode(item.userId),
  memberLoginId: item.loginId,
  errorMessage: item.errorMessage,
  status: item.status,
});

const formatEvidenceValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'number') return formatNumber(value);
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export const toAbnormalTradeDetail = (response: AnomalyResponse): AbnormalTradeDetail => ({
  ...toAbnormalTradeSummary(response),
  memberNickname: response.nickname,
  orderId: response.orderId === null ? null : String(response.orderId),
  tradeId: response.tradeId === null ? null : String(response.tradeId),
  evidences: Object.entries(response.evidence ?? {}).map(([label, value]) => ({
    label,
    value: formatEvidenceValue(value),
  })),
  action: response.action,
  actionReason: response.actionReason,
  handlerLoginId: response.handledBy?.loginId ?? null,
  handledAt: response.handledDate ? toLocalDateTime(response.handledDate) : null,
});
