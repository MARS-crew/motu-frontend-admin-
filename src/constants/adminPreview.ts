import type { AdminAccount } from '@/types/admin';

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
