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
import {
  useSaveInquiryDraftMutation,
  useSendInquiryReplyMutation,
  useStartInquiryMutation,
} from '@/queries/useInquiryMutations';
import type { InquiryAnswerForm } from '@/schemas/inquirySchema';
import { inquiryAnswerSchema } from '@/schemas/inquirySchema';
import type { InquiryDetail } from '@/types/inquiry';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatDateTimeText } from '@/utils/date';

type InquiryDetailCardProps = {
  inquiry: InquiryDetail;
};

type PendingReply = {
  answer: string;
  // 초안 저장 응답의 버전 (발송 시 그대로 보냅니다)
  draftVersion: number;
};

// 발송 중이거나 결과를 모르는 경우의 안내
const ATTEMPT_NOTICES: Partial<
  Record<NonNullable<InquiryDetail['latestAttempt']>['status'], string>
> = {
  SENDING: '답변을 발송하는 중입니다. 잠시 후 다시 확인해 주세요.',
  UNKNOWN: '이전 답변의 발송 결과를 확인할 수 없습니다. 메일 발송 이력을 확인한 뒤 처리해 주세요.',
  FAILED: '이전 답변 발송에 실패했습니다. 답변을 확인한 뒤 다시 발송해 주세요.',
  SIMULATED: '모의 발송으로 처리되어 문의는 처리 중으로 남아 있습니다.',
};

// ADM-INQ-01 선택 문의 상세 · 처리 ([처리 시작] → 답변 입력 → [이메일 답변 및 완료])
// 다른 문의를 고르면 입력을 비우도록 문의마다 key 를 달아 사용합니다.
export function InquiryDetailCard({ inquiry }: InquiryDetailCardProps) {
  const inquiryId = Number(inquiry.inquiryId);
  const [pendingReply, setPendingReply] = useState<PendingReply | null>(null);
  const startInquiry = useStartInquiryMutation(inquiryId);
  const saveDraft = useSaveInquiryDraftMutation(inquiryId);
  const sendReply = useSendInquiryReplyMutation(inquiryId);
  const actionError = startInquiry.error ?? saveDraft.error ?? sendReply.error;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryAnswerForm>({
    resolver: zodResolver(inquiryAnswerSchema),
    defaultValues: { answer: inquiry.replyDraft ?? inquiry.latestAttempt?.replyText ?? '' },
  });
  const answer = useWatch({ control, name: 'answer' });

  const title = `${inquiry.inquiryCode} · ${INQUIRY_TYPE_LABELS[inquiry.type]}`;
  const isSubmitted = inquiry.status === 'SUBMITTED';
  const isDone = inquiry.status === 'COMPLETED';
  // 처리 중이어도 발송 중·결과 불명확이면 편집·발송을 막습니다.
  const canAnswer = inquiry.status === 'IN_PROGRESS' && inquiry.canEdit;
  const attemptNotice = inquiry.latestAttempt
    ? ATTEMPT_NOTICES[inquiry.latestAttempt.status]
    : undefined;

  const resetErrors = () => {
    startInquiry.reset();
    saveDraft.reset();
    sendReply.reset();
  };
  const handleStart = () => {
    resetErrors();
    startInquiry.mutate();
  };
  // 확인 모달을 띄우기 전에 답변을 초안으로 저장합니다. (다른 관리자가 먼저 고쳤으면 실패 안내)
  const handleOpenConfirm = (form: InquiryAnswerForm) => {
    resetErrors();
    const replyText = form.answer.trim();
    saveDraft.mutate(
      { expectedVersion: inquiry.replyVersion, replyText },
      {
        onSuccess: ({ replyVersion }) =>
          setPendingReply({ answer: replyText, draftVersion: replyVersion }),
      },
    );
  };
  // 발송에 실패하면 답변과 상태를 그대로 둡니다. [취소] 시에도 입력은 유지합니다.
  const handleSend = () => {
    if (!pendingReply) return;
    sendReply.mutate(pendingReply.draftVersion, { onSettled: () => setPendingReply(null) });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleOpenConfirm)}
      className="flex flex-col gap-3.5 rounded-[14px] border border-motu-border bg-white px-6 py-5"
    >
      <h2 className="text-title-md font-bold text-motu-text-primary">{title}</h2>
      <dl className="flex flex-col gap-3.5">
        <InfoRow label="회신 이메일" value={inquiry.replyEmail} />
        <InfoRow label="문의 내용" value={inquiry.content} />
        <InfoRow label="접수 시각" value={formatDateTimeText(inquiry.createdAt)} />
        {inquiry.handlerName && <InfoRow label="담당자" value={inquiry.handlerName} />}
        {inquiry.completedAt && (
          <InfoRow label="처리 시각" value={formatDateTimeText(inquiry.completedAt)} />
        )}
      </dl>

      <Field label="이메일 답변 *" htmlFor="answer" errorMessage={errors.answer?.message}>
        <TextArea
          id="answer"
          placeholder={isSubmitted ? '처리를 시작한 뒤 답변을 입력할 수 있습니다.' : undefined}
          disabled={!canAnswer}
          hasError={Boolean(errors.answer)}
          {...register('answer')}
        />
      </Field>

      {!isDone && attemptNotice && <Notice>{attemptNotice}</Notice>}
      {actionError && <Notice tone="danger">{getApiErrorMessage(actionError)}</Notice>}

      <div className="flex items-center gap-3">
        <Notice className="min-w-0 flex-1">
          답변 발송은 계정 상태를 변경하지 않습니다. 잠금 해제·정지 변경은 회원 관리에서 처리합니다.
        </Notice>
        {!isDone && (
          <>
            <Button
              variant="secondary"
              disabled={!isSubmitted || startInquiry.isPending}
              onClick={handleStart}
            >
              처리 시작
            </Button>
            <Button type="submit" disabled={!canAnswer || !answer.trim() || saveDraft.isPending}>
              이메일 답변 및 완료
            </Button>
          </>
        )}
      </div>

      <Modal
        isOpen={pendingReply !== null}
        onClose={() => setPendingReply(null)}
        size="md"
        title="답변을 발송할까요?"
        description={
          <p className="text-body-sm font-normal">
            발송하면 문의가 ‘처리 완료’로 바뀌고 답변·담당자·처리 시각이 기록됩니다.
          </p>
        }
        actions={
          <>
            <Button variant="secondary" onClick={() => setPendingReply(null)}>
              취소
            </Button>
            <Button disabled={sendReply.isPending} onClick={handleSend}>
              발송
            </Button>
          </>
        }
      >
        <dl className="flex flex-col gap-3.5">
          <InfoRow label="접수번호" value={title} />
          <InfoRow label="회신 이메일" value={inquiry.replyEmail} />
          <InfoRow label="답변 내용" value={pendingReply?.answer} />
        </dl>
        <Notice>답변 발송은 계정 상태를 변경하지 않습니다.</Notice>
      </Modal>
    </form>
  );
}
