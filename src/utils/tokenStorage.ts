import { REFRESH_TOKEN_KEY } from '@/constants/storageKeys';

// 서버가 토큰을 응답 body 로 내려주므로(httpOnly 쿠키 미지원) 아래처럼 나눠서 보관합니다.
// - Access 토큰: 메모리에만 보관합니다. (XSS 로 저장소를 읽어도 노출되지 않음)
// - Refresh 토큰: sessionStorage 에 보관합니다. 탭을 닫으면 사라지고, 새로고침 시 세션 복구에만 씁니다.
// localStorage 에는 토큰을 저장하지 않습니다.
let accessToken: string | null = null;

const readRefreshToken = () => {
  try {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const tokenStorage = {
  getAccessToken: () => accessToken,
  getRefreshToken: readRefreshToken,
  setTokens: (nextAccessToken: string, refreshToken: string) => {
    accessToken = nextAccessToken;
    try {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch {
      // 저장소를 쓸 수 없는 환경이면 새로고침 시 다시 로그인합니다.
    }
  },
  clear: () => {
    accessToken = null;
    try {
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // 무시합니다.
    }
  },
};
