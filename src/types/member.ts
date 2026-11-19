// 백엔드 회원 상태와 같은 값을 씁니다. ACTIVE 정상, LOCKED 잠금(로그인 5회 누적 실패), BLOCKED 정지
export type MemberStatus = 'ACTIVE' | 'LOCKED' | 'BLOCKED';

export type MemberSummary = {
  // 주소·API 에 쓰는 회원 ID (숫자 문자열)
  memberId: string;
  loginId: string;
  nickname: string;
  // sun***@mail.com
  maskedEmail: string;
  // YYYY-MM-DD
  joinedAt: string;
  status: MemberStatus;
  // YYYY-MM-DDTHH:mm (KST), 로그인한 적이 없으면 null
  lastLoginAt: string | null;
};

// 관리자 처리 이력 (상태 변경·잠금 해제·포인트 처리 등)
export type MemberProcessHistory = {
  // YYYY-MM-DDTHH:mm
  processedAt: string;
  actionType: string;
  adminId: string;
  reason: string;
};

export type MemberDetail = MemberSummary & {
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  // 010-****-1234, 2차 보안을 설정하지 않았으면 null
  maskedPhone: string | null;
  // YYYY-MM-DDTHH:mm, 인증 이력이 없으면 null
  lastTwoFactorAt: string | null;
  availablePoints: number;
  // 미체결 주문에 묶인 포인트 (회수 대상에서 제외)
  reservedPoints: number;
  holdingProductCount: number;
  openOrderCount: number;
  // 잠금 상태일 때만 값이 있습니다.
  lockReason: string | null;
};

export type MemberFilters = {
  loginId: string;
  nickname: string;
  status: MemberStatus | 'ALL';
  // 1부터 시작
  page: number;
};

// 이상 거래 상세(ADM-MON-02)에서 회원 정지로 진입하면 사유를 채워 넘기고, 처리 후 그 화면으로 돌아갑니다.
export type MemberStatusLocationState = {
  status?: MemberStatus;
  reason?: string;
  returnTo?: string;
  anomalyId?: number;
} | null;

export type MemberPointsType = 'GRANT' | 'REVOKE';

// GET /admin/users 목록 항목
export type AdminUserItem = {
  userId: number;
  loginId: string;
  nickname: string;
  // 가린 이메일
  email: string;
  // 가입일시 (ISO, UTC)
  createDate: string;
  userStatus: MemberStatus;
  lastLoginDate: string | null;
};

// GET /admin/users/{userId}
export type AdminUserResponse = AdminUserItem & {
  security: {
    emailVerified: boolean;
    twoFactorStatus: 'NOT_SET' | 'ENABLED' | 'DISABLED';
    twoFactorPhoneNumber: string | null;
    twoFactorVerifiedDate: string | null;
    loginFailCount: number;
  };
  asset: {
    availableCash: number;
    // 매수 주문에 묶인 포인트 (회수할 수 없음)
    lockedCash: number;
    holdingCount: number;
    openOrderCount: number;
  };
};

export type AdminUsersParams = {
  loginId?: string;
  nickname?: string;
  status?: MemberStatus;
  page: number;
  size: number;
};

// PATCH /admin/users/{userId}/status
export type ChangeUserStatusRequest = {
  status: MemberStatus;
  reason: string;
  // 정지(BLOCKED)일 때만 보낼 수 있고, 그 이상 거래를 처리완료로 바꿉니다.
  anomalyId?: number;
};

// PATCH /admin/accounts/{userId}/cash 응답
export type AdjustCashResponse = {
  amount: number;
  cashBefore: number;
  cashAfter: number;
};
