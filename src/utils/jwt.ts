import type { UserRole } from '@/types/auth';

// Access 토큰(JWT) payload 의 role 을 읽습니다. 서명 검증은 서버가 하므로 화면 분기에만 씁니다.
// 새로고침 후 Refresh 토큰으로 세션을 복구할 때는 응답에 회원 정보가 없어 토큰에서 확인합니다.
export const getTokenRole = (accessToken: string): UserRole | null => {
  try {
    const payload = accessToken.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))) as {
      role?: unknown;
    };
    return json.role === 'ADMIN' || json.role === 'USER' ? json.role : null;
  } catch {
    return null;
  }
};
