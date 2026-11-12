import { Badge } from '@/components/common/Badge';
import { PRODUCT_TRADE_STATUS_LABELS, PRODUCT_TRADE_STATUS_TONES } from '@/constants/product';
import type { ProductTradeStatus } from '@/types/product';

type ProductTradeStatusBadgeProps = {
  status: ProductTradeStatus;
};

export function ProductTradeStatusBadge({ status }: ProductTradeStatusBadgeProps) {
  return (
    <Badge tone={PRODUCT_TRADE_STATUS_TONES[status]}>{PRODUCT_TRADE_STATUS_LABELS[status]}</Badge>
  );
}
