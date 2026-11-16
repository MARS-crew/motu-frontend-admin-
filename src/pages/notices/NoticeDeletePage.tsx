import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { InfoCard } from '@/components/common/InfoCard';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import { TextArea } from '@/components/common/TextArea';
import { NOTICE_STATUS_LABELS } from '@/constants/notice';
import { getNoticePreview } from '@/constants/noticePreview';
import { getNoticeEditPath, ROUTES } from '@/constants/routes';
import type { NoticeHideForm } from '@/schemas/noticeSchema';
import { noticeHideSchema } from '@/schemas/noticeSchema';

// ADM-NTC-04 공지 비공개·삭제 확인 (공지 수정 화면의 [비공개 / 삭제]로 진입)
export default function NoticeDeletePage() {
  const { noticeId = '' } = useParams();
  const navigate = useNavigate();

  // TODO(MOTU-26-1): 공지 상세 API 연동
  const notice = getNoticePreview(noticeId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoticeHideForm>({
    resolver: zodResolver(noticeHideSchema),
    defaultValues: { reason: '' },
  });

  if (!notice || notice.status === 'DELETED') {
    return <PlaceholderSection description="공지를 찾을 수 없습니다." />;
  }

  // 취소하면 기존 게시 상태를 유지하고 수정 화면으로 돌아갑니다.
  const handleCancel = () => void navigate(getNoticeEditPath(notice.noticeId));
  // TODO(MOTU-26-1): 공지 비공개·삭제 API 연동 (처리 결과와 처리자는 관리자 활동 이력에 저장)
  const handleProcess = () => void navigate(ROUTES.NOTICES, { replace: true });

  return (
    <div className="flex flex-col gap-5">
      <InfoCard
        items={[
          { label: '대상 공지', value: notice.noticeId },
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
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          {notice.status !== 'PRIVATE' && (
            <Button variant="secondary" onClick={() => void handleSubmit(handleProcess)()}>
              비공개
            </Button>
          )}
          <Button variant="danger" onClick={() => void handleSubmit(handleProcess)()}>
            삭제
          </Button>
        </div>
      </form>
    </div>
  );
}
