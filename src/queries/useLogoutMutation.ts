import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postLogout } from '@/apis/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { tokenStorage } from '@/utils/tokenStorage';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const setStatus = useAuthStore((state) => state.setStatus);

  return useMutation({
    mutationFn: async () => {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) await postLogout(refreshToken);
    },
    // 서버 요청 성공 여부와 관계없이 이 브라우저의 세션은 정리합니다.
    onSettled: () => {
      tokenStorage.clear();
      queryClient.clear();
      setStatus('unauthenticated');
    },
  });
};
