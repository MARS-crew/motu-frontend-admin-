import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getActivityLog, getActivityLogs } from '@/apis/activityLog';
import { ACTIVITY_LOG_PAGE_SIZE } from '@/constants/admin';
import type { ActivityLogFilters, ActivityTargetType } from '@/types/admin';
import { toActivityLog, toActivityLogDetail, toActivityLogsParams } from '@/utils/activityLog';
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

// 관리자 활동 이력 목록 (최신순)
export const useActivityLogsQuery = (filters: ActivityLogFilters) =>
  useQuery({
    queryKey: [...ACTIVITY_LOGS_QUERY_KEY, 'list', filters],
    queryFn: () => getActivityLogs(toActivityLogsParams(filters, ACTIVITY_LOG_PAGE_SIZE)),
    select: (data) => ({
      logs: data.items.map(toActivityLog),
      totalPages: Math.max(Math.ceil(data.totalCount / ACTIVITY_LOG_PAGE_SIZE), 1),
    }),
    // 페이지·조회 조건을 바꾸는 동안 이전 목록을 유지해 깜빡이지 않게 합니다.
    placeholderData: keepPreviousData,
  });

// 선택한 활동 이력의 변경 전·후 값, 사유, 접속 IP
export const useActivityLogDetailQuery = (activityLogId: number | null) =>
  useQuery({
    queryKey: [...ACTIVITY_LOGS_QUERY_KEY, 'detail', activityLogId],
    queryFn: () => getActivityLog(activityLogId ?? 0),
    select: toActivityLogDetail,
    enabled: activityLogId !== null,
  });
