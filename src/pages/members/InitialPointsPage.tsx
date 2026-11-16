import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import type { InfoItem } from '@/components/common/InfoCard';
import { InfoCard } from '@/components/common/InfoCard';
import { InfoRow } from '@/components/common/InfoRow';
import { Modal } from '@/components/common/Modal';
import { Notice } from '@/components/common/Notice';
import { PageHeading } from '@/components/common/PageHeading';
import { TextArea } from '@/components/common/TextArea';
import { PointInput } from '@/components/member/PointInput';
import { INITIAL_POINTS_PREVIEW } from '@/constants/memberPreview';
import { ROUTES } from '@/constants/routes';
import type { InitialPointsForm } from '@/schemas/memberSchema';
import { initialPointsSchema } from '@/schemas/memberSchema';
import { formatNumber } from '@/utils/format';

// ADM-MBR-03 초기 지급 포인트 설정 (이후 가입하는 신규 회원부터 적용)
export default function InitialPointsPage() {
  const navigate = useNavigate();
  const [confirmRows, setConfirmRows] = useState<InfoItem[] | null>(null);

  // TODO(MOTU-28-1): 초기 지급 포인트 조회 API 연동
  const currentPoints = INITIAL_POINTS_PREVIEW;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InitialPointsForm>({
    resolver: zodResolver(initialPointsSchema),
    defaultValues: { amount: '', reason: '' },
  });

  // 취소하면 기존 값을 유지하고 회원 목록으로 돌아갑니다.
  const handleCancel = () => void navigate(ROUTES.MEMBERS);
  const handleOpenConfirm = (form: InitialPointsForm) =>
    setConfirmRows([
      { label: '변경 전', value: `${formatNumber(currentPoints)} P` },
      { label: '변경 후', value: `${form.amount} P` },
      { label: '변경 사유', value: form.reason.trim() },
    ]);
  // TODO(MOTU-28-1): 초기 지급 포인트 변경 API 연동 (변경 전·후 금액, 사유, 담당 관리자, 변경 일시 저장)
  const handleSave = () => {
    setConfirmRows(null);
    void navigate(ROUTES.MEMBERS, { replace: true });
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="초기 지급 포인트 설정" />
      <InfoCard
        items={[{ label: '현재 초기 지급 포인트', value: `${formatNumber(currentPoints)} P` }]}
      />
      <form
        noValidate
        onSubmit={handleSubmit(handleOpenConfirm)}
        className="flex flex-col gap-5 rounded-[14px] border border-motu-border bg-white p-6"
      >
        <Field
          label="변경 금액 *"
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
        <Field label="변경 사유 *" htmlFor="reason" errorMessage={errors.reason?.message}>
          <TextArea
            id="reason"
            maxLength={200}
            hasError={Boolean(errors.reason)}
            {...register('reason')}
          />
        </Field>
        <Notice>
          변경 금액은 이후 가입하는 신규 회원부터 적용되며 기존 회원에게 소급 적용되지 않음.
        </Notice>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit">설정 변경</Button>
        </div>
      </form>

      <Modal
        isOpen={Boolean(confirmRows)}
        onClose={() => setConfirmRows(null)}
        size="md"
        title="초기 지급 포인트를 변경할까요?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirmRows(null)}>
              취소
            </Button>
            <Button onClick={handleSave}>설정 변경</Button>
          </>
        }
      >
        <dl className="flex flex-col gap-3.5">
          {confirmRows?.map((row) => (
            <InfoRow key={row.label} label={row.label} value={row.value} />
          ))}
        </dl>
        <Notice>이후 가입하는 신규 회원부터 적용되며 기존 회원에게 소급 적용되지 않습니다.</Notice>
      </Modal>
    </div>
  );
}
