import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/common/Button';
import { Chip } from '@/components/common/Chip';
import { Field } from '@/components/common/Field';
import { InfoCard } from '@/components/common/InfoCard';
import { Notice } from '@/components/common/Notice';
import { PageHeading } from '@/components/common/PageHeading';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import { TextArea } from '@/components/common/TextArea';
import { PointInput } from '@/components/member/PointInput';
import { useAdjustMemberPointsMutation } from '@/queries/useMemberMutations';
import { useMemberDetailQuery } from '@/queries/useMembersQuery';
import { getApiErrorMessage } from '@/utils/apiError';
import { getMemberDetailPath } from '@/constants/routes';
import type { MemberPointsForm } from '@/schemas/memberSchema';
import { createMemberPointsSchema, toPointNumber } from '@/schemas/memberSchema';
import type { MemberPointsType } from '@/types/member';
import { formatNumber } from '@/utils/format';

const TYPE_OPTIONS: { value: MemberPointsType; label: string }[] = [
  { value: 'GRANT', label: '지급' },
  { value: 'REVOKE', label: '회수' },
];

// ADM-MBR-02-03 회원 포인트 지급 및 회수 (예약 포인트는 회수 대상에서 제외)
export default function MemberPointsPage() {
  const { memberId = '' } = useParams();
  const navigate = useNavigate();

  const { data: member } = useMemberDetailQuery(Number(memberId));
  const {
    mutate: adjustPoints,
    isPending,
    error,
  } = useAdjustMemberPointsMutation(Number(memberId));
  const availablePoints = member?.availablePoints ?? 0;
  const schema = createMemberPointsSchema(availablePoints);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberPointsForm>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'GRANT', amount: '', reason: '' },
  });
  const [type, amountText] = useWatch({ control, name: ['type', 'amount'] });

  if (!member) {
    return (
      <div className="flex flex-col gap-5">
        <PageHeading title="회원 포인트 지급 / 회수" />
        <PlaceholderSection description="회원 정보를 불러오는 중입니다." />
      </div>
    );
  }

  const isRevoke = type === 'REVOKE';
  const amount = toPointNumber(amountText);
  const expectedPoints = Number.isNaN(amount)
    ? null
    : availablePoints + (isRevoke ? -amount : amount);

  const detailPath = getMemberDetailPath(member.memberId);
  // 취소하면 포인트 변경 없이 회원 상세로 돌아갑니다.
  const handleCancel = () => void navigate(detailPath);
  // 지급은 양수, 회수는 음수로 보냅니다. 처리 내용은 서버가 활동 이력에 저장합니다.
  const handleProcess = (form: MemberPointsForm) => {
    const points = toPointNumber(form.amount);
    adjustPoints(
      { amount: form.type === 'REVOKE' ? -points : points, reason: form.reason.trim() },
      { onSuccess: () => void navigate(detailPath, { replace: true }) },
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="회원 포인트 지급 / 회수" />
      <InfoCard
        items={[
          { label: '대상 회원', value: member.loginId },
          { label: '사용 가능 포인트', value: `${formatNumber(member.availablePoints)} P` },
          { label: '예약 포인트', value: `${formatNumber(member.reservedPoints)} P` },
        ]}
      />
      <form
        noValidate
        onSubmit={handleSubmit(handleProcess)}
        className="flex flex-col gap-5 rounded-[14px] border border-motu-border bg-white p-6"
      >
        <fieldset>
          <legend className="mb-5 text-label-md font-medium text-motu-text-secondary">
            처리 유형
          </legend>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <div className="flex gap-2">
                {TYPE_OPTIONS.map((option) => (
                  <Chip
                    key={option.value}
                    isSelected={field.value === option.value}
                    onClick={() => field.onChange(option.value)}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            )}
          />
        </fieldset>

        <div className="flex items-start gap-4">
          <Field
            label="처리 포인트 *"
            htmlFor="amount"
            errorMessage={errors.amount?.message}
            className="w-80"
          >
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <PointInput
                  id="amount"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  hasError={Boolean(errors.amount)}
                />
              )}
            />
          </Field>
          {expectedPoints !== null && (
            <p className="mt-6 flex h-11 items-center text-body-sm font-bold text-motu-text-primary">
              처리 후 예상 {formatNumber(expectedPoints)} P
            </p>
          )}
        </div>

        {isRevoke && (
          <Notice>
            예약 포인트 {formatNumber(member.reservedPoints)} P는 회수 대상에서 제외됩니다.
          </Notice>
        )}

        <Field label="처리 사유 *" htmlFor="reason" errorMessage={errors.reason?.message}>
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
          <Button type="submit" variant={isRevoke ? 'danger' : 'primary'} disabled={isPending}>
            {isRevoke ? '회수 처리' : '지급 처리'}
          </Button>
        </div>
      </form>
    </div>
  );
}
