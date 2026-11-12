import { Badge } from '@/components/common/Badge';
import { LISTING_STATUS_LABELS, LISTING_STATUS_TONES } from '@/constants/listing';
import type { ListingApplicationStatus } from '@/types/listing';

type ListingStatusBadgeProps = {
  status: ListingApplicationStatus;
};

export function ListingStatusBadge({ status }: ListingStatusBadgeProps) {
  return <Badge tone={LISTING_STATUS_TONES[status]}>{LISTING_STATUS_LABELS[status]}</Badge>;
}
