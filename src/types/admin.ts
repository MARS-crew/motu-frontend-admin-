import type { MonitoringPeriod } from '@/types/monitoring';

// 모든 관리자 계정은 같은 ADMIN 권한을 갖습니다. (ACTIVE 정상, SUSPENDED 정지)
export type AdminAccountStatus = 'ACTIVE' | 'SUSPENDED';

export type AdminAccount = {
  adminId: string;
  loginId: string;
  name: string;
  email: string;
  status: AdminAccountStatus;
  // 담당 업무 (참고값)
  duty: string;
  // YYYY-MM-DD
  createdAt: string;
  // YYYY-MM-DDTHH:mm, 로그인 이력이 없으면 null
  lastLoginAt: string | null;
};

export type AdminAccountFilters = {
  // 아이디·이름·이메일
  keyword: string;
  status: AdminAccountStatus | 'ALL';
};

// 백엔드 관리자 활동 이력 enum 과 같은 값을 씁니다.
export type ActivityTargetType =
  'LISTING_APPLICATION' | 'STOCK' | 'USER' | 'ADMIN' | 'NOTICE' | 'ANOMALY';

export type ActivityAction =
  | 'LISTING_APPROVE'
  | 'LISTING_REVISION_REQUEST'
  | 'LISTING_REJECT'
  | 'STOCK_UPDATE'
  | 'STOCK_PAUSE'
  | 'STOCK_RESUME'
  | 'STOCK_CLOSE'
  | 'USER_STATUS_CHANGE'
  | 'USER_UNLOCK'
  | 'POINT_GRANT'
  | 'POINT_RECALL'
  | 'ADMIN_CREATE'
  | 'ADMIN_STATUS_CHANGE'
  | 'NOTICE_PUBLISH'
  | 'NOTICE_HIDE'
  | 'NOTICE_DELETE'
  | 'NOTICE_UPDATE'
  | 'ANOMALY_ACTION';

export type ActivityResult = 'SUCCESS' | 'FAILURE';

// 활동 이력 목록 행
export type ActivityLog = {
  // 숫자 문자열
  activityLogId: string;
  // YYYY-MM-DDTHH:mm (KST)
  createdAt: string;
  adminLoginId: string;
  targetType: ActivityTargetType;
  // PRD-018 · SaaS Index, USR-1024 · motuuser 같은 화면 표기용 대상
  targetLabel: string;
  action: ActivityAction;
  result: ActivityResult;
};

// 선택한 활동 이력의 변경 전·후 값과 사유
export type ActivityLogDetail = {
  before: string;
  after: string;
  reason: string;
  // 마스킹된 접속 IP
  ipAddress: string;
};

export type ActivityLogFilters = {
  adminLoginId: string;
  targetType: ActivityTargetType | 'ALL';
  action: ActivityAction | 'ALL';
  period: MonitoringPeriod;
  from: string | null;
  to: string | null;
  // 1부터
  page: number;
};

// GET /admin/activity-logs 목록 항목
export type AdminActivityLogItem = {
  activityLogId: number;
  // ISO 일시 (UTC)
  createDate: string;
  adminId: number;
  adminLoginId: string;
  targetType: ActivityTargetType;
  targetId: number;
  // 처리 당시 대상 이름 (상품명, 아이디, 공지 제목 등)
  targetLabel: string;
  action: ActivityAction;
  result: ActivityResult;
  summary: string;
};

// GET /admin/activity-logs/{activityLogId}
export type AdminActivityLogResponse = AdminActivityLogItem & {
  // { 항목: 값 }
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  reason: string;
  ipAddress: string;
};

export type AdminActivityLogsParams = {
  adminLoginId?: string;
  targetType?: ActivityTargetType;
  targetId?: number;
  action?: ActivityAction;
  from?: string;
  to?: string;
  page: number;
  size: number;
};
