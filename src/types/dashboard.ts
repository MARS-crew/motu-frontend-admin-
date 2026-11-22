// 증감 값은 비교할 전일 통계가 없으면 null 입니다.
export type DashboardStats = {
  memberCount: number;
  // 전일 마감 대비 증감률 (%)
  memberChangeRate: number | null;
  listedProductCount: number;
  listedProductChange: number | null;
  // 상장 심사 대기 + 계정 문의 접수·처리 중
  pendingCount: number;
  pendingChange: number | null;
  pendingListingCount: number;
  pendingInquiryCount: number;
  abnormalTradeCount: number;
  abnormalTradeChange: number | null;
};

// volume: 거래량(주) / amount: 거래대금(P)
export type TradeMetric = 'volume' | 'amount';

export type TradeRange = '1h' | '6h' | '1d' | '1w' | '1m' | 'all' | 'custom';

export type AdminActivity = {
  id: string;
  // HH:mm
  time: string;
  adminName: string;
  targetId: string;
  action: string;
  result: string;
};

// GET /admin/dashboard/kpis (증감은 어제 일별 통계가 없으면 null)
export type DashboardKpisResponse = {
  userCount: number;
  userChangeRate: number | null;
  listedStockCount: number;
  listedStockChange: number | null;
  pendingCount: number;
  pendingListingCount: number;
  pendingInquiryCount: number;
  pendingChange: number | null;
  anomalyCount: number;
  anomalyChange: number | null;
};

export type TradeTrendApiRange =
  'HOUR_1' | 'HOUR_6' | 'DAY_1' | 'WEEK_1' | 'MONTH_1' | 'ALL' | 'CUSTOM';

export type TradeTrendUnit = 'MINUTE_5' | 'MINUTE_30' | 'HOUR' | 'HOUR_3' | 'DAY' | 'MONTH';

// GET /admin/dashboard/trade-trend
export type TradeTrendResponse = {
  range: TradeTrendApiRange;
  unit: TradeTrendUnit;
  from: string;
  to: string;
  // 화면에 보여줄 기간 (KST): 2026.09.11 00:00 ~ 24:00
  periodLabel: string;
  totalVolume: number;
  totalTradeAmount: number;
  // 시간순 구간별 합계 (체결이 없는 구간도 0)
  buckets: { time: string; volume: number; tradeAmount: number }[];
};

// 거래 추이 카드에 그릴 값 (거래량·거래대금 모두)
export type TradeTrendChart = {
  periodLabel: string;
  xLabels: string[];
  metrics: Record<TradeMetric, { total: number; values: number[] }>;
};
