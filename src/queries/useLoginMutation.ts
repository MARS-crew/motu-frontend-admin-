import { useMutation } from '@tanstack/react-query';

import { postLogin, postLogout } from '@/apis/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { NotAdminAccountError } from '@/utils/authError';
import { tokenStorage } from '@/utils/tokenStorage';

export const useLoginMutation = () => {
  const setStatus = useAuthStore((state) => state.setStatus);

  return useMutation({
    mutationFn: async (body: Parameters<typeof postLogin>[0]) => {
      const result = await postLogin(body);
      // 관리자 웹은 기기 ID 를 보내지 않아 새 기기 확인 응답을 받지 않습니다. (받으면 일반 실패로 처리)
      if (result.verificationRequired) throw new Error('새 기기 확인 응답은 처리하지 않습니다.');
      if (result.user.role !== 'ADMIN') {
        // 일반 회원 토큰은 쓰지 않고 바로 폐기합니다.
        await postLogout(result.refreshToken).catch(() => undefined);
        throw new NotAdminAccountError();
      }
      return result;
    },
    retry: false,
    // 로그인 상태가 되면 PublicOnlyRoute 가 원래 보던 화면(없으면 대시보드)으로 이동합니다.
    onSuccess: ({ accessToken, refreshToken }) => {
      tokenStorage.setTokens(accessToken, refreshToken);
      setStatus('authenticated');
    },
  });
};
