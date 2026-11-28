import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postAdminPasswordReset, postConfirmAdminPasswordReset } from '@/apis/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { tokenStorage } from '@/utils/tokenStorage';

export const useRequestPasswordResetMutation = () =>
  useMutation({
    mutationFn: (email: string) => postAdminPasswordReset(email),
    retry: false,
  });

export const useConfirmPasswordResetMutation = () => {
  const queryClient = useQueryClient();
  const setStatus = useAuthStore((state) => state.setStatus);

  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      postConfirmAdminPasswordReset(token, newPassword),
    retry: false,
    // 서버가 기존 로그인 세션을 모두 만료하므로, 이 브라우저에 남은 세션도 정리합니다.
    // (로그인 상태로 남아 있으면 로그인 화면이 대시보드로 되돌려 보냅니다)
    onSuccess: () => {
      tokenStorage.clear();
      queryClient.clear();
      setStatus('unauthenticated');
    },
  });
};
