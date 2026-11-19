import { useQuery } from '@tanstack/react-query';

import { getActivityLogs } from '@/apis/activityLog';
import type { ActivityTargetType } from '@/types/admin';
import { toLocalDateTime } from '@/utils/date';

export const ACTIVITY_LOGS_QUERY_KEY = ['admin', 'activity-logs'];

// 대상(회원·상품 등)의 가장 최근 관리자 처리 이력 1건
export const useRecentActivityLogQuery = (targetType: ActivityTargetType, targetId: number) =>
  useQuery({
    queryKey: [...ACTIVITY_LOGS_QUERY_KEY, 'recent', { targetType, targetId }],
    queryFn: () => getActivityLogs({ targetType, targetId, page: 1, size: 1 }),
    select: (data) => {
      const log = data.items[0];
      return log ? { ...log, createdAt: toLocalDateTime(log.createDate) } : null;
    },
    enabled: Number.isInteger(targetId) && targetId > 0,
  });
