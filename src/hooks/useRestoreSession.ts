import { useEffect } from 'react';

import { refreshAccessToken } from '@/apis/instance';
import { useAuthStore } from '@/stores/useAuthStore';
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
      if (!accessToken) tokenStorage.clear();
      setStatus(accessToken ? 'authenticated' : 'unauthenticated');
    });
  }, [setStatus]);
};
