import type { ListingCategory } from '@/types/listing';

// 백엔드 거래 상태 enum 과 같은 값을 씁니다. (PENDING 거래 대기, ACTIVE 거래 가능, PAUSED 거래 중지, CLOSED 거래 종료)
export type ProductTradeStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'CLOSED';

// 사용자 화면 노출 여부
export type ProductExposure = 'PUBLIC' | 'PRIVATE';

export type ProductSummary = {
  productId: string;
  productName: string;
  category: ListingCategory;
  tradeStatus: ProductTradeStatus;
  // YYYY-MM-DDTHH:mm (KST)
  tradeStartAt: string;
  // 거래 전이면 null
  currentPrice: number | null;
  exposure: ProductExposure;
};

export type ProductMetricsSnapshot = {
  mau: number | null;
  transactionAmount: number | null;
  // YYYY-MM-DD
  baseDate: string | null;
  // 2026.09.02 14:10 · admin01
  updatedLabel: string;
};

export type ProductHistory = {
  historyId: string;
  // YYYY-MM-DDTHH:mm (KST)
  processedAt: string;
  actionType: string;
  adminId: string;
  summary: string;
  changedField: string;
  before: string;
  after: string;
  reason: string;
};

export type ProductDetail = ProductSummary & {
  categoryDetail: string;
  operatorName: string;
  officialUrl: string;
  intro: string;
  totalSupply: number;
  openOrderCount: number;
  // 24시간 거래 진행 중
  tradeStatusDescription: string;
  currentMetrics: ProductMetricsSnapshot;
  previousMetrics: ProductMetricsSnapshot | null;
  histories: ProductHistory[];
};

export type ProductDetailTab = 'basic' | 'metrics' | 'history';

export type ProductFilters = {
  // 상품명 또는 상품 ID
  keyword: string;
  tradeStatus: ProductTradeStatus | 'ALL';
  category: ListingCategory | 'ALL';
  exposure: ProductExposure | 'ALL';
};

// 이상 거래 상세(ADM-MON-02)에서 거래 중지로 진입하면 사유를 채워 넘기고, 처리 후 그 화면으로 돌아갑니다.
export type ProductTradingLocationState = {
  reason?: string;
  returnTo?: string;
} | null;
