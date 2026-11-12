import type { ListingApplicationDetail, ListingApplicationSummary } from '@/types/listing';

// TODO(MOTU-20-1, MOTU-21-1): 상장 신청 API 연동 후 제거합니다.
// 퍼블리싱 확인용 예시 데이터입니다. (Figma 18 · 관리자 상장 승인)
export const LISTING_APPLICATIONS_PREVIEW: ListingApplicationSummary[] = [
  {
    applicationId: 'LST-260831-018',
    productName: 'SaaS Index',
    applicantName: '김신청',
    category: 'SAAS',
    appliedAt: '2026-08-31',
    status: 'SUBMITTED',
  },
  {
    applicationId: 'LST-260830-020',
    productName: 'Creator Index',
    applicantName: '박기업',
    category: 'CONTENTS',
    appliedAt: '2026-08-30',
    status: 'UNDER_REVIEW',
  },
  {
    applicationId: 'LST-260829-016',
    productName: 'Local Commerce',
    applicantName: '이대표',
    category: 'COMMERCE',
    appliedAt: '2026-08-29',
    status: 'REVISION_REQUESTED',
  },
  {
    applicationId: 'LST-260826-015',
    productName: 'Health Plus',
    applicantName: '최운영',
    category: 'HEALTHCARE',
    appliedAt: '2026-08-26',
    status: 'APPROVED',
  },
];

const DETAIL_PREVIEW: Omit<ListingApplicationDetail, keyof ListingApplicationSummary> = {
  categoryDetail: 'SaaS / 소프트웨어',
  operatorName: '마스외전랩',
  officialUrl: 'https://...',
  oneLineIntro: 'SaaS 성장성에 투자',
  description: '기업 성장성 기반 상품',
  imageFileName: 'saas-index.png',
  managerName: '김신청',
  managerEmail: 'listing@example.com',
  managerPhone: '010-1234-5678',
  desiredPrice: 12000,
  totalSupply: 100000,
  minOrderQuantity: 1,
  tickSize: 10,
  priceBasis: [
    '예시: 유사 서비스의 거래 가격과 최근 매출을 바탕으로 희망 상장가를 산정했습니다.',
    '',
    '· 유사 서비스 3곳의 최근 3개월 평균 거래 가격 11,800P~12,600P',
    '· 2025년 연간 매출 12억 원, 전년 대비 18% 성장',
    '· 최근 완료 12개월 거래액 4.8억 원',
    '',
    '위 근거를 반영해 희망 상장가를 12,000P, 총 발행량을 100,000주로 제안합니다.',
  ].join('\n'),
  metrics: {
    mau: 120000,
    dau: 18000,
    annualRevenue: '12억 원',
    revenuePeriod: '2025.01.01–2025.12.31',
    revenueSource: '2025 결산 · 2026.01.15',
    transactionAmount: '4.8억 원',
    transactionPeriod: '2025.09.01–2026.08.31',
    transactionSource: '결제 집계 · 2026.09.01',
  },
  evidences: [
    {
      fileId: 'file-1',
      fileName: 'service_data.pdf',
      description: '서비스 지표 원본',
      sizeLabel: '2.4MB',
      previewText: [
        '서비스 운영 증빙',
        '',
        '신청번호   LST-260831-018',
        '운영사   마스외전랩',
        '제출 항목   서비스 지표 (MAU·DAU·거래액)',
        '기준 월   2026년 8월',
        '',
        '예시 문서 · PDF 1 / 1 페이지',
      ].join('\n'),
    },
    {
      fileId: 'file-2',
      fileName: 'metrics.png',
      description: 'MAU·거래액 캡처',
      sizeLabel: '820KB',
      previewText: null,
    },
    {
      fileId: 'file-3',
      fileName: 'business_registration.pdf',
      description: '사업자 등록증',
      sizeLabel: '1.1MB',
      previewText: null,
    },
  ],
};

export const getListingDetailPreview = (applicationId: string): ListingApplicationDetail | null => {
  const summary = LISTING_APPLICATIONS_PREVIEW.find(
    (application) => application.applicationId === applicationId,
  );
  return summary ? { ...summary, ...DETAIL_PREVIEW } : null;
};
