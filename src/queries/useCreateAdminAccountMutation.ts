import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postAdminAccount } from '@/apis/adminAccounts';
import { ACTIVITY_LOGS_QUERY_KEY } from '@/queries/useActivityLogsQuery';
import type { CreateAdminAccountRequest } from '@/types/admin';

export const useCreateAdminAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAdminAccountRequest) => postAdminAccount(body),
    retry: false,
    // 계정 생성은 관리자 활동 이력(ADMIN_CREATE)에 남습니다.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY }),
  });
};
