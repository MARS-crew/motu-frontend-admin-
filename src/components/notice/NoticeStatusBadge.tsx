import { Badge } from '@/components/common/Badge';
import { NOTICE_STATUS_LABELS, NOTICE_STATUS_TONES } from '@/constants/notice';
import type { NoticeStatus } from '@/types/notice';

type NoticeStatusBadgeProps = {
  status: NoticeStatus;
};

export function NoticeStatusBadge({ status }: NoticeStatusBadgeProps) {
  return <Badge tone={NOTICE_STATUS_TONES[status]}>{NOTICE_STATUS_LABELS[status]}</Badge>;
}
