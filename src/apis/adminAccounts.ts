import { api } from '@/apis/instance';
import type { CreateAdminAccountRequest } from '@/types/admin';
import type { ApiResponse } from '@/types/api';

// 로그인한 관리자 본인의 비밀번호 변경 (임시 비밀번호 → 새 비밀번호)
export const patchMyAdminPassword = async (currentPassword: string, newPassword: string) => {
  await api.patch('/admin/admin-accounts/me/password', { currentPassword, newPassword });
};

// 관리자 계정 생성 (임시 비밀번호를 등록 이메일로 보내고, 최초 로그인 시 비밀번호를 바꾸게 합니다)
export const postAdminAccount = async (body: CreateAdminAccountRequest) => {
  const { data } = await api.post<ApiResponse<{ userId: number; loginId: string }>>(
    '/admin/admin-accounts',
    body,
  );
  return data.data;
};
