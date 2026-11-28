import { api } from '@/apis/instance';
import type { ApiResponse } from '@/types/api';
import type { LoginRequest, LoginResponse, LoginVerificationRequiredResponse } from '@/types/auth';

// 관리자도 사용자와 같은 로그인 API 를 쓰고, 응답의 role 로 관리자 여부를 확인합니다.
export const postLogin = async (body: LoginRequest) => {
  const { data } = await api.post<ApiResponse<LoginResponse | LoginVerificationRequiredResponse>>(
    '/auth/login',
    body,
  );
  return data.data;
};

export const postLogout = async (refreshToken: string) => {
  await api.post('/auth/logout', { refreshToken });
};

// 관리자 비밀번호 재설정 링크를 등록 이메일로 보냅니다. (응답 data 는 null)
export const postAdminPasswordReset = async (email: string) => {
  await api.post('/auth/admin/password-reset', { email });
};

// 재설정 메일 링크의 token 을 아직 쓸 수 있는지 확인합니다. (새 비밀번호 화면 진입 시)
export const postVerifyAdminPasswordReset = async (token: string) => {
  const { data } = await api.post<ApiResponse<{ valid: boolean }>>(
    '/auth/admin/password-reset/verify',
    { token },
  );
  return data.data;
};

// 새 비밀번호를 설정합니다. 성공하면 서버가 기존 로그인 세션을 모두 만료합니다.
export const postConfirmAdminPasswordReset = async (token: string, newPassword: string) => {
  await api.post('/auth/admin/password-reset/confirm', { token, newPassword });
};
