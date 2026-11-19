import type { BadgeTone } from '@/components/common/Badge';
import type { SelectOption } from '@/components/common/Select';
import type { ProductDetailTab, ProductExposure, ProductTradeStatus } from '@/types/product';

export const PRODUCT_TRADE_STATUS_LABELS: Record<ProductTradeStatus, string> = {
  PENDING: '거래 대기',
  ACTIVE: '거래 가능',
  PAUSED: '거래 중지',
  CLOSED: '거래 종료',
};

export const PRODUCT_TRADE_STATUS_TONES: Record<ProductTradeStatus, BadgeTone> = {
  PENDING: 'neutral',
  ACTIVE: 'success',
  PAUSED: 'danger',
  CLOSED: 'muted',
};

export const PRODUCT_EXPOSURE_LABELS: Record<ProductExposure, string> = {
  PUBLIC: '공개',
  PRIVATE: '비공개',
};

export const PRODUCT_TRADE_STATUS_FILTER_OPTIONS: SelectOption<ProductTradeStatus | 'ALL'>[] = [
  { value: 'ALL', label: '전체' },
  ...(Object.keys(PRODUCT_TRADE_STATUS_LABELS) as ProductTradeStatus[]).map((value) => ({
    value,
    label: PRODUCT_TRADE_STATUS_LABELS[value],
  })),
];

export const PRODUCT_EXPOSURE_FILTER_OPTIONS: SelectOption<ProductExposure | 'ALL'>[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PUBLIC', label: '공개' },
  { value: 'PRIVATE', label: '비공개' },
];

export const PRODUCT_DETAIL_TABS: { value: ProductDetailTab; label: string }[] = [
  { value: 'basic', label: '기본 정보' },
  { value: 'metrics', label: '서비스 지표' },
  { value: 'history', label: '변경 이력' },
];

export const NOT_REGISTERED_LABEL = '미등록';

// 상장 상품 목록 한 페이지 건수
export const PRODUCT_PAGE_SIZE = 20;

// 변경 이력 탭에 보여주는 최근 이력 건수
export const PRODUCT_HISTORY_SIZE = 20;

// 상세 거래 정보의 거래 상태 설명
export const PRODUCT_TRADE_STATUS_DESCRIPTIONS: Record<ProductTradeStatus, string> = {
  PENDING: '거래 시작 전',
  ACTIVE: '24시간 거래 진행 중',
  PAUSED: '신규 주문·체결 중지',
  CLOSED: '신규 거래 종료',
};
