import { Link } from 'react-router';

import { buttonClassName } from '@/components/common/buttonClassName';
import { AdminMenu } from '@/components/layout/AdminMenu';
import type { HeaderAction } from '@/routes/routeHandle';

type HeaderProps = {
  title: string;
  // 제목 오른쪽 보조 버튼 (예: 거래 모니터링 → 서비스 주요 지표)
  action?: HeaderAction;
};

export function Header({ title, action }: HeaderProps) {
  return (
    <header className="flex h-header shrink-0 items-center gap-4 border-b border-motu-border bg-white pr-8">
      <p className="w-sidebar shrink-0 pl-7 text-title-md font-bold text-motu-text-primary">
        모투 관리자
      </p>
      <h1 className="min-w-0 flex-1 truncate text-title-lg font-bold text-motu-text-primary">
        {title}
      </h1>
      {action && (
        <Link to={action.to} className={buttonClassName({ variant: 'secondary', size: 'sm' })}>
          {action.label}
        </Link>
      )}
      <AdminMenu />
    </header>
  );
}
