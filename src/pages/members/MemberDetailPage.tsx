import { Link, useParams } from 'react-router';

import { buttonClassName } from '@/components/common/buttonClassName';
import { InfoCard } from '@/components/common/InfoCard';
import { Notice } from '@/components/common/Notice';
import { PageHeading } from '@/components/common/PageHeading';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import { MemberStatusBadge } from '@/components/member/MemberStatusBadge';
import { ACTIVITY_ACTION_LABELS } from '@/constants/admin';
import { getMemberPointsPath, getMemberStatusPath, getMemberUnlockPath } from '@/constants/routes';
import { useMemberListPath } from '@/hooks/useMemberListPath';
import { useRecentActivityLogQuery } from '@/queries/useActivityLogsQuery';
import { useMemberDetailQuery } from '@/queries/useMembersQuery';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatDateTimeText, formatSpacedDate } from '@/utils/date';
import { formatNumber } from '@/utils/format';

// ADM-MBR-02 회원 상세 (가입·인증·자산·활동 정보와 관리 기능 진입)
export default function MemberDetailPage() {
  const { memberId = '' } = useParams();
  const listPath = useMemberListPath();

  const { data: member, isPending, isError, error } = useMemberDetailQuery(Number(memberId));
  const { data: history } = useRecentActivityLogQuery('USER', Number(memberId));

  const listLink = (
    <Link to={listPath} className={buttonClassName({ variant: 'secondary', size: 'sm' })}>
      목록으로
    </Link>
  );

  if (!member) {
    const description = isError
      ? getApiErrorMessage(error)
      : isPending && Number(memberId) > 0
        ? '회원 정보를 불러오는 중입니다.'
        : '회원을 찾을 수 없습니다.';
    return (
      <div className="flex flex-col gap-5">
        <PageHeading title="회원 상세" action={listLink} />
        <PlaceholderSection description={description} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="회원 상세" action={listLink} />

      <section className="flex items-center gap-8 rounded-[14px] border border-motu-border bg-white px-6 py-5 text-body-sm font-medium text-motu-text-secondary">
        <h3 className="text-title-md font-bold text-motu-text-primary">{member.loginId}</h3>
        <p>닉네임 {member.nickname}</p>
        <p>이메일 {member.maskedEmail}</p>
        <p>가입일 {formatSpacedDate(member.joinedAt)}</p>
        <MemberStatusBadge status={member.status} />
      </section>

      <div className="grid grid-cols-2 gap-5">
        <InfoCard
          title="인증 / 계정"
          items={[
            { label: '이메일 인증', value: member.isEmailVerified ? '인증 완료' : '미인증' },
            { label: '2차 보안', value: member.isTwoFactorEnabled ? '설정 완료' : '미설정' },
            { label: '휴대폰', value: member.maskedPhone ?? '-' },
            {
              label: '최근 2차 인증',
              value: member.lastTwoFactorAt ? formatDateTimeText(member.lastTwoFactorAt) : '-',
            },
          ]}
        />
        <InfoCard
          title="자산 / 활동"
          items={[
            { label: '사용 가능 포인트', value: `${formatNumber(member.availablePoints)} P` },
            { label: '보유 상품', value: `${formatNumber(member.holdingProductCount)}종` },
            { label: '미체결 주문', value: `${formatNumber(member.openOrderCount)}건` },
            {
              label: '최근 접속',
              value: member.lastLoginAt ? formatDateTimeText(member.lastLoginAt) : '-',
            },
          ]}
        />
      </div>

      <InfoCard title="관리 기능">
        <div className="flex gap-2">
          <Link
            to={getMemberStatusPath(member.memberId)}
            className={buttonClassName({ variant: 'secondary' })}
          >
            회원 상태 변경
          </Link>
          {/* 잠금 해제는 로그인 5회 누적 실패로 잠긴 계정만 할 수 있습니다. */}
          {member.status === 'LOCKED' ? (
            <Link
              to={getMemberUnlockPath(member.memberId)}
              className={buttonClassName({ variant: 'secondary' })}
            >
              잠금 해제
            </Link>
          ) : (
            <span aria-disabled className={buttonClassName({ disabled: true })}>
              잠금 해제
            </span>
          )}
          <Link
            to={getMemberPointsPath(member.memberId)}
            className={buttonClassName({ variant: 'secondary' })}
          >
            포인트 지급/회수
          </Link>
        </div>
      </InfoCard>

      <Notice>
        최근 처리 이력&nbsp;&nbsp;
        {history
          ? `${formatDateTimeText(history.createdAt.slice(0, 10))} ${ACTIVITY_ACTION_LABELS[history.action]} / 처리자 ${history.adminLoginId} / 사유 ${history.reason || '-'}`
          : '없음'}
      </Notice>
    </div>
  );
}
