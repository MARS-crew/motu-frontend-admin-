import { api } from '@/apis/instance';

export const postLogout = async (refreshToken: string) => {
  await api.post('/auth/logout', { refreshToken });
};
