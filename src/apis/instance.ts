import type { InternalAxiosRequestConfig } from 'axios';
import { create, isAxiosError } from 'axios';

import { API_URL } from '@/constants/env';
import { ADMIN_PASSWORD_CHANGE_REQUIRED, AUTH_TOKEN_EXPIRED } from '@/constants/errorCodes';
import { useAuthStore } from '@/stores/useAuthStore';
import type { ApiResponse } from '@/types/api';
import type { TokenResponse } from '@/types/auth';
import { getApiError } from '@/utils/apiError';
import { tokenStorage } from '@/utils/tokenStorage';

export const api = create({
  baseURL: API_URL,
  timeout: 10_000,
});

// 재발급 요청은 인터셉터를 거치지 않도록 별도 인스턴스로 보냅니다. (401 무한 반복 방지)
const refreshClient = create({ baseURL: API_URL, timeout: 10_000 });

type RetryableRequestConfig = InternalAxiosRequestConfig & { isRetried?: boolean };

// 동시에 여러 요청이 만료돼도 재발급은 한 번만 합니다.
let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = () => {
  refreshPromise ??= (async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return null;
    try {
      const { data } = await refreshClient.post<ApiResponse<TokenResponse>>('/auth/refresh', {
        refreshToken,
      });
      tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken);
      return data.data.accessToken;
    } catch {
      return null;
    }
  })().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
};

const expireSession = () => {
  tokenStorage.clear();
  useAuthStore.getState().setStatus('unauthenticated');
};

api.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    // 새로고침 등으로 로그인 응답을 다시 받지 못해도, 서버가 비밀번호 변경을 요구하면 변경 화면으로 보냅니다.
    if (getApiError(error)?.code === ADMIN_PASSWORD_CHANGE_REQUIRED) {
      useAuthStore.getState().setPasswordChangeRequired(true);
      return Promise.reject(error);
    }
    if (!isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const config = error.config as RetryableRequestConfig | undefined;
    if (getApiError(error)?.code === AUTH_TOKEN_EXPIRED && config && !config.isRetried) {
      config.isRetried = true;
      const accessToken = await refreshAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return api(config);
      }
    }

    expireSession();
    return Promise.reject(error);
  },
);
