import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { InfoRow } from '@/components/common/InfoRow';
import { Modal } from '@/components/common/Modal';
import { Notice } from '@/components/common/Notice';
import { TextArea } from '@/components/common/TextArea';
import { TextInput } from '@/components/common/TextInput';
import { useExtendRevisionDeadlineMutation } from '@/queries/useListingReviewMutations';
import type { RevisionExtendForm } from '@/schemas/listingReviewSchema';
import { createRevisionExtendSchema } from '@/schemas/listingReviewSchema';
import type { ListingApplicationDetail } from '@/types/listing';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatDateTimeText, toKSTDateTime } from '@/utils/date';

type PendingRevision = NonNullable<ListingApplicationDetail['pendingRevision']>;

type RevisionDeadlineModalProps = {
  isOpen: boolean;
  applicationId: number;
  // 모달 상단 표시용 (LST-260831-018 · 김신청)
  applicationNumber: string;
  applicantName: string;
  revision: PendingRevision;
  onClose: () => void;
};

// ADM-LST-02 보완 기한 연장 (보완 요청 · 미재제출 회차에서만 열립니다)
// 확인에 성공하면 상세를 다시 불러오고, 취소하면 기한을 바꾸지 않습니다.
export function RevisionDeadlineModal({
  isOpen,
  applicationId,
  applicationNumber,
  applicantName,
  revision,
  onClose,
}: RevisionDeadlineModalProps) {
  const {
    mutate: extend,
    isPending,
    error,
    reset,
  } = useExtendRevisionDeadlineMutation(applicationId);
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<RevisionExtendForm>({
    resolver: zodResolver(createRevisionExtendSchema(revision.deadline)),
    defaultValues: { deadline: '', reason: '' },
  });

  const handleClose = () => {
    reset();
    resetForm();
    onClose();
  };
  const handleExtend = (form: RevisionExtendForm) =>
    extend(
      {
        revisionId: revision.revisionId,
        deadline: toKSTDateTime(form.deadline),
        reason: form.reason.trim(),
      },
      { onSuccess: handleClose },
    );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      title="보완 기한 연장"
      description={`${applicationNumber} · ${applicantName} · 보완 요청 · 미재제출`}
      actions={
        <>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button disabled={isPending} onClick={() => void handleSubmit(handleExtend)()}>
            기한 연장
          </Button>
        </>
      }
    >
      <dl className="flex flex-col gap-3.5">
        <InfoRow label="보완 항목" value={revision.requestItems.join(', ')} />
        <InfoRow label="현재 기한" value={`${formatDateTimeText(revision.deadline)} (KST)`} />
      </dl>
      <Field
        label="새 보완 기한 * (KST)"
        htmlFor="extendDeadline"
        errorMessage={errors.deadline?.message}
      >
        <TextInput
          id="extendDeadline"
          type="datetime-local"
          hasError={Boolean(errors.deadline)}
          {...register('deadline')}
        />
      </Field>
      <Field label="연장 사유 *" htmlFor="extendReason" errorMessage={errors.reason?.message}>
        <TextArea
          id="extendReason"
          maxLength={200}
          hasError={Boolean(errors.reason)}
          {...register('reason')}
        />
      </Field>
      {error ? (
        <Notice tone="danger">{getApiErrorMessage(error)}</Notice>
      ) : (
        <Notice>새 기한은 현재 시각과 기존 기한보다 늦어야 합니다.</Notice>
      )}
    </Modal>
  );
}
