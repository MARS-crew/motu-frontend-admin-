import { Navigate, useLocation, useNavigate } from 'react-router';

import { AuthCard } from '@/components/auth/AuthCard';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Notice } from '@/components/common/Notice';
import { ROUTES } from '@/constants/routes';
import type { BlockedAdminAccount, BlockedAdminStatus } from '@/types/auth';

const TITLES: Record<BlockedAdminStatus, string> = {
  SUSPENDED: '정지된 관리자 계정입니다.',
  WITHDRAWN: '탈퇴한 관리자 계정입니다.',
};

const REASON_LABELS: Record<BlockedAdminStatus, string> = {
  SUSPENDED: '정지 사유',
  WITHDRAWN: '탈퇴 사유',
};

// ADM-AUTH-01-E01 관리자 접근 차단 (정지·탈퇴 계정)
// 로그인 화면에서 navigate(ROUTES.BLOCKED, { state: BlockedAdminAccount }) 로 진입합니다.
export default function BlockedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const account = location.state as BlockedAdminAccount | null;

  // 로그인 화면을 거치지 않고 들어오면 보여줄 계정 상태가 없으므로 로그인으로 보냅니다.
  if (!account) return <Navigate to={ROUTES.LOGIN} replace />;

  const handleBackToLogin = () => void navigate(ROUTES.LOGIN, { replace: true });

  return (
    <AuthCard title={TITLES[account.status]} badge={<Badge tone="danger">접근 차단</Badge>}>
      <Notice tone="danger" className="w-full">
        {account.reason ? (
          <p>
            {REASON_LABELS[account.status]}: {account.reason}
          </p>
        ) : (
          <p>관리자 메뉴를 사용할 수 없습니다. 다른 관리자에게 계정 상태를 확인해 주세요.</p>
        )}
        {account.processedAt && <p>처리일: {account.processedAt}</p>}
      </Notice>
      <div className="flex w-full justify-end">
        <Button variant="secondary" onClick={handleBackToLogin}>
          로그인으로 돌아가기
        </Button>
      </div>
    </AuthCard>
  );
}
