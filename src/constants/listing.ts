import type { BadgeTone } from '@/components/common/Badge';
import type { SelectOption } from '@/components/common/Select';
import type { ListingApplicationStatus, ListingCategory } from '@/types/listing';

export const LISTING_STATUS_LABELS: Record<ListingApplicationStatus, string> = {
  SUBMITTED: '접수',
  UNDER_REVIEW: '검토중',
  REVISION_REQUESTED: '보완 요청',
  APPROVED: '승인',
  REJECTED: '반려',
};

export const LISTING_STATUS_TONES: Record<ListingApplicationStatus, BadgeTone> = {
  SUBMITTED: 'neutral',
  UNDER_REVIEW: 'neutral',
  REVISION_REQUESTED: 'danger',
  APPROVED: 'success',
  REJECTED: 'danger',
};

// 심사가 끝난 신청은 [상세 보기], 진행 중인 신청은 [상세 심사]로 표시합니다.
export const REVIEWED_LISTING_STATUSES: ListingApplicationStatus[] = ['APPROVED', 'REJECTED'];

export const LISTING_CATEGORY_LABELS: Record<ListingCategory, string> = {
  SAAS: 'SaaS',
  CONTENTS: '콘텐츠',
  COMMERCE: '커머스',
  HEALTHCARE: '헬스케어',
  ETC: '기타',
};

const toOptions = <T extends string>(labels: Record<T, string>): SelectOption<T>[] =>
  (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));

export const LISTING_STATUS_FILTER_OPTIONS: SelectOption<ListingApplicationStatus | 'ALL'>[] = [
  { value: 'ALL', label: '전체' },
  ...toOptions(LISTING_STATUS_LABELS),
];

export const LISTING_CATEGORY_FILTER_OPTIONS: SelectOption<ListingCategory | 'ALL'>[] = [
  { value: 'ALL', label: '전체' },
  ...toOptions(LISTING_CATEGORY_LABELS),
];

// 신청 기간 기본값: 최근 30일
export const DEFAULT_APPLIED_PERIOD_DAYS = 30;
