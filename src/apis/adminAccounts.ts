import { api } from '@/apis/instance';

// 로그인한 관리자 본인의 비밀번호 변경 (임시 비밀번호 → 새 비밀번호)
export const patchMyAdminPassword = async (currentPassword: string, newPassword: string) => {
  await api.patch('/admin/admin-accounts/me/password', { currentPassword, newPassword });
};
