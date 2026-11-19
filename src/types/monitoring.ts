// 탐지 유형: 대량 주문·반복 주문·비정상 가격 체결·주문 처리 실패·잔액 불일치
export type AbnormalTradeType =
  'LARGE_ORDER' | 'REPEATED_ORDER' | 'ABNORMAL_PRICE' | 'ORDER_FAILURE' | 'BALANCE_MISMATCH';

// 백엔드 처리 상태와 같은 값을 씁니다. PENDING 미처리, REVIEWING 확인중, RESOLVED 처리완료
export type AbnormalTradeStatus = 'PENDING' | 'REVIEWING' | 'RESOLVED';

// 확인중·처리완료에 기록된 조치 (STOCK_PAUSE 상품 거래 중지, USER_BLOCK 회원 정지, NO_ISSUE 이상 없음)
export type AnomalyActionType = 'STOCK_PAUSE' | 'USER_BLOCK' | 'NO_ISSUE';

// 발생 기간: 최근 24시간·7일·30일·직접 설정
export type MonitoringPeriod = '24h' | '7d' | '30d' | 'custom';

// GET /admin/anomalies 목록 항목
export type AnomalyItem = {
  anomalyId: number;
  type: AbnormalTradeType;
  status: AbnormalTradeStatus;
  // ISO 일시 (UTC)
  detectedDate: string;
  stockId: number | null;
  stockName: string | null;
  userId: number;
  loginId: string;
  errorCode: string;
  errorMessage: string;
};

export type AnomaliesResponse = {
  items: AnomalyItem[];
  page: number;
  size: number;
  totalCount: number;
  // 현재 조회 조건 기준 상단 건수
  summary: {
    totalCount: number;
    pendingCount: number;
    typeCounts: Partial<Record<AbnormalTradeType, number>>;
  };
};

// GET /admin/anomalies/{anomalyId}
export type AnomalyResponse = AnomalyItem & {
  stockCode: string | null;
  nickname: string;
  orderId: number | null;
  tradeId: number | null;
  // 탐지 근거 { 항목: 값 }
  evidence: Record<string, unknown> | null;
  action: AnomalyActionType | null;
  actionReason: string | null;
  handledBy: { adminId: number; loginId: string } | null;
  handledDate: string | null;
};

export type AnomaliesParams = {
  type?: AbnormalTradeType;
  status?: AbnormalTradeStatus;
  // 상품 ID(PRD-018) 또는 회원 ID(USR-1024)
  keyword?: string;
  from?: string;
  to?: string;
  page: number;
  size: number;
};

export type AbnormalTradeSummary = {
  // 주소·API 에 쓰는 이상 거래 ID (숫자 문자열)
  alertId: string;
  // YYYY-MM-DDTHH:mm (KST)
  detectedAt: string;
  type: AbnormalTradeType;
  // 상품과 관계없는 이상 거래는 null (상품 ID 는 숫자 문자열)
  productId: string | null;
  // PRD-018
  productCode: string | null;
  productName: string | null;
  // 회원 ID (숫자 문자열)
  memberId: string;
  // USR-1024
  memberCode: string;
  memberLoginId: string;
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
  // 1부터
  page: number;
};

export type AbnormalTradeDetail = AbnormalTradeSummary & {
  memberNickname: string;
  orderId: string | null;
  tradeId: string | null;
  // 탐지 근거 (주문·체결 수량, 기준·체결 가격, 자산 차이 등)
  evidences: { label: string; value: string }[];
  action: AnomalyActionType | null;
  actionReason: string | null;
  handlerLoginId: string | null;
  // YYYY-MM-DDTHH:mm (KST)
  handledAt: string | null;
};

// 관리자 조치: 상품 거래 중지 · 회원 정지 · 이상 없음
export type AbnormalTradeAction = 'PAUSE_PRODUCT' | 'SUSPEND_MEMBER' | 'NO_ISSUE';
