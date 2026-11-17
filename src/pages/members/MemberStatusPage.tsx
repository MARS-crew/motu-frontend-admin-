import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router';

import { Button } from '@/components/common/Button';
import { Chip } from '@/components/common/Chip';
import { Field } from '@/components/common/Field';
import { InfoCard } from '@/components/common/InfoCard';
import { PageHeading } from '@/components/common/PageHeading';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import { TextArea } from '@/components/common/TextArea';
import { MEMBER_STATUS_LABELS } from '@/constants/member';
import { getMemberDetailPreview } from '@/constants/memberPreview';
import { getMemberDetailPath } from '@/constants/routes';
import type { MemberStatusForm } from '@/schemas/memberSchema';
import { createMemberStatusSchema } from '@/schemas/memberSchema';
import type { MemberStatus, MemberStatusLocationState } from '@/types/member';

const STATUS_OPTIONS = Object.keys(MEMBER_STATUS_LABELS) as MemberStatus[];

// ADM-MBR-02-01 회원 상태 변경 (정지 회원은 로그인이 제한되며 문의를 통해 해제)
export default function MemberStatusPage() {
  const { memberId = '' } = useParams();
  const navigate = useNavigate();
  const state = useLocation().state as MemberStatusLocationState;

  // TODO(MOTU-27-1): 회원 상세 API 연동
  const member = getMemberDetailPreview(memberId);
  const currentStatus = member?.status ?? 'ACTIVE';
  const schema = createMemberStatusSchema(currentStatus);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberStatusForm>({
    resolver: zodResolver(schema),
    defaultValues: { status: state?.status ?? currentStatus, reason: state?.reason ?? '' },
  });

  if (!member) {
    return (
      <div className="flex flex-col gap-5">
        <PageHeading title="회원 상태 변경" />
        <PlaceholderSection description="회원을 찾을 수 없습니다." />
      </div>
    );
  }

  // 기본은 회원 상세로, 이상 거래 상세에서 들어왔으면 그 화면으로 돌아갑니다.
  const returnPath = state?.returnTo ?? getMemberDetailPath(member.memberId);
  const handleCancel = () => void navigate(returnPath);
  // TODO(MOTU-28-1): 회원 상태 변경 API 연동 (변경 전·후 상태, 사유, 처리자·시각 저장)
  const handleChangeStatus = () => void navigate(returnPath, { replace: true });

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="회원 상태 변경" />
      <InfoCard
        items={[
          { label: '대상 회원', value: member.loginId },
          { label: '닉네임', value: member.nickname },
          { label: '현재 상태', value: MEMBER_STATUS_LABELS[member.status] },
        ]}
      />
      <form
        noValidate
        onSubmit={handleSubmit(handleChangeStatus)}
        className="flex flex-col gap-5 rounded-[14px] border border-motu-border bg-white p-6"
      >
        <fieldset>
          <legend className="mb-5 text-label-md font-medium text-motu-text-secondary">
            변경 상태
          </legend>
          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <Chip
                      key={status}
                      isSelected={field.value === status}
                      onClick={() => field.onChange(status)}
                    >
                      {MEMBER_STATUS_LABELS[status]}
                    </Chip>
                  ))}
                </div>
              )}
            />
            {errors.status && (
              <p role="alert" className="text-label-md font-medium text-motu-btn-red">
                {errors.status.message}
              </p>
            )}
          </div>
        </fieldset>
        <Field label="변경 사유 *" htmlFor="reason" errorMessage={errors.reason?.message}>
          <TextArea
            id="reason"
            maxLength={200}
            hasError={Boolean(errors.reason)}
            {...register('reason')}
          />
        </Field>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit">상태 변경</Button>
        </div>
      </form>
    </div>
  );
}
