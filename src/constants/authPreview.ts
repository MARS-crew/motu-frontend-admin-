import type { BlockedAdminAccount } from '@/types/auth';

// TODO(MOTU-18-1): 로그인 API 연동 후 로그인 응답의 계정 상태로 교체합니다.
// 퍼블리싱 확인용 예시 데이터입니다.
export const BLOCKED_ADMIN_ACCOUNT_PREVIEW: BlockedAdminAccount = {
  status: 'SUSPENDED',
  reason: '내부 권한 회수',
  processedAt: '2026.08.31',
};
