import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ModalTextBody } from '@/components/listing/ModalTextBody';
import { useObjectUrl } from '@/hooks/useObjectUrl';
import { useListingAttachmentQuery } from '@/queries/useListingAttachmentQuery';
import type { ListingEvidenceFile } from '@/types/listing';

type EvidencePreviewModalProps = {
  file: ListingEvidenceFile | null;
  applicationId: number;
  onClose: () => void;
  onDownload: (file: ListingEvidenceFile) => void;
};

const UNSUPPORTED_MESSAGE =
  '미리보기를 지원하지 않거나 파일을 불러오지 못했습니다.\n[다운로드]로 파일을 확인해 주세요.';

const isPreviewable = (file: ListingEvidenceFile) =>
  file.kind === 'FILE' &&
  (file.contentType?.startsWith('image/') || file.contentType === 'application/pdf');

// ADM-LST-02-M02 증빙 파일 미리보기 (PDF·이미지는 읽기 전용, 미지원·실패 시 안내 + 다운로드)
export function EvidencePreviewModal({
  file,
  applicationId,
  onClose,
  onDownload,
}: EvidencePreviewModalProps) {
  const canPreview = file !== null && isPreviewable(file);
  const { data, isPending, isError } = useListingAttachmentQuery(
    applicationId,
    canPreview ? file.attachmentId : null,
  );
  const fileUrl = useObjectUrl(data);

  const renderBody = () => {
    if (!file) return null;
    if (file.kind === 'LINK') return <ModalTextBody text={`외부 링크\n${file.url ?? ''}`} />;
    if (!canPreview || isError) return <ModalTextBody text={UNSUPPORTED_MESSAGE} />;
    if (isPending || !fileUrl) return <ModalTextBody text="파일을 불러오는 중입니다." />;
    return file.contentType === 'application/pdf' ? (
      <iframe title={file.fileName} src={fileUrl} className="h-[420px] w-full rounded-[10px]" />
    ) : (
      <img
        src={fileUrl}
        alt={file.fileName}
        className="max-h-[420px] w-full rounded-[10px] bg-motu-bg-secondary object-contain"
      />
    );
  };

  return (
    <Modal
      isOpen={Boolean(file)}
      onClose={onClose}
      title="증빙 자료 미리보기"
      description={
        file && [file.fileName, file.description, file.sizeLabel].filter(Boolean).join(' · ')
      }
      actions={
        <>
          <Button variant="secondary" onClick={() => file && onDownload(file)}>
            {file?.kind === 'LINK' ? '링크 열기' : '다운로드'}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </>
      }
    >
      {renderBody()}
    </Modal>
  );
}
