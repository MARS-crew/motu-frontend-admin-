import { ACTIVITY_ACTION_LABELS, ACTIVITY_RESULT_LABELS } from '@/constants/admin';
import type { AdminActivityLogItem } from '@/types/admin';
import type { DateRange } from '@/components/common/DateRangePicker';
import type {
  AdminActivity,
  DashboardKpisResponse,
  DashboardStats,
  TradeRange,
  TradeTrendApiRange,
  TradeTrendChart,
  TradeTrendResponse,
  TradeTrendUnit,
} from '@/types/dashboard';
import { toActivityLog } from '@/utils/activityLog';
import { formatMonthDay, formatShortDate, toISODate, toLocalDateTime } from '@/utils/date';

export const toDashboardStats = (kpis: DashboardKpisResponse): DashboardStats => ({
  memberCount: kpis.userCount,
  memberChangeRate: kpis.userChangeRate,
  listedProductCount: kpis.listedStockCount,
  listedProductChange: kpis.listedStockChange,
  pendingCount: kpis.pendingCount,
  pendingChange: kpis.pendingChange,
  pendingListingCount: kpis.pendingListingCount,
  pendingInquiryCount: kpis.pendingInquiryCount,
  abnormalTradeCount: kpis.anomalyCount,
  abnormalTradeChange: kpis.anomalyChange,
});

// 최근 운영 이력 한 줄: 20:10 admin01 · PRD-018 · SaaS Index / 상품 거래 중지 · 완료
export const toAdminActivity = (log: AdminActivityLogItem): AdminActivity => {
  const activity = toActivityLog(log);
  return {
    id: activity.activityLogId,
    time: activity.createdAt.slice(11, 16),
    adminName: activity.adminLoginId,
    targetId: activity.targetLabel,
    action: ACTIVITY_ACTION_LABELS[activity.action] ?? activity.action,
    result: ACTIVITY_RESULT_LABELS[activity.result],
  };
};

const TRADE_RANGE_API_VALUES: Record<TradeRange, TradeTrendApiRange> = {
  '1h': 'HOUR_1',
  '6h': 'HOUR_6',
  '1d': 'DAY_1',
  '1w': 'WEEK_1',
  '1m': 'MONTH_1',
  all: 'ALL',
  custom: 'CUSTOM',
};

// 조회 구간 → API 파라미터 (직접 설정은 KST 시작·종료일, 종료일 포함)
export const toTradeTrendParams = (range: TradeRange, customRange: DateRange) =>
  range === 'custom' && customRange.start && customRange.end
    ? {
        range: TRADE_RANGE_API_VALUES.custom,
        from: toISODate(customRange.start),
        to: toISODate(customRange.end),
      }
    : { range: TRADE_RANGE_API_VALUES[range === 'custom' ? 'all' : range] };

// X축 눈금 개수 (양 끝 포함)
const X_LABEL_COUNT = 5;

// 구간 시작 시각 → X축 라벨 (분·시간 단위는 09:00, 일별은 09.11, 월별은 26.09)
const formatBucketTime = (time: string, unit: TradeTrendUnit) => {
  const local = toLocalDateTime(time);
  if (unit === 'DAY') return formatMonthDay(local.slice(0, 10));
  if (unit === 'MONTH') return formatShortDate(local).slice(0, 5);
  return local.slice(11, 16);
};

// 구간 중 양 끝을 포함해 고르게 5개를 골라 X축 라벨로 씁니다.
const toXLabels = ({ buckets, unit }: TradeTrendResponse) => {
  if (buckets.length === 0) return [];
  const count = Math.min(X_LABEL_COUNT, buckets.length);
  return Array.from({ length: count }, (_, index) => {
    const bucketIndex = count === 1 ? 0 : Math.round((index * (buckets.length - 1)) / (count - 1));
    return formatBucketTime(buckets[bucketIndex].time, unit);
  });
};

export const toTradeTrendChart = (response: TradeTrendResponse): TradeTrendChart => ({
  periodLabel: response.periodLabel,
  xLabels: toXLabels(response),
  metrics: {
    volume: {
      total: response.totalVolume,
      values: response.buckets.map((bucket) => bucket.volume),
    },
    amount: {
      total: response.totalTradeAmount,
      values: response.buckets.map((bucket) => bucket.tradeAmount),
    },
  },
});
