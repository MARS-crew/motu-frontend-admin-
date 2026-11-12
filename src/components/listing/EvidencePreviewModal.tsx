import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ModalTextBody } from '@/components/listing/ModalTextBody';
import type { ListingEvidenceFile } from '@/types/listing';

type EvidencePreviewModalProps = {
  file: ListingEvidenceFile | null;
  onClose: () => void;
  onDownload: (file: ListingEvidenceFile) => void;
};

// ADM-LST-02-M02 증빙 파일 미리보기 (PDF·이미지는 읽기 전용, 미지원·실패 시 안내 + 다운로드)
export function EvidencePreviewModal({ file, onClose, onDownload }: EvidencePreviewModalProps) {
  return (
    <Modal
      isOpen={Boolean(file)}
      onClose={onClose}
      title="증빙 자료 미리보기"
      description={file && `${file.fileName} · ${file.description} · ${file.sizeLabel}`}
      actions={
        <>
          <Button variant="secondary" onClick={() => file && onDownload(file)}>
            다운로드
          </Button>
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </>
      }
    >
      {/* TODO(MOTU-21-1): 파일 URL 로 PDF(iframe)·이미지(img) 미리보기 */}
      <ModalTextBody
        text={
          file?.previewText ??
          '미리보기를 지원하지 않거나 파일을 불러오지 못했습니다.\n[다운로드]로 파일을 확인해 주세요.'
        }
      />
    </Modal>
  );
}
