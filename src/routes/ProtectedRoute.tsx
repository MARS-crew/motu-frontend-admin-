import { Navigate, Outlet, useLocation } from 'react-router';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';

// 로그인한 관리자만 접근할 수 있는 라우트입니다.
export function ProtectedRoute() {
  const status = useAuthStore((state) => state.status);
  const isPasswordChangeRequired = useAuthStore((state) => state.isPasswordChangeRequired);
  const location = useLocation();

  // 새로고침 직후 세션 복구 중에는 아무것도 그리지 않습니다.
  if (status === 'checking') return null;

  if (status === 'unauthenticated') {
    // 로그인 후 원래 보던 화면으로 돌아갈 수 있도록 경로를 넘깁니다.
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  // 임시 비밀번호를 바꾸기 전에는 최초 비밀번호 변경 화면 외에는 들어갈 수 없습니다.
  if (isPasswordChangeRequired && location.pathname !== ROUTES.PASSWORD_CHANGE) {
    return <Navigate to={ROUTES.PASSWORD_CHANGE} replace />;
  }

  return <Outlet />;
}
