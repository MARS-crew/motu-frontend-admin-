import { create } from 'zustand';

// checking: 새로고침 직후 Refresh 토큰으로 세션을 복구하는 중
export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  // 임시 비밀번호로 로그인해 비밀번호를 바꿔야 하는 상태 (바꾸기 전에는 다른 관리자 메뉴 차단)
  isPasswordChangeRequired: boolean;
  setStatus: (status: AuthStatus) => void;
  setPasswordChangeRequired: (isRequired: boolean) => void;
};

// 토큰은 여기에 저장하지 않습니다. (tokenStorage 사용)
export const useAuthStore = create<AuthState>((set) => ({
  status: 'checking',
  isPasswordChangeRequired: false,
  // 로그아웃·세션 만료 시 비밀번호 변경 대기 상태도 함께 지웁니다.
  setStatus: (status) =>
    set((state) => ({
      status,
      isPasswordChangeRequired:
        status === 'unauthenticated' ? false : state.isPasswordChangeRequired,
    })),
  setPasswordChangeRequired: (isPasswordChangeRequired) => set({ isPasswordChangeRequired }),
}));
