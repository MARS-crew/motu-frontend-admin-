import { api } from '@/apis/instance';
import type { ApiResponse, PageResponse } from '@/types/api';
import type {
  AdminUserItem,
  AdminUserResponse,
  AdminUsersParams,
  ChangeUserStatusRequest,
} from '@/types/member';

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

// 회원 상태 변경 (이상 거래 상세에서 정지하면 anomalyId 를 함께 보냅니다)
export const patchAdminUserStatus = async (userId: number, body: ChangeUserStatusRequest) => {
  await api.patch(`/admin/users/${userId}/status`, body);
};

// 계정 잠금 해제 (로그인 실패 횟수를 0회로 초기화)
export const postUnlockAdminUser = async (userId: number, reason: string) => {
  await api.post(`/admin/users/${userId}/unlock`, { reason });
};
