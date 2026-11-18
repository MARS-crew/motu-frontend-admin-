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
