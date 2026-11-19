import type { BadgeTone } from '@/components/common/Badge';
import type { SelectOption } from '@/components/common/Select';
import type { MemberStatus } from '@/types/member';

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  ACTIVE: '정상',
  LOCKED: '잠금',
  BLOCKED: '정지',
};

export const MEMBER_STATUS_TONES: Record<MemberStatus, BadgeTone> = {
  ACTIVE: 'success',
  LOCKED: 'danger',
  BLOCKED: 'danger',
};

export const MEMBER_STATUS_FILTER_OPTIONS: SelectOption<MemberStatus | 'ALL'>[] = [
  { value: 'ALL', label: '전체' },
  ...(Object.keys(MEMBER_STATUS_LABELS) as MemberStatus[]).map((value) => ({
    value,
    label: MEMBER_STATUS_LABELS[value],
  })),
];

// 회원 목록은 한 페이지에 최대 10명까지 보여줍니다.
export const MEMBER_PAGE_SIZE = 10;
