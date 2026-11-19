import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { InfoCard } from '@/components/common/InfoCard';
import { PageHeading } from '@/components/common/PageHeading';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import { TextArea } from '@/components/common/TextArea';
import { MEMBER_STATUS_LABELS } from '@/constants/member';
import { useUnlockMemberMutation } from '@/queries/useMemberMutations';
import { useMemberDetailQuery } from '@/queries/useMembersQuery';
import { getApiErrorMessage } from '@/utils/apiError';
import { Notice } from '@/components/common/Notice';
import { getMemberDetailPath } from '@/constants/routes';
import type { MemberUnlockForm } from '@/schemas/memberSchema';
import { memberUnlockSchema } from '@/schemas/memberSchema';
import { formatDateTimeText } from '@/utils/date';

// ADM-MBR-02-02 계정 잠금 해제 (로그인 5회 누적 실패로 잠긴 계정)
export default function MemberUnlockPage() {
  const { memberId = '' } = useParams();
  const navigate = useNavigate();

  const { data: member } = useMemberDetailQuery(Number(memberId));
  const { mutate: unlock, isPending, error } = useUnlockMemberMutation(Number(memberId));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberUnlockForm>({
    resolver: zodResolver(memberUnlockSchema),
    defaultValues: { reason: '' },
  });

  if (!member || member.status !== 'LOCKED') {
    return (
      <div className="flex flex-col gap-5">
        <PageHeading title="계정 잠금 해제" />
        <PlaceholderSection
          description={
            member ? '잠금 상태인 회원만 해제할 수 있습니다.' : '회원 정보를 불러오는 중입니다.'
          }
        />
      </div>
    );
  }

  const detailPath = getMemberDetailPath(member.memberId);
  // 취소하면 잠금 상태를 유지하고 회원 상세로 돌아갑니다.
  const handleCancel = () => void navigate(detailPath);
  // 로그인 실패 횟수를 0회로 초기화하고, 변경 전·후 상태·사유·처리자는 서버가 활동 이력에 저장합니다.
  const handleUnlock = (form: MemberUnlockForm) =>
    unlock(form.reason.trim(), { onSuccess: () => void navigate(detailPath, { replace: true }) });

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="계정 잠금 해제" />
      <InfoCard
        items={[
          { label: '대상 회원', value: member.loginId },
          { label: '계정 상태', value: MEMBER_STATUS_LABELS[member.status] },
          { label: '잠금 사유', value: member.lockReason ?? '-' },
          {
            label: '최근 접속',
            value: member.lastLoginAt ? formatDateTimeText(member.lastLoginAt) : '-',
          },
        ]}
      />
      <form
        noValidate
        onSubmit={handleSubmit(handleUnlock)}
        className="flex flex-col gap-5 rounded-[14px] border border-motu-border bg-white p-6"
      >
        <Field label="해제 사유 *" htmlFor="reason" errorMessage={errors.reason?.message}>
          <TextArea
            id="reason"
            maxLength={200}
            hasError={Boolean(errors.reason)}
            {...register('reason')}
          />
        </Field>
        {error && <Notice tone="danger">{getApiErrorMessage(error)}</Notice>}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit" disabled={isPending}>
            잠금 해제
          </Button>
        </div>
      </form>
    </div>
  );
}
