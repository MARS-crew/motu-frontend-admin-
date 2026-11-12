import type { Location } from 'react-router';
import { Navigate, Outlet, useLocation } from 'react-router';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';

type RedirectState = { from?: Location } | null;

// 로그인 전에만 접근하는 라우트입니다.
// 로그인 상태가 되면 ProtectedRoute 가 넘겨준 원래 경로(없으면 대시보드)로 이동합니다.
export function PublicOnlyRoute() {
  const status = useAuthStore((state) => state.status);
  const location = useLocation();

  if (status === 'checking') return null;

  if (status === 'authenticated') {
    const from = (location.state as RedirectState)?.from;
    const to = from ? `${from.pathname}${from.search}${from.hash}` : ROUTES.DASHBOARD;
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}
