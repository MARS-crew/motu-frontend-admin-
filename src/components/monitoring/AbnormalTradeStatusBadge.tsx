import { Badge } from '@/components/common/Badge';
import { ABNORMAL_TRADE_STATUS_LABELS, ABNORMAL_TRADE_STATUS_TONES } from '@/constants/monitoring';
import type { AbnormalTradeStatus } from '@/types/monitoring';

type AbnormalTradeStatusBadgeProps = {
  status: AbnormalTradeStatus;
};

export function AbnormalTradeStatusBadge({ status }: AbnormalTradeStatusBadgeProps) {
  return (
    <Badge tone={ABNORMAL_TRADE_STATUS_TONES[status]}>{ABNORMAL_TRADE_STATUS_LABELS[status]}</Badge>
  );
}
