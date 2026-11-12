import type { BadgeTone } from '@/components/common/Badge';
import type { SelectOption } from '@/components/common/Select';
import type {
  ListingApplicationStatus,
  ListingCategory,
  ListingDetailTab,
  ListingReviewResult,
} from '@/types/listing';

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

// 상세 심사 탭 (탭을 바꿔도 신청번호·상품 요약은 유지합니다)
export const LISTING_DETAIL_TABS: { value: ListingDetailTab; label: string }[] = [
  { value: 'basic', label: '기본 정보' },
  { value: 'trading', label: '평가·거래' },
  { value: 'metrics', label: '서비스 지표' },
  { value: 'evidence', label: '증빙 자료' },
];

// 목록의 [상세 심사]는 평가·거래 탭(ADM-LST-02)으로 엽니다.
export const DEFAULT_LISTING_DETAIL_TAB: ListingDetailTab = 'trading';

export const NOT_SUBMITTED_LABEL = '미제출';

export const LISTING_REVIEW_RESULT_OPTIONS: { value: ListingReviewResult; label: string }[] = [
  { value: 'approve', label: '승인' },
  { value: 'revision', label: '보완 요청' },
  { value: 'reject', label: '반려' },
];

export const LISTING_REVIEW_TEXTS: Record<
  ListingReviewResult,
  { notice: string; noticeTone: 'success' | 'neutral' | 'danger'; confirmLabel: string }
> = {
  approve: {
    notice: '승인 후 상품은 거래 대기 상태가 됩니다.',
    noticeTone: 'success',
    confirmLabel: '승인 확정',
  },
  revision: {
    notice: '보완 요청 상태로 변경됩니다. 신청자는 수정 후 다시 제출할 수 있습니다.',
    noticeTone: 'neutral',
    confirmLabel: '보완 요청 확정',
  },
  reject: {
    notice: '반려된 신청은 종료됩니다. 수정 후 새로 신청할 수 있습니다.',
    noticeTone: 'danger',
    confirmLabel: '반려 확정',
  },
};

// 보완 요청 항목 (상장 신청 단계 기준)
export const LISTING_REVISION_ITEM_OPTIONS: SelectOption[] = [
  { value: 'BASIC_INFO', label: '기본 정보' },
  { value: 'TRADING_INFO', label: '평가·거래 정보' },
  { value: 'SERVICE_METRICS', label: '서비스 지표' },
  { value: 'METRICS_EVIDENCE', label: '서비스 지표 증빙' },
  { value: 'ETC', label: '기타' },
];
