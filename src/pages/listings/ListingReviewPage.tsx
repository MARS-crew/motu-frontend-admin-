import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/common/Button';
import { Chip } from '@/components/common/Chip';
import { Field } from '@/components/common/Field';
import { Notice } from '@/components/common/Notice';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import { Select } from '@/components/common/Select';
import { TextArea } from '@/components/common/TextArea';
import { TextInput } from '@/components/common/TextInput';
import { ListingReviewConfirmModal } from '@/components/listing/ListingReviewConfirmModal';
import {
  LISTING_REVIEW_RESULT_OPTIONS,
  LISTING_REVIEW_TEXTS,
  LISTING_REVISION_ITEM_OPTIONS,
} from '@/constants/listing';
import { useListingListPath } from '@/hooks/useListingListPath';
import { useListingApplicationQuery } from '@/queries/useListingApplicationQuery';
import type { ListingReviewForm } from '@/schemas/listingReviewSchema';
import { listingReviewSchema } from '@/schemas/listingReviewSchema';
import type { ListingReviewResult } from '@/types/listing';
import {
  useApproveListingMutation,
  useRejectListingMutation,
  useRequestListingRevisionMutation,
} from '@/queries/useListingReviewMutations';
import { getApiErrorMessage } from '@/utils/apiError';
import { toKSTDateTime } from '@/utils/date';
import { formatNumber } from '@/utils/format';

// 쉼표를 뺀 숫자 문자열 (12,000 → 12000)
const toDigits = (value: string) => value.replaceAll(',', '').trim();

// ADM-LST-03 상장 신청 심사 결과 처리 (승인 · 보완 요청 · 반려)
export default function ListingReviewPage() {
  const { applicationId = '' } = useParams();
  const navigate = useNavigate();
  const { listPath } = useListingListPath();
  const [confirmForm, setConfirmForm] = useState<ListingReviewForm | null>(null);

  const id = Number(applicationId);
  const { data: application } = useListingApplicationQuery(id);
  const approve = useApproveListingMutation(id);
  const requestRevision = useRequestListingRevisionMutation(id);
  const reject = useRejectListingMutation(id);
  const submitError = approve.error ?? requestRevision.error ?? reject.error;
  const isSubmitting = approve.isPending || requestRevision.isPending || reject.isPending;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<ListingReviewForm>({
    resolver: zodResolver(listingReviewSchema),
    // 상세를 받아오면 승인 기본값(희망 상장가·발행량)을 채웁니다. 이미 고친 값은 유지합니다.
    values: {
      result: 'approve',
      // 승인은 신청값(희망 상장가·발행량)으로 시작하고 필요하면 조정합니다.
      finalPrice: application?.desiredPrice?.toString() ?? '',
      totalSupply: application?.totalSupply?.toString() ?? '',
      listingDate: '',
      tradeStartAt: '',
      reason: '',
      revisionItem: '',
      revisionRequest: '',
      revisionDeadline: '',
    },
    resetOptions: { keepDirtyValues: true },
  });
  const result = useWatch({ control, name: 'result' });

  if (!application) return <PlaceholderSection description="상장 신청을 불러오는 중입니다." />;

  const texts = LISTING_REVIEW_TEXTS[result];
  const appliedSummary = `희망 상장가 ${formatNumber(application.desiredPrice ?? 0)}P / 신청 발행량 ${formatNumber(application.totalSupply ?? 0)}주`;

  const handleChangeResult = (value: ListingReviewResult) => {
    setValue('result', value);
    clearErrors();
  };
  // 처리 전 확인 모달을 띄웁니다.
  const handleOpenConfirm = (form: ListingReviewForm) => {
    approve.reset();
    requestRevision.reset();
    reject.reset();
    setConfirmForm(form);
  };
  const handleCloseConfirm = () => setConfirmForm(null);
  // 처리 상태와 처리자는 서버가 관리자 활동 이력에 저장합니다.
  const handleConfirm = () => {
    if (!confirmForm) return;
    const form = confirmForm;
    const options = { onSuccess: () => void navigate(listPath, { replace: true }) };

    if (form.result === 'approve') {
      const finalPrice = toDigits(form.finalPrice);
      const reason = form.reason.trim();
      approve.mutate(
        {
          reason,
          finalPrice,
          totalIssuedQuantity: toDigits(form.totalSupply),
          listingDate: form.listingDate,
          tradingStartAt: toKSTDateTime(form.tradeStartAt),
          // 희망 상장가와 다르게 정하면 같은 사유를 상장가 조정 사유로 저장합니다.
          priceAdjustmentReason:
            Number(finalPrice) !== application.desiredPrice ? reason : undefined,
        },
        options,
      );
      return;
    }
    if (form.result === 'revision') {
      const itemLabel =
        LISTING_REVISION_ITEM_OPTIONS.find((option) => option.value === form.revisionItem)?.label ??
        form.revisionItem;
      requestRevision.mutate(
        {
          requestItems: [itemLabel],
          requestContent: form.revisionRequest.trim(),
          deadline: toKSTDateTime(form.revisionDeadline),
        },
        options,
      );
      return;
    }
    reject.mutate(form.reason.trim(), options);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleOpenConfirm)}
      className="flex flex-col gap-5 rounded-[14px] border border-motu-border bg-white p-6"
    >
      <h2 className="text-title-md font-bold text-motu-text-primary">처리 결과</h2>

      <div role="radiogroup" aria-label="처리 결과" className="flex gap-2">
        {LISTING_REVIEW_RESULT_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            role="radio"
            aria-checked={result === option.value}
            isSelected={result === option.value}
            onClick={() => handleChangeResult(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>

      {result === 'approve' ? (
        <div className="grid grid-cols-4 gap-3">
          <Field label="최종 상장가" htmlFor="finalPrice" errorMessage={errors.finalPrice?.message}>
            <TextInput
              id="finalPrice"
              inputMode="numeric"
              hasError={Boolean(errors.finalPrice)}
              {...register('finalPrice')}
            />
          </Field>
          <Field label="총 발행량" htmlFor="totalSupply" errorMessage={errors.totalSupply?.message}>
            <TextInput
              id="totalSupply"
              inputMode="numeric"
              hasError={Boolean(errors.totalSupply)}
              {...register('totalSupply')}
            />
          </Field>
          <Field label="상장일" htmlFor="listingDate" errorMessage={errors.listingDate?.message}>
            <TextInput
              id="listingDate"
              type="date"
              hasError={Boolean(errors.listingDate)}
              {...register('listingDate')}
            />
          </Field>
          <Field
            label="거래 시작일시"
            htmlFor="tradeStartAt"
            errorMessage={errors.tradeStartAt?.message}
          >
            <TextInput
              id="tradeStartAt"
              type="datetime-local"
              hasError={Boolean(errors.tradeStartAt)}
              {...register('tradeStartAt')}
            />
          </Field>
        </div>
      ) : (
        // 보완 요청·반려는 신청값을 읽기 전용으로만 보여줍니다.
        <Field label="신청 내용 · 읽기 전용" htmlFor="appliedSummary">
          <TextInput id="appliedSummary" readOnly value={appliedSummary} />
        </Field>
      )}

      {result === 'revision' && (
        <>
          <Field
            label="보완 항목 *"
            htmlFor="revisionItem"
            errorMessage={errors.revisionItem?.message}
          >
            <Controller
              control={control}
              name="revisionItem"
              render={({ field }) => (
                <Select
                  id="revisionItem"
                  options={LISTING_REVISION_ITEM_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="보완 항목 선택"
                  hasError={Boolean(errors.revisionItem)}
                />
              )}
            />
          </Field>
          <Field
            label="요청 내용 *"
            htmlFor="revisionRequest"
            errorMessage={errors.revisionRequest?.message}
          >
            <TextArea
              id="revisionRequest"
              placeholder="신청자에게 보완을 요청할 내용을 입력해 주세요."
              hasError={Boolean(errors.revisionRequest)}
              {...register('revisionRequest')}
            />
          </Field>
          <Field
            label="보완 기한 * (KST)"
            htmlFor="revisionDeadline"
            errorMessage={errors.revisionDeadline?.message}
            className="w-80"
          >
            <TextInput
              id="revisionDeadline"
              type="datetime-local"
              hasError={Boolean(errors.revisionDeadline)}
              {...register('revisionDeadline')}
            />
          </Field>
        </>
      )}

      {result !== 'revision' && (
        <Field
          label={result === 'approve' ? '처리 사유 / 상장가 조정 사유 *' : '처리 사유 *'}
          htmlFor="reason"
          errorMessage={errors.reason?.message}
        >
          <TextArea id="reason" hasError={Boolean(errors.reason)} {...register('reason')} />
        </Field>
      )}

      <div className="flex items-center gap-4">
        <Notice tone={texts.noticeTone} className="flex-1">
          {texts.notice}
        </Notice>
        <Button type="submit">처리 내용 확인</Button>
      </div>

      <ListingReviewConfirmModal
        form={confirmForm}
        isSubmitting={isSubmitting}
        errorMessage={submitError ? getApiErrorMessage(submitError) : undefined}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirm}
      />
    </form>
  );
}
