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
