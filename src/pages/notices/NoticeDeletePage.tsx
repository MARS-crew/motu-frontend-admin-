import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { InfoCard } from '@/components/common/InfoCard';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import { TextArea } from '@/components/common/TextArea';
import { NOTICE_STATUS_LABELS } from '@/constants/notice';
import { getNoticeEditPath, ROUTES } from '@/constants/routes';
import type { NoticeHideForm } from '@/schemas/noticeSchema';
import { noticeHideSchema } from '@/schemas/noticeSchema';
import { useDeleteNoticeMutation, useHideNoticeMutation } from '@/queries/useNoticeMutations';
import { useNoticeDetailQuery } from '@/queries/useNoticesQuery';
import { getApiErrorMessage } from '@/utils/apiError';
import { Notice } from '@/components/common/Notice';

// ADM-NTC-04 공지 비공개·삭제 확인 (공지 수정 화면의 [비공개 / 삭제]로 진입)
export default function NoticeDeletePage() {
  const { noticeId = '' } = useParams();
  const navigate = useNavigate();

  const {
    data: notice,
    isPending,
    isError,
    error: loadError,
  } = useNoticeDetailQuery(Number(noticeId));
  const hideNotice = useHideNoticeMutation(Number(noticeId));
  const deleteNotice = useDeleteNoticeMutation(Number(noticeId));
  const processError = hideNotice.error ?? deleteNotice.error;
  const isProcessing = hideNotice.isPending || deleteNotice.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoticeHideForm>({
    resolver: zodResolver(noticeHideSchema),
    defaultValues: { reason: '' },
  });

  if (isError) return <PlaceholderSection description={getApiErrorMessage(loadError)} />;
  if (isPending) return <PlaceholderSection description="공지를 불러오는 중입니다." />;
  if (notice.status === 'DELETED') {
    return <PlaceholderSection description="이미 삭제된 공지입니다." />;
  }
  // 임시 저장 공지는 비공개 없이 삭제만 할 수 있습니다.
  const canHide = notice.status !== 'HIDDEN' && notice.status !== 'DRAFT';

  // 취소하면 기존 게시 상태를 유지하고 수정 화면으로 돌아갑니다.
  const handleCancel = () => void navigate(getNoticeEditPath(notice.noticeId));
  // 처리 결과와 처리자는 서버가 관리자 활동 이력에 저장합니다.
  const handleDone = () => void navigate(ROUTES.NOTICES, { replace: true });
  const handleHide = (form: NoticeHideForm) => {
    deleteNotice.reset();
    hideNotice.mutate(form.reason.trim(), { onSuccess: handleDone });
  };
  const handleDelete = (form: NoticeHideForm) => {
    hideNotice.reset();
    deleteNotice.mutate(form.reason.trim(), { onSuccess: handleDone });
  };

  return (
    <div className="flex flex-col gap-5">
      <InfoCard
        items={[
          { label: '대상 공지', value: `${notice.noticeId} · ${notice.title}` },
          { label: '현재 상태', value: NOTICE_STATUS_LABELS[notice.status] },
        ]}
      />

      <div className="grid grid-cols-2 gap-5">
        <InfoCard title="비공개 처리">
          <p className="text-body-sm font-medium text-motu-text-secondary">
            사용자 화면에서 즉시 숨깁니다.
            <br />
            필요한 경우 다시 게시할 수 있습니다.
          </p>
        </InfoCard>
        <InfoCard title="삭제 처리" tone="danger">
          <p className="text-body-sm font-medium text-motu-text-secondary">
            사용자 화면에서 제거합니다.
            <br />
            삭제 후에도 처리 이력은 보관합니다.
          </p>
        </InfoCard>
      </div>

      <form
        noValidate
        onSubmit={(event) => event.preventDefault()}
        className="flex flex-col gap-4 rounded-[14px] border border-motu-border bg-white px-6 py-5"
      >
        <Field label="처리 사유 *" htmlFor="reason" errorMessage={errors.reason?.message}>
          <TextArea id="reason" hasError={Boolean(errors.reason)} {...register('reason')} />
        </Field>
        {processError && <Notice tone="danger">{getApiErrorMessage(processError)}</Notice>}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          {canHide && (
            <Button
              variant="secondary"
              disabled={isProcessing}
              onClick={() => void handleSubmit(handleHide)()}
            >
              비공개
            </Button>
          )}
          <Button
            variant="danger"
            disabled={isProcessing}
            onClick={() => void handleSubmit(handleDelete)()}
          >
            삭제
          </Button>
        </div>
      </form>
    </div>
  );
}
