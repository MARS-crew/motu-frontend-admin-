import { useMutation } from '@tanstack/react-query';

import { patchMyAdminPassword } from '@/apis/adminAccounts';
import { useAuthStore } from '@/stores/useAuthStore';

export const useChangeMyPasswordMutation = () => {
  const setPasswordChangeRequired = useAuthStore((state) => state.setPasswordChangeRequired);

  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => patchMyAdminPassword(currentPassword, newPassword),
    retry: false,
    // 변경이 끝나면 다른 관리자 메뉴 차단을 풉니다.
    onSuccess: () => setPasswordChangeRequired(false),
  });
};
