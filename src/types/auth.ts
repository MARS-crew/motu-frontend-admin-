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
