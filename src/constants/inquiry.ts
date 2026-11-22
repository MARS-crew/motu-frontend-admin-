import type { BadgeTone } from '@/components/common/Badge';
import type { SelectOption } from '@/components/common/Select';
import type { InquiryStatus, InquiryType } from '@/types/inquiry';

export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  LOGIN_FAILED_LOCKED: '계정 잠금',
  SUSPENDED: '계정 정지',
  PHONE_UNAVAILABLE: '등록 휴대폰 사용 불가',
};

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  SUBMITTED: '접수',
  IN_PROGRESS: '처리 중',
  COMPLETED: '처리 완료',
};

export const INQUIRY_STATUS_TONES: Record<InquiryStatus, BadgeTone> = {
  SUBMITTED: 'neutral',
  IN_PROGRESS: 'success',
  COMPLETED: 'muted',
};

export const INQUIRY_STATUS_FILTER_OPTIONS: SelectOption<InquiryStatus | 'ALL'>[] = [
  { value: 'ALL', label: '전체' },
  ...(Object.keys(INQUIRY_STATUS_LABELS) as InquiryStatus[]).map((value) => ({
    value,
    label: INQUIRY_STATUS_LABELS[value],
  })),
];

export const INQUIRY_TYPE_FILTER_OPTIONS: SelectOption<InquiryType | 'ALL'>[] = [
  { value: 'ALL', label: '전체' },
  ...(Object.keys(INQUIRY_TYPE_LABELS) as InquiryType[]).map((value) => ({
    value,
    label: INQUIRY_TYPE_LABELS[value],
  })),
];

// 계정·인증 문의 목록 한 페이지 건수
export const INQUIRY_PAGE_SIZE = 20;
