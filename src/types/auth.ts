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

export type LoginRequest = {
  loginId: string;
  password: string;
};

export type LoginResponse = TokenResponse & {
  verificationRequired: false;
  user: LoginUser;
};

// 새 기기 확인이 필요한 경우입니다. 관리자 웹은 기기 ID 를 보내지 않으므로 받지 않습니다.
export type LoginVerificationRequiredResponse = {
  verificationRequired: true;
};

// 비밀번호 오입력 시 error.details 로 내려오는 실패 횟수입니다.
export type LoginFailureDetails = {
  failCount?: number;
  maxFailCount?: number;
};

// 관리자 접근 차단 화면(ADM-AUTH-01-E01)에 넘기는 계정 상태입니다.
export type BlockedAdminStatus = 'SUSPENDED' | 'WITHDRAWN';

export type BlockedAdminAccount = {
  status: BlockedAdminStatus;
  // 로그인 API 는 정지 사유·처리일을 내려주지 않아 값이 없으면 표시하지 않습니다.
  reason?: string;
  // YYYY.MM.DD
  processedAt?: string;
};
