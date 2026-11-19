import type { BadgeTone } from '@/components/common/Badge';
import type { SelectOption } from '@/components/common/Select';
import type { NoticeApiType, NoticeStatus, NoticeType } from '@/types/notice';

// 목록·필터에 쓰는 짧은 이름입니다.
export const NOTICE_TYPE_LABELS: Record<NoticeType, string> = {
  SERVICE: '전체',
  PRODUCT: '상품',
};

// 작성 화면·게시 확인에 쓰는 이름입니다.
export const NOTICE_TYPE_FULL_LABELS: Record<NoticeType, string> = {
  SERVICE: '전체 공지',
  PRODUCT: '상품별 공지',
};

export const NOTICE_STATUS_LABELS: Record<NoticeStatus, string> = {
  DRAFT: '임시 저장',
  SCHEDULED: '게시 예약',
  PUBLISHED: '게시 중',
  ENDED: '게시 종료',
  HIDDEN: '비공개',
  DELETED: '삭제',
};

export const NOTICE_STATUS_TONES: Record<NoticeStatus, BadgeTone> = {
  DRAFT: 'muted',
  SCHEDULED: 'neutral',
  PUBLISHED: 'success',
  ENDED: 'muted',
  HIDDEN: 'muted',
  DELETED: 'muted',
};

export const NOTICE_TYPE_FILTER_OPTIONS: SelectOption<NoticeType | 'ALL'>[] = [
  { value: 'ALL', label: '전체' },
  { value: 'SERVICE', label: NOTICE_TYPE_FULL_LABELS.SERVICE },
  { value: 'PRODUCT', label: NOTICE_TYPE_FULL_LABELS.PRODUCT },
];

export const NOTICE_STATUS_FILTER_OPTIONS: SelectOption<NoticeStatus | 'ALL'>[] = [
  { value: 'ALL', label: '전체' },
  ...(Object.keys(NOTICE_STATUS_LABELS) as NoticeStatus[]).map((value) => ({
    value,
    label: NOTICE_STATUS_LABELS[value],
  })),
];

export const NOTICE_TYPE_OPTIONS: SelectOption<NoticeType>[] = [
  { value: 'SERVICE', label: NOTICE_TYPE_FULL_LABELS.SERVICE },
  { value: 'PRODUCT', label: NOTICE_TYPE_FULL_LABELS.PRODUCT },
];

// 공지 목록 한 페이지 건수
export const NOTICE_PAGE_SIZE = 20;

// 게시 중·게시 예약 중요 공지는 어느 시점에도 동시에 최대 3개입니다.
export const MAX_IMPORTANT_NOTICES = 3;

export const ALL_MEMBERS_TARGET_LABEL = '전체 회원';

// 화면 공지 구분 ↔ API 공지 구분
export const NOTICE_API_TYPES: Record<NoticeType, NoticeApiType> = {
  SERVICE: 'ALL',
  PRODUCT: 'STOCK',
};
