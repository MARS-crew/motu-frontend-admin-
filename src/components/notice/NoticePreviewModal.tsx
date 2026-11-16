import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { formatDateTimeText } from '@/utils/date';

export type NoticePreview = {
  // 상품별 공지만 상품명을 표시합니다. (상품 ID는 사용자에게 노출하지 않음)
  productName: string | null;
  title: string;
  // YYYY-MM-DDTHH:mm
  startAt: string;
  content: string;
};

type NoticePreviewModalProps = {
  preview: NoticePreview | null;
  onClose: () => void;
};

// ADM-NTC-02 사용자 화면 미리보기 (앱 공지 상세에 표시되는 모습)
export function NoticePreviewModal({ preview, onClose }: NoticePreviewModalProps) {
  return (
    <Modal
      isOpen={Boolean(preview)}
      onClose={onClose}
      size="md"
      title="사용자 화면 미리보기"
      description={
        <p className="text-body-sm">
          앱 공지 상세에 표시되는 모습입니다. 상품 ID는 사용자에게 노출되지 않습니다.
        </p>
      }
      actions={<Button onClick={onClose}>닫기</Button>}
    >
      {preview && (
        <div className="flex w-[375px] flex-col gap-4 rounded-[20px] border border-motu-border bg-motu-bg px-5 pb-6 pt-5">
          <p className="text-title-md font-bold text-motu-text-primary">‹&nbsp;&nbsp;공지사항</p>
          <article className="flex flex-col gap-2.5 rounded-[14px] bg-white p-5">
            {preview.productName && (
              <p className="text-label-md font-bold text-motu-text-secondary">
                {preview.productName}
              </p>
            )}
            <h3 className="break-words text-[17px] font-bold leading-[22px] text-motu-text-primary">
              {preview.title || '제목 없음'}
            </h3>
            <p className="text-label-md font-medium text-motu-text-tertiary">
              {preview.startAt ? formatDateTimeText(preview.startAt) : '게시 시작일시 미정'}
            </p>
            <p className="whitespace-pre-line break-words text-body-md font-normal leading-[1.5] text-motu-text-primary">
              {preview.content}
            </p>
          </article>
        </div>
      )}
    </Modal>
  );
}
