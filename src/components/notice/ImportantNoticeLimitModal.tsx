import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { MAX_IMPORTANT_NOTICES } from '@/constants/notice';

type ImportantNoticeLimitModalProps = {
  // 게시 기간 표기 (09.03 20:30 ~ 09.10 23:59), null 이면 닫힘
  period: string | null;
  onClose: () => void;
};

// ADM-NTC-03 중요 공지 초과 안내 (게시 기간 중 중요 공지가 4개가 되는 구간이 있으면 게시를 막습니다)
export function ImportantNoticeLimitModal({ period, onClose }: ImportantNoticeLimitModalProps) {
  return (
    <Modal
      isOpen={Boolean(period)}
      onClose={onClose}
      size="sm"
      title="중요 공지를 게시할 수 없습니다"
      description={
        <p className="text-body-md">
          게시 기간({period}) 중 중요 공지가 {MAX_IMPORTANT_NOTICES + 1}개가 되는 구간이 있습니다.
          기간을 조정하거나 기존 중요 공지 설정을 해제한 뒤 게시해 주세요.
        </p>
      }
      actions={<Button onClick={onClose}>확인</Button>}
    />
  );
}
