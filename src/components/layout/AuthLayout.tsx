import { Outlet } from 'react-router';

import { usePageTitle } from '@/routes/routeHandle';

// 로그인·비밀번호 재설정 등 사이드바·헤더 없이 가운데 카드만 보이는 화면 레이아웃입니다.
export function AuthLayout() {
  usePageTitle();

  return (
    <main className="flex min-h-full items-center justify-center bg-motu-bg p-6">
      <Outlet />
    </main>
  );
}
