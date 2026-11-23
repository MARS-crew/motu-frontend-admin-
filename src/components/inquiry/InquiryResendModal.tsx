import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { InfoRow } from '@/components/common/InfoRow';
import { Modal } from '@/components/common/Modal';
import { Notice } from '@/components/common/Notice';
import { TextArea } from '@/components/common/TextArea';
import { INQUIRY_TYPE_LABELS } from '@/constants/inquiry';
import { useSendInquiryReplyMutation } from '@/queries/useInquiryMutations';
import type { InquiryResendForm } from '@/schemas/inquirySchema';
import { inquiryResendSchema } from '@/schemas/inquirySchema';
import type { InquiryDetail } from '@/types/inquiry';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatDateTimeText } from '@/utils/date';

type InquiryResendModalProps = {
  isOpen: boolean;
  inquiry: InquiryDetail;
  onClose: () => void;
};

// ADM-INQ-01 답변 재발송 확인 (이전 발송 결과를 알 수 없을 때)
// 같은 답변이 두 번 발송될 수 있어 발송 이력을 확인한 뒤 재발송 사유를 받아 다시 보냅니다.
export function InquiryResendModal({ isOpen, inquiry, onClose }: InquiryResendModalProps) {
  const {
    mutate: sendReply,
    isPending,
    error,
    reset,
  } = useSendInquiryReplyMutation(Number(inquiry.inquiryId));
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<InquiryResendForm>({
    resolver: zodResolver(inquiryResendSchema),
    defaultValues: { retryReason: '' },
  });

  const handleClose = () => {
    reset();
    resetForm();
    onClose();
  };
  // 저장된 답변 초안을 그대로 다시 보냅니다. 실패하면 모달을 닫지 않고 안내합니다.
  const handleResend = (form: InquiryResendForm) =>
    sendReply(
      {
        expectedDraftVersion: inquiry.replyVersion,
        confirmResend: true,
        retryReason: form.retryReason.trim(),
      },
      { onSuccess: handleClose },
    );

  const previousSent = inquiry.latestAttempt
    ? `${formatDateTimeText(inquiry.latestAttempt.sentAt)} · 결과 확인 불가`
    : '-';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      title="답변을 다시 발송할까요?"
      description={
        <p className="text-body-sm font-normal">
          이전 답변의 발송 결과를 확인할 수 없습니다. 메일 발송 이력을 확인한 뒤 재발송해 주세요.
        </p>
      }
      actions={
        <>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button disabled={isPending} onClick={() => void handleSubmit(handleResend)()}>
            재발송
          </Button>
        </>
      }
    >
      <dl className="flex flex-col gap-3.5">
        <InfoRow
          label="접수번호"
          value={`${inquiry.inquiryCode} · ${INQUIRY_TYPE_LABELS[inquiry.type]}`}
        />
        <InfoRow label="회신 이메일" value={inquiry.replyEmail} />
        <InfoRow label="이전 발송" value={previousSent} />
        <InfoRow
          label="답변 내용"
          value={inquiry.replyDraft ?? inquiry.latestAttempt?.replyText ?? '-'}
        />
      </dl>
      <Field label="재발송 사유 *" htmlFor="retryReason" errorMessage={errors.retryReason?.message}>
        <TextArea
          id="retryReason"
          maxLength={200}
          hasError={Boolean(errors.retryReason)}
          {...register('retryReason')}
        />
      </Field>
      <Notice tone="danger">
        {error
          ? getApiErrorMessage(error)
          : '같은 답변이 두 번 발송될 수 있습니다. 재발송 사유는 처리 이력에 기록됩니다.'}
      </Notice>
    </Modal>
  );
}
