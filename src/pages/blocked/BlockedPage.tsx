import { useLocation, useNavigate } from 'react-router';

import { AuthCard } from '@/components/auth/AuthCard';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Notice } from '@/components/common/Notice';
import { BLOCKED_ADMIN_ACCOUNT_PREVIEW } from '@/constants/authPreview';
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
  // TODO(MOTU-18-1): 로그인 API 연동 후 예시 데이터 대신 전달받은 계정 상태만 사용합니다.
  const account = (location.state as BlockedAdminAccount | null) ?? BLOCKED_ADMIN_ACCOUNT_PREVIEW;

  const handleBackToLogin = () => void navigate(ROUTES.LOGIN, { replace: true });

  return (
    <AuthCard title={TITLES[account.status]} badge={<Badge tone="danger">접근 차단</Badge>}>
      <Notice tone="danger" className="w-full">
        <p>
          {REASON_LABELS[account.status]}: {account.reason}
        </p>
        <p>처리일: {account.processedAt}</p>
      </Notice>
      <div className="flex w-full justify-end">
        <Button variant="secondary" onClick={handleBackToLogin}>
          로그인으로 돌아가기
        </Button>
      </div>
    </AuthCard>
  );
}
