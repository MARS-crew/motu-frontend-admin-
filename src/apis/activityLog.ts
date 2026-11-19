import { api } from '@/apis/instance';
import type {
  AdminActivityLogItem,
  AdminActivityLogResponse,
  AdminActivityLogsParams,
} from '@/types/admin';
import type { ApiResponse, PageResponse } from '@/types/api';

// 관리자 활동 이력 (최신순)
export const getActivityLogs = async (params: AdminActivityLogsParams) => {
  const { data } = await api.get<ApiResponse<PageResponse<AdminActivityLogItem>>>(
    '/admin/activity-logs',
    { params },
  );
  return data.data;
};

export const getActivityLog = async (activityLogId: number) => {
  const { data } = await api.get<ApiResponse<AdminActivityLogResponse>>(
    `/admin/activity-logs/${activityLogId}`,
  );
  return data.data;
};
