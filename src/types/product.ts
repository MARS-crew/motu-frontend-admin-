// 백엔드 거래 상태 enum 과 같은 값을 씁니다. (PENDING 거래 대기, ACTIVE 거래 가능, PAUSED 거래 중지, CLOSED 거래 종료)
export type ProductTradeStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'CLOSED';

// 사용자 화면 노출 여부
export type ProductExposure = 'PUBLIC' | 'PRIVATE';

// GET /admin/stocks 목록 항목
export type AdminStockItem = {
  stockId: number;
  stockCode: string;
  name: string;
  sectorCode: number;
  sectorName: string;
  tradeStatus: ProductTradeStatus;
  isPublic: boolean;
  // 거래 시작일시 (ISO, UTC)
  listingDate: string;
  // 거래 대기 상품은 null
  currentPrice: number | null;
};

// GET /admin/stocks/{stockId}
export type AdminStockResponse = AdminStockItem & {
  summary: string;
  description: string | null;
  operatorName: string;
  officialUrl: string | null;
  logoImageUrl: string | null;
  mainImageUrl: string;
  listedShares: number;
  openOrderCount: number;
  // 거래 중지·종료할 때 입력한 사용자 안내문
  statusNotice: string | null;
  metrics: {
    mau: number | null;
    transactionVolume: number | null;
    // YYYY-MM-DD
    baseDate: string | null;
  };
};

export type AdminStocksParams = {
  keyword?: string;
  tradeStatus?: ProductTradeStatus;
  sectorCode?: number;
  visibility?: ProductExposure;
  page: number;
  size: number;
};

// 목록 화면 표시용 상품
export type ProductSummary = {
  // 주소·API 에 쓰는 상품 ID (숫자 문자열)
  productId: string;
  // 화면 표시용 상품 ID (PRD-018)
  productCode: string;
  productName: string;
  sectorCode: number;
  sectorName: string;
  tradeStatus: ProductTradeStatus;
  // YYYY-MM-DDTHH:mm (KST)
  tradeStartAt: string;
  // 거래 전이면 null
  currentPrice: number | null;
  exposure: ProductExposure;
};

// 등록된 서비스 지표 (값이 없으면 null → '미등록')
export type ProductMetrics = {
  mau: number | null;
  transactionAmount: number | null;
  // YYYY-MM-DD
  baseDate: string | null;
};

// 상세 화면 표시용 상품
export type ProductDetail = ProductSummary & {
  operatorName: string;
  officialUrl: string;
  // 한 줄 소개
  summary: string;
  // 상품 소개
  intro: string;
  totalSupply: number;
  openOrderCount: number;
  // 24시간 거래 진행 중
  tradeStatusDescription: string;
  // 거래 중지·종료 사용자 안내문
  statusNotice: string | null;
  metrics: ProductMetrics;
};

// 변경 이력 (관리자 활동 이력 중 상품 대상)
export type ProductHistory = {
  historyId: number;
  // YYYY-MM-DDTHH:mm (KST)
  processedAt: string;
  actionType: string;
  adminId: string;
  summary: string;
};

// 변경 이력 행을 선택하면 보여주는 변경 전·후 값과 사유
export type ProductHistoryDetail = {
  changedField: string;
  before: string;
  after: string;
  reason: string;
};

export type ProductDetailTab = 'basic' | 'metrics' | 'history';

export type ProductFilters = {
  // 상품명 또는 상품 ID
  keyword: string;
  tradeStatus: ProductTradeStatus | 'ALL';
  // 카테고리 코드 (GET /sectors), 전체면 'ALL'
  sectorCode: string;
  exposure: ProductExposure | 'ALL';
  // 1부터
  page: number;
};

// 이상 거래 상세(ADM-MON-02)에서 거래 중지로 진입하면 사유를 채워 넘기고, 처리 후 그 화면으로 돌아갑니다.
export type ProductTradingLocationState = {
  reason?: string;
  returnTo?: string;
} | null;
