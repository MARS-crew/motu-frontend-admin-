import { useMutation, useQueryClient } from '@tanstack/react-query';

import { patchAdminAccountCash } from '@/apis/adminAccount';
import { patchAdminUserStatus, postUnlockAdminUser } from '@/apis/adminUser';
import { ACTIVITY_LOGS_QUERY_KEY } from '@/queries/useActivityLogsQuery';
import { ANOMALIES_QUERY_KEY } from '@/queries/useAnomaliesQuery';
import { MEMBERS_QUERY_KEY } from '@/queries/useMembersQuery';
import type { ChangeUserStatusRequest } from '@/types/member';

// 회원을 바꾸면 회원 목록·상세와 관리자 처리 이력을 다시 불러옵니다.
export const useInvalidateMember = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY }),
      // 이상 거래 상세에서 넘어온 조치는 그 이상 거래도 처리완료로 바뀝니다.
      queryClient.invalidateQueries({ queryKey: ANOMALIES_QUERY_KEY }),
    ]);
};

export const useChangeMemberStatusMutation = (userId: number) => {
  const invalidate = useInvalidateMember();
  return useMutation({
    mutationFn: (body: ChangeUserStatusRequest) => patchAdminUserStatus(userId, body),
    retry: false,
    onSuccess: invalidate,
  });
};

export const useUnlockMemberMutation = (userId: number) => {
  const invalidate = useInvalidateMember();
  return useMutation({
    mutationFn: (reason: string) => postUnlockAdminUser(userId, reason),
    retry: false,
    onSuccess: invalidate,
  });
};

// 포인트 지급·회수 (amount 가 음수면 회수)
export const useAdjustMemberPointsMutation = (userId: number) => {
  const invalidate = useInvalidateMember();
  return useMutation({
    mutationFn: ({ amount, reason }: { amount: number; reason: string }) =>
      patchAdminAccountCash(userId, amount, reason),
    retry: false,
    onSuccess: invalidate,
  });
};
