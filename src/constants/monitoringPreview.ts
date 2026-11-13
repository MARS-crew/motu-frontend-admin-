import type { AbnormalTradeSummary } from '@/types/monitoring';

// TODO(MOTU-24-1): 이상 거래 모니터링 API 연동 후 제거합니다.
// 퍼블리싱 확인용 예시 데이터입니다. (Figma 21 · 관리자 거래 모니터링)
export const ABNORMAL_TRADES_PREVIEW: AbnormalTradeSummary[] = [
  {
    alertId: 'MON-260903-007',
    detectedAt: '2026-09-03T19:42',
    type: 'ABNORMAL_PRICE',
    productId: 'PRD-018',
    memberId: 'USR-1024',
    errorMessage: '가격 편차 초과',
    status: 'UNPROCESSED',
  },
  {
    alertId: 'MON-260903-006',
    detectedAt: '2026-09-03T18:20',
    type: 'REPEATED_ORDER',
    productId: 'PRD-006',
    memberId: 'USR-0441',
    errorMessage: '반복 주문 탐지',
    status: 'CHECKING',
  },
  {
    alertId: 'MON-260903-005',
    detectedAt: '2026-09-03T17:05',
    type: 'ORDER_FAILURE',
    productId: 'PRD-018',
    memberId: 'USR-0335',
    errorMessage: '주문 처리 실패',
    status: 'DONE',
  },
  {
    alertId: 'MON-260902-004',
    detectedAt: '2026-09-02T22:31',
    type: 'LARGE_ORDER',
    productId: 'PRD-017',
    memberId: 'USR-0902',
    errorMessage: '1회 주문 수량 한도 초과',
    status: 'UNPROCESSED',
  },
  {
    alertId: 'MON-260902-003',
    detectedAt: '2026-09-02T15:12',
    type: 'ORDER_FAILURE',
    productId: 'PRD-012',
    memberId: 'USR-0117',
    errorMessage: '체결 처리 시간 초과',
    status: 'UNPROCESSED',
  },
  {
    alertId: 'MON-260901-002',
    detectedAt: '2026-09-01T11:48',
    type: 'BALANCE_MISMATCH',
    productId: 'PRD-018',
    memberId: 'USR-1024',
    errorMessage: '예약 포인트 불일치',
    status: 'CHECKING',
  },
  {
    alertId: 'MON-260901-001',
    detectedAt: '2026-09-01T09:03',
    type: 'REPEATED_ORDER',
    productId: 'PRD-006',
    memberId: 'USR-0441',
    errorMessage: '반복 주문 탐지',
    status: 'DONE',
  },
];
