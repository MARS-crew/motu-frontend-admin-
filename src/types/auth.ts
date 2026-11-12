export type UserRole = 'USER' | 'ADMIN';

export type LoginUser = {
  userId: number;
  loginId: string;
  nickname: string;
  role: UserRole;
};

export type TokenResponse = {
  accessToken: string;
  // Access 토큰 유효시간 (초)
  accessTokenExpiresIn: number;
  // 재발급할 때마다 새 값으로 바뀝니다.
  refreshToken: string;
};

export type LoginResponse = TokenResponse & {
  verificationRequired: false;
  user: LoginUser;
};

// 관리자 접근 차단 화면(ADM-AUTH-01-E01)에 넘기는 계정 상태입니다.
export type BlockedAdminStatus = 'SUSPENDED' | 'WITHDRAWN';

export type BlockedAdminAccount = {
  status: BlockedAdminStatus;
  reason: string;
  // YYYY.MM.DD
  processedAt: string;
};
