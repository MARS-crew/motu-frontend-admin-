import { useEffect } from 'react';

import { refreshAccessToken } from '@/apis/instance';
import { useAuthStore } from '@/stores/useAuthStore';
import { getTokenRole } from '@/utils/jwt';
import { tokenStorage } from '@/utils/tokenStorage';

// Access 토큰은 메모리에만 있으므로, 새로고침하면 Refresh 토큰으로 세션을 복구합니다.
export const useRestoreSession = () => {
  const setStatus = useAuthStore((state) => state.setStatus);

  useEffect(() => {
    if (tokenStorage.getAccessToken()) {
      setStatus('authenticated');
      return;
    }
    if (!tokenStorage.getRefreshToken()) {
      setStatus('unauthenticated');
      return;
    }

    void refreshAccessToken().then((accessToken) => {
      // 관리자 권한이 없는 토큰이면 세션을 복구하지 않습니다.
      const isAdmin = accessToken !== null && getTokenRole(accessToken) === 'ADMIN';
      if (!isAdmin) tokenStorage.clear();
      setStatus(isAdmin ? 'authenticated' : 'unauthenticated');
    });
  }, [setStatus]);
};
