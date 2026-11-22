import { ACTIVITY_ACTION_LABELS, ACTIVITY_RESULT_LABELS } from '@/constants/admin';
import type { AdminActivityLogItem } from '@/types/admin';
import type { AdminActivity, DashboardKpisResponse, DashboardStats } from '@/types/dashboard';
import { toActivityLog } from '@/utils/activityLog';

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
