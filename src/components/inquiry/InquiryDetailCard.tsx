import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { InfoRow } from '@/components/common/InfoRow';
import { Modal } from '@/components/common/Modal';
import { Notice } from '@/components/common/Notice';
import { TextArea } from '@/components/common/TextArea';
import { INQUIRY_TYPE_LABELS } from '@/constants/inquiry';
import type { InquiryAnswerForm } from '@/schemas/inquirySchema';
import { inquiryAnswerSchema } from '@/schemas/inquirySchema';
import type { Inquiry } from '@/types/inquiry';
import { formatDateTimeText } from '@/utils/date';

type InquiryDetailCardProps = {
  inquiry: Inquiry;
  onStart: () => void;
  onAnswer: (answer: string) => void;
};

// ADM-INQ-01 선택 문의 상세 · 처리 ([처리 시작] → 답변 입력 → [이메일 답변 및 완료])
// 다른 문의를 고르면 입력을 비우도록 문의마다 key 를 달아 사용합니다.
export function InquiryDetailCard({ inquiry, onStart, onAnswer }: InquiryDetailCardProps) {
  const [confirmAnswer, setConfirmAnswer] = useState<string | null>(null);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryAnswerForm>({
    resolver: zodResolver(inquiryAnswerSchema),
    defaultValues: { answer: inquiry.answer ?? '' },
  });
  const answer = useWatch({ control, name: 'answer' });

  const title = `${inquiry.inquiryCode} · ${INQUIRY_TYPE_LABELS[inquiry.type]}`;
  const isSubmitted = inquiry.status === 'SUBMITTED';
  const isInProgress = inquiry.status === 'IN_PROGRESS';
  const isDone = inquiry.status === 'APPROVED';

  // 발송에 실패하면 답변과 상태를 그대로 둡니다. [취소] 시에도 입력은 유지합니다.
  const handleConfirm = () => {
    if (confirmAnswer === null) return;
    onAnswer(confirmAnswer);
    setConfirmAnswer(null);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit((form) => setConfirmAnswer(form.answer.trim()))}
      className="flex flex-col gap-3.5 rounded-[14px] border border-motu-border bg-white px-6 py-5"
    >
      <h2 className="text-title-md font-bold text-motu-text-primary">{title}</h2>
      <dl className="flex flex-col gap-3.5">
        <InfoRow label="회신 이메일" value={inquiry.replyEmail} />
        <InfoRow label="문의 내용" value={inquiry.content} />
        <InfoRow label="접수 시각" value={formatDateTimeText(inquiry.createdAt)} />
        {inquiry.handlerLoginId && <InfoRow label="담당자" value={inquiry.handlerLoginId} />}
        {inquiry.answeredAt && (
          <InfoRow label="처리 시각" value={formatDateTimeText(inquiry.answeredAt)} />
        )}
      </dl>

      <Field label="이메일 답변 *" htmlFor="answer" errorMessage={errors.answer?.message}>
        <TextArea
          id="answer"
          placeholder={isSubmitted ? '처리를 시작한 뒤 답변을 입력할 수 있습니다.' : undefined}
          disabled={!isInProgress}
          hasError={Boolean(errors.answer)}
          {...register('answer')}
        />
      </Field>

      <div className="flex items-center gap-3">
        <Notice className="min-w-0 flex-1">
          답변 발송은 계정 상태를 변경하지 않습니다. 잠금 해제·정지 변경은 회원 관리에서 처리합니다.
        </Notice>
        {!isDone && (
          <>
            <Button variant="secondary" disabled={!isSubmitted} onClick={onStart}>
              처리 시작
            </Button>
            <Button type="submit" disabled={!isInProgress || !answer.trim()}>
              이메일 답변 및 완료
            </Button>
          </>
        )}
      </div>

      <Modal
        isOpen={confirmAnswer !== null}
        onClose={() => setConfirmAnswer(null)}
        size="md"
        title="답변을 발송할까요?"
        description={
          <p className="text-body-sm font-normal">
            발송하면 문의가 ‘처리 완료’로 바뀌고 답변·담당자·처리 시각이 기록됩니다.
          </p>
        }
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirmAnswer(null)}>
              취소
            </Button>
            <Button onClick={handleConfirm}>발송</Button>
          </>
        }
      >
        <dl className="flex flex-col gap-3.5">
          <InfoRow label="접수번호" value={title} />
          <InfoRow label="회신 이메일" value={inquiry.replyEmail} />
          <InfoRow label="답변 내용" value={confirmAnswer} />
        </dl>
        <Notice>답변 발송은 계정 상태를 변경하지 않습니다.</Notice>
      </Modal>
    </form>
  );
}
