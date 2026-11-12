import { create } from 'zustand';

// checking: 새로고침 직후 Refresh 토큰으로 세션을 복구하는 중
export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  setStatus: (status: AuthStatus) => void;
};

// 토큰은 여기에 저장하지 않습니다. (tokenStorage 사용)
export const useAuthStore = create<AuthState>((set) => ({
  status: 'checking',
  setStatus: (status) => set({ status }),
}));
