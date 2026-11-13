import { Button } from '@/components/common/Button';
import { InfoRow } from '@/components/common/InfoRow';
import { Modal } from '@/components/common/Modal';
import { Notice } from '@/components/common/Notice';
import { ABNORMAL_TRADE_TYPE_LABELS } from '@/constants/monitoring';
import type { AbnormalTradeDetail } from '@/types/monitoring';

type NoIssueConfirmModalProps = {
  trade: AbnormalTradeDetail;
  // 열려 있을 때만 값이 있습니다.
  reason: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

// ADM-MON-02 이상 없음 확인 모달 (확인하면 처리완료로 바뀌고 관리자 활동 이력에 기록)
export function NoIssueConfirmModal({
  trade,
  reason,
  onClose,
  onConfirm,
}: NoIssueConfirmModalProps) {
  return (
    <Modal
      isOpen={reason !== null}
      onClose={onClose}
      size="md"
      title="이상 없음으로 처리할까요?"
      description={
        <p className="text-body-sm font-normal">
          {trade.alertId} · {ABNORMAL_TRADE_TYPE_LABELS[trade.type]}
        </p>
      }
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button onClick={onConfirm}>처리 완료</Button>
        </>
      }
    >
      <dl className="flex flex-col gap-3.5">
        <InfoRow label="조치 유형" value="이상 없음" />
        <InfoRow label="대상 상품" value={`${trade.productName} / ${trade.productId}`} />
        <InfoRow label="관련 회원" value={`${trade.memberLoginId} / ${trade.memberId}`} />
        <InfoRow label="조치 사유" value={reason} />
      </dl>
      <Notice>확인하면 처리완료로 바뀌고 관리자 활동 이력에 기록됩니다.</Notice>
    </Modal>
  );
}
