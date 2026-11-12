import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ModalTextBody } from '@/components/listing/ModalTextBody';

type PriceBasisModalProps = {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  productName: string;
  priceBasis: string;
};

// ADM-LST-02-M01 신청자가 제출한 가격 근거 원문 (읽기 전용, 길면 세로 스크롤)
export function PriceBasisModal({
  isOpen,
  onClose,
  applicationId,
  productName,
  priceBasis,
}: PriceBasisModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="가격 근거 · 제출 원문"
      description={`${applicationId} · ${productName} · 읽기 전용`}
      actions={
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
      }
    >
      <ModalTextBody text={priceBasis} />
    </Modal>
  );
}
