import { useQuery } from '@tanstack/react-query';

import { postVerifyAdminPasswordReset } from '@/apis/auth';

export const PASSWORD_RESET_TOKEN_QUERY_KEY = ['admin-password-reset'] as const;

// 재설정 메일 링크의 token 을 확인합니다. token 이 없으면 확인하지 않습니다.
export const usePasswordResetTokenQuery = (token: string) =>
  useQuery({
    queryKey: [...PASSWORD_RESET_TOKEN_QUERY_KEY, token],
    queryFn: () => postVerifyAdminPasswordReset(token),
    enabled: token !== '',
    retry: false,
    // 링크는 한 번만 쓸 수 있으므로, 화면을 다시 열면 다시 확인합니다.
    gcTime: 0,
  });
