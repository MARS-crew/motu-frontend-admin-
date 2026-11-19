import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getAnomalies, getAnomaly } from '@/apis/anomaly';
import { MONITORING_PAGE_SIZE } from '@/constants/monitoring';
import type { MonitoringFilters } from '@/types/monitoring';
import {
  toAbnormalTradeDetail,
  toAbnormalTradeSummary,
  toAnomaliesParams,
} from '@/utils/monitoring';

export const ANOMALIES_QUERY_KEY = ['admin', 'anomalies'];

export const useAnomaliesQuery = (filters: MonitoringFilters) =>
  useQuery({
    queryKey: [...ANOMALIES_QUERY_KEY, 'list', filters],
    queryFn: () => getAnomalies(toAnomaliesParams(filters, MONITORING_PAGE_SIZE)),
    select: (data) => ({
      trades: data.items.map(toAbnormalTradeSummary),
      totalPages: Math.max(Math.ceil(data.totalCount / MONITORING_PAGE_SIZE), 1),
      summary: data.summary,
    }),
    // 페이지·조회 조건을 바꾸는 동안 이전 목록을 유지해 깜빡이지 않게 합니다.
    placeholderData: keepPreviousData,
  });

// 이상 거래 상세 (주소의 ID 가 숫자가 아니면 조회하지 않습니다)
export const useAnomalyDetailQuery = (anomalyId: number) =>
  useQuery({
    queryKey: [...ANOMALIES_QUERY_KEY, 'detail', anomalyId],
    queryFn: () => getAnomaly(anomalyId),
    select: toAbnormalTradeDetail,
    enabled: Number.isInteger(anomalyId) && anomalyId > 0,
  });
