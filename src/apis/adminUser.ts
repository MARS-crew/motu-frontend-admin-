import { api } from '@/apis/instance';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { AdminUserItem, AdminUserResponse, AdminUsersParams } from '@/types/member';

// 회원 목록 (가입일 최신순)
export const getAdminUsers = async (params: AdminUsersParams) => {
  const { data } = await api.get<ApiResponse<PageResponse<AdminUserItem>>>('/admin/users', {
    params,
  });
  return data.data;
};

export const getAdminUser = async (userId: number) => {
  const { data } = await api.get<ApiResponse<AdminUserResponse>>(`/admin/users/${userId}`);
  return data.data;
};
