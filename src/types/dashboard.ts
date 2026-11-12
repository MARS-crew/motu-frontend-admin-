export type DashboardStats = {
  memberCount: number;
  // 전일 마감 대비 증감률 (%)
  memberChangeRate: number;
  listedProductCount: number;
  listedProductChange: number;
  // 상장 심사 대기 + 계정 문의 접수·처리 중
  pendingCount: number;
  pendingChange: number;
  pendingListingCount: number;
  pendingInquiryCount: number;
  abnormalTradeCount: number;
  abnormalTradeChange: number;
};

// volume: 거래량(주) / amount: 거래대금(P)
export type TradeMetric = 'volume' | 'amount';

export type TradeRange = '1h' | '6h' | '1d' | '1w' | '1m' | 'all' | 'custom';

export type TradeTrend = {
  total: number;
  // 2026.09.11 00:00 ~ 24:00
  periodLabel: string;
  // 집계 구간별 체결 합계
  values: number[];
  // X축 눈금 라벨 (양 끝 포함)
  xLabels: string[];
};

export type AdminActivity = {
  id: string;
  // HH:mm
  time: string;
  adminName: string;
  targetId: string;
  action: string;
  result: string;
};
