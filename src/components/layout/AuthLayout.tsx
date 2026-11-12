import { Outlet } from 'react-router';

import { usePageTitle } from '@/routes/routeHandle';

// 로그인·비밀번호 재설정 등 로그인 전 화면 레이아웃입니다. (회색 배경 가운데 카드)
export function AuthLayout() {
  usePageTitle();

  return (
    <main className="flex min-h-full items-center justify-center bg-motu-bg p-6">
      <div className="w-full max-w-[440px] rounded-[20px] border border-motu-border bg-white p-8">
        <Outlet />
      </div>
    </main>
  );
}
