import type { ProductDetail, ProductSummary } from '@/types/product';

// TODO(MOTU-22-1): 상장 상품 API 연동 후 제거합니다.
// 퍼블리싱 확인용 예시 데이터입니다. (Figma 20 · 관리자 상품 관리)
export const PRODUCTS_PREVIEW: ProductSummary[] = [
  {
    productId: 'PRD-018',
    productName: 'SaaS Index',
    category: 'SAAS',
    tradeStatus: 'ACTIVE',
    tradeStartAt: '2026-09-01T09:00',
    currentPrice: 12480,
    exposure: 'PUBLIC',
  },
  {
    productId: 'PRD-017',
    productName: 'Creator Index',
    category: 'CONTENTS',
    tradeStatus: 'PAUSED',
    tradeStartAt: '2026-08-28T09:00',
    currentPrice: 8100,
    exposure: 'PUBLIC',
  },
  {
    productId: 'PRD-019',
    productName: 'Local Commerce',
    category: 'COMMERCE',
    tradeStatus: 'PENDING',
    tradeStartAt: '2026-09-05T10:00',
    currentPrice: null,
    exposure: 'PRIVATE',
  },
  {
    productId: 'PRD-012',
    productName: 'Health Plus',
    category: 'HEALTHCARE',
    tradeStatus: 'CLOSED',
    tradeStartAt: '2026-08-10T09:00',
    currentPrice: 6320,
    exposure: 'PUBLIC',
  },
];

const TRADE_STATUS_DESCRIPTIONS: Record<ProductSummary['tradeStatus'], string> = {
  PENDING: '거래 시작 전',
  ACTIVE: '24시간 거래 진행 중',
  PAUSED: '신규 주문·체결 중지',
  CLOSED: '신규 거래 종료',
};

const DETAIL_PREVIEW: Omit<ProductDetail, keyof ProductSummary | 'tradeStatusDescription'> = {
  categoryDetail: 'SaaS / 소프트웨어',
  operatorName: '마스외전랩',
  officialUrl: 'https://...',
  intro: 'SaaS 기업 성장성 기반 모의투자 상품',
  totalSupply: 100000,
  openOrderCount: 24,
  metrics: {
    mau: 120000,
    transactionAmount: 85000000,
    baseDate: '2026-08-31',
  },
  histories: [
    {
      historyId: 'history-3',
      processedAt: '2026-09-03T20:10',
      actionType: '상품 정보 수정',
      adminId: 'admin01',
      summary: '상품 소개 수정',
      changedField: '상품 소개',
      before: 'SaaS 기업 성장성 기반 모의투자 상품',
      after: 'SaaS 기업의 성장성과 시장 반응을 반영한 모의투자 상품입니다.',
      reason: '서비스 설명 갱신',
    },
    {
      historyId: 'history-2',
      processedAt: '2026-09-03T12:00',
      actionType: '거래 상태 변경',
      adminId: 'admin02',
      summary: '거래 중지 → 거래 가능',
      changedField: '거래 상태',
      before: '거래 중지',
      after: '거래 가능',
      reason: '이상 거래 확인 완료',
    },
    {
      historyId: 'history-1',
      processedAt: '2026-08-31T15:20',
      actionType: '상장 승인',
      adminId: 'admin01',
      summary: '거래 대기 상태로 등록',
      changedField: '거래 상태',
      before: '-',
      after: '거래 대기',
      reason: '상장 심사 승인',
    },
  ],
};

export const getProductDetailPreview = (productId: string): ProductDetail | null => {
  const summary = PRODUCTS_PREVIEW.find((product) => product.productId === productId);
  if (!summary) return null;
  return {
    ...summary,
    ...DETAIL_PREVIEW,
    tradeStatusDescription: TRADE_STATUS_DESCRIPTIONS[summary.tradeStatus],
  };
};
