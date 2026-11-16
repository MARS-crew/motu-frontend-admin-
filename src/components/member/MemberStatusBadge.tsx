import { Badge } from '@/components/common/Badge';
import { MEMBER_STATUS_LABELS, MEMBER_STATUS_TONES } from '@/constants/member';
import type { MemberStatus } from '@/types/member';

type MemberStatusBadgeProps = {
  status: MemberStatus;
};

export function MemberStatusBadge({ status }: MemberStatusBadgeProps) {
  return <Badge tone={MEMBER_STATUS_TONES[status]}>{MEMBER_STATUS_LABELS[status]}</Badge>;
}
