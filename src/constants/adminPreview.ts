import type { ActivityLog, AdminAccount } from '@/types/admin';

// TODO(MOTU-29-1): 관리자 계정 API 연동 후 제거합니다.
// 퍼블리싱 확인용 예시 데이터입니다. (Figma 19 · 관리자 계정, 21 · 관리자 활동 이력)
export const ADMIN_ACCOUNTS_PREVIEW: AdminAccount[] = [
  {
    adminId: 'ADM-001',
    loginId: 'admin01',
    name: '김관리',
    email: 'kim@motu.app',
    status: 'ACTIVE',
    duty: '상장 심사',
    createdAt: '2026-08-20',
    lastLoginAt: '2026-08-31T22:18',
  },
  {
    adminId: 'ADM-002',
    loginId: 'admin02',
    name: '박운영',
    email: 'park@motu.app',
    status: 'ACTIVE',
    duty: '운영 참고',
    createdAt: '2026-08-22',
    lastLoginAt: '2026-08-31T20:20',
  },
  {
    adminId: 'ADM-003',
    loginId: 'admin03',
    name: '이기획',
    email: 'lee@motu.app',
    status: 'SUSPENDED',
    duty: '기획 참고',
    createdAt: '2026-08-25',
    lastLoginAt: '2026-08-29T17:10',
  },
];

// TODO(MOTU-29-1): 로그인한 관리자 정보로 교체합니다. (본인 계정 정지 방지에 사용)
export const CURRENT_ADMIN_LOGIN_ID_PREVIEW = 'admin01';

export const getAdminAccountPreview = (loginId: string) =>
  ADMIN_ACCOUNTS_PREVIEW.find((account) => account.loginId === loginId) ?? null;

// TODO(MOTU-29-1): 관리자 활동 이력 API(GET /admin/activity-logs) 연동 후 제거합니다.
export const ACTIVITY_LOGS_PREVIEW: ActivityLog[] = [
  {
    activityLogId: 'LOG-0312',
    createdAt: '2026-09-03T20:10',
    adminLoginId: 'admin01',
    targetType: 'STOCK',
    targetLabel: 'PRD-018',
    action: 'STOCK_PAUSE',
    result: 'SUCCESS',
    before: '거래 가능',
    after: '거래 중지',
    reason: '가격 데이터 점검',
    ipAddress: '192.168.***.***',
  },
  {
    activityLogId: 'LOG-0311',
    createdAt: '2026-09-03T18:22',
    adminLoginId: 'admin02',
    targetType: 'USER',
    targetLabel: 'USR-1024',
    action: 'USER_STATUS_CHANGE',
    result: 'SUCCESS',
    before: '정상',
    after: '정지',
    reason: '운영정책 위반에 따른 이용 정지',
    ipAddress: '10.0.***.***',
  },
  {
    activityLogId: 'LOG-0310',
    createdAt: '2026-09-03T16:08',
    adminLoginId: 'admin01',
    targetType: 'USER',
    targetLabel: 'USR-0441',
    action: 'POINT_RECALL',
    result: 'SUCCESS',
    before: '2,345,678 P',
    after: '2,295,678 P',
    reason: '이벤트 중복 지급분 회수',
    ipAddress: '192.168.***.***',
  },
  {
    activityLogId: 'LOG-0309',
    createdAt: '2026-09-02T11:40',
    adminLoginId: 'admin02',
    targetType: 'NOTICE',
    targetLabel: 'NTC-20260820-011',
    action: 'NOTICE_HIDE',
    result: 'SUCCESS',
    before: '게시 중',
    after: '비공개',
    reason: '게시 기간 종료에 따라 공지를 비공개 처리합니다.',
    ipAddress: '10.0.***.***',
  },
  {
    activityLogId: 'LOG-0308',
    createdAt: '2026-09-01T09:15',
    adminLoginId: 'admin01',
    targetType: 'ADMIN',
    targetLabel: 'admin03',
    action: 'ADMIN_STATUS_CHANGE',
    result: 'SUCCESS',
    before: '정상',
    after: '정지',
    reason: '내부 권한 회수',
    ipAddress: '192.168.***.***',
  },
];
