// 탐지 유형: 대량 주문·반복 주문·비정상 가격 체결·주문 처리 실패·잔액 불일치
export type AbnormalTradeType =
  'LARGE_ORDER' | 'REPEATED_ORDER' | 'ABNORMAL_PRICE' | 'ORDER_FAILURE' | 'BALANCE_MISMATCH';

// 처리 상태: 미처리·확인중·처리완료
export type AbnormalTradeStatus = 'UNPROCESSED' | 'CHECKING' | 'DONE';

// 발생 기간: 최근 24시간·7일·30일·직접 설정
export type MonitoringPeriod = '24h' | '7d' | '30d' | 'custom';

export type AbnormalTradeSummary = {
  alertId: string;
  // YYYY-MM-DDTHH:mm (KST)
  detectedAt: string;
  type: AbnormalTradeType;
  // 상장 상품 내부 식별자 (PRD-xxx)
  productId: string;
  // 회원 계정 내부 식별자 (USR-xxxx)
  memberId: string;
  errorMessage: string;
  status: AbnormalTradeStatus;
};

export type MonitoringFilters = {
  type: AbnormalTradeType | 'ALL';
  status: AbnormalTradeStatus | 'ALL';
  period: MonitoringPeriod;
  // 직접 설정일 때 시작·종료일 (YYYY-MM-DD)
  from: string | null;
  to: string | null;
  // 상품 ID 또는 회원 ID
  targetId: string;
};
