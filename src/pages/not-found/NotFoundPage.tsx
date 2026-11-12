import { Link } from 'react-router';

import { ROUTES } from '@/constants/routes';

export default function NotFoundPage() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-4 bg-motu-bg">
      <h1 className="text-title-lg font-bold text-motu-text-primary">페이지를 찾을 수 없습니다.</h1>
      <Link
        to={ROUTES.DASHBOARD}
        className="text-body-md font-medium text-motu-text-secondary underline"
      >
        대시보드로 이동
      </Link>
    </main>
  );
}
