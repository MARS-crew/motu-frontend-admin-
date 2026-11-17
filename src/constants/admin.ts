import type { BadgeTone } from '@/components/common/Badge';
import type { SelectOption } from '@/components/common/Select';
import type {
  ActivityAction,
  ActivityResult,
  ActivityTargetType,
  AdminAccountStatus,
} from '@/types/admin';

export const ADMIN_STATUS_LABELS: Record<AdminAccountStatus, string> = {
  ACTIVE: '정상',
  SUSPENDED: '정지',
};

export const ADMIN_STATUS_TONES: Record<AdminAccountStatus, BadgeTone> = {
  ACTIVE: 'success',
  SUSPENDED: 'danger',
};

export const ADMIN_STATUS_OPTIONS: SelectOption<AdminAccountStatus>[] = [
  { value: 'ACTIVE', label: ADMIN_STATUS_LABELS.ACTIVE },
  { value: 'SUSPENDED', label: ADMIN_STATUS_LABELS.SUSPENDED },
];

export const ADMIN_STATUS_FILTER_OPTIONS: SelectOption<AdminAccountStatus | 'ALL'>[] = [
  { value: 'ALL', label: '전체' },
  ...ADMIN_STATUS_OPTIONS,
];

export const ACTIVITY_TARGET_LABELS: Record<ActivityTargetType, string> = {
  LISTING_APPLICATION: '상장 신청',
  STOCK: '상품',
  USER: '회원',
  ADMIN: '관리자 계정',
  NOTICE: '공지',
  ANOMALY: '이상 거래',
};

export const ACTIVITY_ACTION_LABELS: Record<ActivityAction, string> = {
  LISTING_APPROVE: '상장 승인',
  LISTING_REVISION_REQUEST: '보완 요청',
  LISTING_REJECT: '반려',
  STOCK_UPDATE: '상품 정보 수정',
  STOCK_PAUSE: '상품 거래 중지',
  STOCK_RESUME: '상품 거래 재개',
  STOCK_CLOSE: '상품 거래 종료',
  USER_STATUS_CHANGE: '회원 상태 변경',
  USER_UNLOCK: '계정 잠금 해제',
  POINT_GRANT: '포인트 지급',
  POINT_RECALL: '포인트 회수',
  ADMIN_CREATE: '관리자 계정 생성',
  ADMIN_STATUS_CHANGE: '관리자 계정 상태 변경',
  NOTICE_PUBLISH: '공지 게시',
  NOTICE_HIDE: '공지 비공개',
  NOTICE_DELETE: '공지 삭제',
  ANOMALY_ACTION: '이상 거래 조치',
};

// 작업 대상별로 고를 수 있는 수행 작업입니다. (대상을 바꾸면 수행 작업은 '전체'로 초기화)
export const ACTIVITY_ACTIONS_BY_TARGET: Record<ActivityTargetType, ActivityAction[]> = {
  LISTING_APPLICATION: ['LISTING_APPROVE', 'LISTING_REVISION_REQUEST', 'LISTING_REJECT'],
  STOCK: ['STOCK_UPDATE', 'STOCK_PAUSE', 'STOCK_RESUME', 'STOCK_CLOSE'],
  USER: ['USER_STATUS_CHANGE', 'USER_UNLOCK', 'POINT_GRANT', 'POINT_RECALL'],
  ADMIN: ['ADMIN_CREATE', 'ADMIN_STATUS_CHANGE'],
  NOTICE: ['NOTICE_PUBLISH', 'NOTICE_HIDE', 'NOTICE_DELETE'],
  ANOMALY: ['ANOMALY_ACTION'],
};

export const ACTIVITY_TARGET_FILTER_OPTIONS: SelectOption<ActivityTargetType | 'ALL'>[] = [
  { value: 'ALL', label: '전체' },
  ...(Object.keys(ACTIVITY_TARGET_LABELS) as ActivityTargetType[]).map((value) => ({
    value,
    label: ACTIVITY_TARGET_LABELS[value],
  })),
];

export const getActivityActionFilterOptions = (
  targetType: ActivityTargetType | 'ALL',
): SelectOption<ActivityAction | 'ALL'>[] => {
  const actions =
    targetType === 'ALL'
      ? (Object.keys(ACTIVITY_ACTION_LABELS) as ActivityAction[])
      : ACTIVITY_ACTIONS_BY_TARGET[targetType];
  return [
    { value: 'ALL', label: '전체' },
    ...actions.map((value) => ({ value, label: ACTIVITY_ACTION_LABELS[value] })),
  ];
};

export const ACTIVITY_RESULT_LABELS: Record<ActivityResult, string> = {
  SUCCESS: '완료',
  FAILURE: '실패',
};

export const ACTIVITY_RESULT_TONES: Record<ActivityResult, BadgeTone> = {
  SUCCESS: 'success',
  FAILURE: 'danger',
};
