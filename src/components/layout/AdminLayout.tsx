import { Outlet } from 'react-router';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { usePageTitle } from '@/routes/routeHandle';

// 로그인 후 화면 공통 레이아웃입니다. (헤더 + 사이드바 + 본문)
export function AdminLayout() {
  const title = usePageTitle();

  return (
    <div className="flex h-full min-w-[1280px] flex-col">
      <Header title={title} />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-y-auto bg-motu-bg p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
