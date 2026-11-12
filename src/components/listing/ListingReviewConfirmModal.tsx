import { Button } from '@/components/common/Button';
import type { InfoItem } from '@/components/common/InfoCard';
import { InfoRow } from '@/components/common/InfoRow';
import { Modal } from '@/components/common/Modal';
import { Notice } from '@/components/common/Notice';
import {
  LISTING_REVIEW_RESULT_OPTIONS,
  LISTING_REVIEW_TEXTS,
  LISTING_REVISION_ITEM_OPTIONS,
} from '@/constants/listing';
import type { ListingReviewForm } from '@/schemas/listingReviewSchema';
import { formatNumber } from '@/utils/format';

type ListingReviewConfirmModalProps = {
  form: ListingReviewForm | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const toNumberText = (value: string) => formatNumber(Number(value.replaceAll(',', '')));
const toDateText = (value: string) => value.replaceAll('-', '.').replace('T', ' ');

const getConfirmRows = (form: ListingReviewForm): InfoItem[] => {
  const resultLabel =
    LISTING_REVIEW_RESULT_OPTIONS.find((option) => option.value === form.result)?.label ?? '';

  if (form.result === 'approve') {
    return [
      { label: '처리 결과', value: resultLabel },
      { label: '최종 상장가', value: `${toNumberText(form.finalPrice)} P` },
      { label: '총 발행량', value: toNumberText(form.totalSupply) },
      { label: '상장일', value: toDateText(form.listingDate) },
      { label: '거래 시작일시', value: toDateText(form.tradeStartAt) },
      { label: '처리 사유', value: form.reason },
    ];
  }
  if (form.result === 'revision') {
    const itemLabel = LISTING_REVISION_ITEM_OPTIONS.find(
      (option) => option.value === form.revisionItem,
    )?.label;
    return [
      { label: '처리 결과', value: resultLabel },
      { label: '보완 항목', value: itemLabel },
      { label: '요청 내용', value: form.revisionRequest },
    ];
  }
  return [
    { label: '처리 결과', value: resultLabel },
    { label: '처리 사유', value: form.reason },
  ];
};

// ADM-LST-03 처리 전 확인 모달
export function ListingReviewConfirmModal({
  form,
  isSubmitting,
  onClose,
  onConfirm,
}: ListingReviewConfirmModalProps) {
  const texts = form ? LISTING_REVIEW_TEXTS[form.result] : null;

  return (
    <Modal
      isOpen={Boolean(form)}
      onClose={onClose}
      size="md"
      title="상장 심사 결과를 확정할까요?"
      description={
        <p className="text-body-sm font-normal">
          확정 후 처리 상태와 처리자가 관리자 활동 이력에 저장됩니다.
        </p>
      }
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button disabled={isSubmitting} onClick={onConfirm}>
            {texts?.confirmLabel}
          </Button>
        </>
      }
    >
      {form && texts && (
        <>
          <dl className="flex flex-col gap-3.5">
            {getConfirmRows(form).map((row) => (
              <InfoRow key={row.label} label={row.label} value={row.value} />
            ))}
          </dl>
          <Notice tone={texts.noticeTone}>{texts.notice}</Notice>
        </>
      )}
    </Modal>
  );
}
