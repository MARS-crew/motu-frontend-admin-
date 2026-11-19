import { Button } from '@/components/common/Button';
import type { InfoItem } from '@/components/common/InfoCard';
import { InfoRow } from '@/components/common/InfoRow';
import { Modal } from '@/components/common/Modal';

type NoticePublishConfirmModalProps = {
  // 공지 구분·제목·게시 대상·게시 기간·중요 공지
  rows: InfoItem[] | null;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
};

// ADM-NTC-03 공지 게시 확인 ([수정]은 작성 화면으로 돌아갑니다)
export function NoticePublishConfirmModal({
  rows,
  onClose,
  onConfirm,
  isSubmitting = false,
}: NoticePublishConfirmModalProps) {
  return (
    <Modal
      isOpen={Boolean(rows)}
      onClose={onClose}
      title="이 내용으로 게시하시겠습니까?"
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            수정
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            게시
          </Button>
        </>
      }
    >
      <dl className="flex flex-col gap-[18px]">
        {rows?.map((row) => (
          <InfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>
    </Modal>
  );
}
