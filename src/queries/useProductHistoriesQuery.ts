import { useQuery } from '@tanstack/react-query';

import { getActivityLog, getActivityLogs } from '@/apis/activityLog';
import { PRODUCT_HISTORY_SIZE } from '@/constants/product';
import { toProductHistory, toProductHistoryDetail } from '@/utils/product';

export const ACTIVITY_LOGS_QUERY_KEY = ['admin', 'activity-logs'];

// 상품 변경 이력 = 이 상품을 대상으로 한 관리자 활동 이력 (최신순)
export const useProductHistoriesQuery = (stockId: number) =>
  useQuery({
    queryKey: [...ACTIVITY_LOGS_QUERY_KEY, 'list', { targetType: 'STOCK', targetId: stockId }],
    queryFn: () =>
      getActivityLogs({
        targetType: 'STOCK',
        targetId: stockId,
        page: 1,
        size: PRODUCT_HISTORY_SIZE,
      }),
    select: (data) => data.items.map(toProductHistory),
  });

// 선택한 이력의 변경 전·후 값과 사유
export const useProductHistoryDetailQuery = (activityLogId: number | null) =>
  useQuery({
    queryKey: [...ACTIVITY_LOGS_QUERY_KEY, 'detail', activityLogId],
    queryFn: () => getActivityLog(activityLogId ?? 0),
    select: toProductHistoryDetail,
    enabled: activityLogId !== null,
  });
