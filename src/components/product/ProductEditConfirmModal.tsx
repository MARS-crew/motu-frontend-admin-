import { Button } from '@/components/common/Button';
import type { InfoItem } from '@/components/common/InfoCard';
import { InfoRow } from '@/components/common/InfoRow';
import { Modal } from '@/components/common/Modal';
import { Notice } from '@/components/common/Notice';

type ProductEditConfirmModalProps = {
  // 변경된 항목 (변경 전 → 변경 후) + 수정 사유
  rows: InfoItem[] | null;
  onClose: () => void;
  onConfirm: () => void;
};

// ADM-PRD-03 변경 내용 확인 모달 (변경 전·후 값을 확인한 뒤 저장)
export function ProductEditConfirmModal({
  rows,
  onClose,
  onConfirm,
}: ProductEditConfirmModalProps) {
  return (
    <Modal
      isOpen={Boolean(rows)}
      onClose={onClose}
      size="md"
      title="변경 내용을 확인해 주세요"
      description={
        <p className="text-body-sm font-normal">변경 전 → 변경 후 값을 확인한 뒤 저장합니다.</p>
      }
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button onClick={onConfirm}>변경 저장</Button>
        </>
      }
    >
      <dl className="flex flex-col gap-3.5">
        {rows?.map((row) => (
          <InfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>
      <Notice>변경 전·후 값과 사유는 관리자 활동 이력에 저장됩니다.</Notice>
    </Modal>
  );
}
