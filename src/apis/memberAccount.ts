import { api } from '@/apis/instance';
import type { ApiResponse } from '@/types/api';
import type { AdjustCashResponse } from '@/types/member';

// 회원 포인트 지급(양수)·회수(음수). 사용 가능 포인트보다 많이 회수할 수 없습니다.
export const patchAdminAccountCash = async (userId: number, amount: number, reason: string) => {
  const { data } = await api.patch<ApiResponse<AdjustCashResponse>>(
    `/admin/accounts/${userId}/cash`,
    { amount, reason },
  );
  return data.data;
};
