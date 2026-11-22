import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getActivityLogs } from '@/apis/activityLog';
import { getDashboardKpis, getTradeTrend } from '@/apis/dashboard';
import type { DateRange } from '@/components/common/DateRangePicker';
import { RECENT_ACTIVITY_COUNT, RECENT_ACTIVITY_DAYS } from '@/constants/dashboard';
import { ACTIVITY_LOGS_QUERY_KEY } from '@/queries/useActivityLogsQuery';
import type { TradeRange } from '@/types/dashboard';
import {
  toAdminActivity,
  toDashboardStats,
  toTradeTrendChart,
  toTradeTrendParams,
} from '@/utils/dashboard';

export const DASHBOARD_QUERY_KEY = ['admin', 'dashboard'];

const DAY_MS = 24 * 60 * 60 * 1000;

// 운영 지표 카드 (진입할 때마다 최신 값으로 다시 불러옵니다)
export const useDashboardKpisQuery = () =>
  useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'kpis'],
    queryFn: getDashboardKpis,
    select: toDashboardStats,
    staleTime: 0,
  });

// 최근 7일 운영 작업 중 최신 4건 (시각 역순)
export const useRecentActivitiesQuery = () =>
  useQuery({
    queryKey: [...ACTIVITY_LOGS_QUERY_KEY, 'dashboard'],
    queryFn: () =>
      getActivityLogs({
        from: new Date(Date.now() - RECENT_ACTIVITY_DAYS * DAY_MS).toISOString(),
        page: 1,
        size: RECENT_ACTIVITY_COUNT,
      }),
    select: (data) => data.items.map(toAdminActivity),
    staleTime: 0,
  });

// 거래량·거래대금 추이 (구간을 바꾸는 동안 이전 차트를 유지해 깜빡이지 않게 합니다)
export const useTradeTrendQuery = (range: TradeRange, customRange: DateRange) => {
  const params = toTradeTrendParams(range, customRange);
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'trade-trend', params],
    queryFn: () => getTradeTrend(params),
    select: toTradeTrendChart,
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
};
