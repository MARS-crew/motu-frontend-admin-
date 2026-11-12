// 백엔드 상장 신청 상태 enum 과 같은 값을 씁니다. (관리자 목록에서는 DRAFT·EXPIRED 를 다루지 않습니다)
export type ListingApplicationStatus =
  'SUBMITTED' | 'UNDER_REVIEW' | 'REVISION_REQUESTED' | 'APPROVED' | 'REJECTED';

export type ListingCategory = 'SAAS' | 'CONTENTS' | 'COMMERCE' | 'HEALTHCARE' | 'ETC';

export type ListingApplicationSummary = {
  applicationId: string;
  productName: string;
  applicantName: string;
  category: ListingCategory;
  // YYYY-MM-DD
  appliedAt: string;
  status: ListingApplicationStatus;
};

export type ListingApplicationFilters = {
  status: ListingApplicationStatus | 'ALL';
  // 이름 또는 아이디
  applicant: string;
  category: ListingCategory | 'ALL';
  // YYYY-MM-DD, 둘 다 비우면 전체 기간
  appliedFrom: string | null;
  appliedTo: string | null;
};

export type ListingDetailTab = 'basic' | 'trading' | 'metrics' | 'evidence';

// 값이 없으면 null → 화면에 '미제출'로 표시합니다.
export type ListingApplicationDetail = ListingApplicationSummary & {
  // 상품 요약
  categoryDetail: string;
  operatorName: string;
  officialUrl: string;
  // 신청 기본 정보
  oneLineIntro: string;
  description: string;
  imageFileName: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  // 평가·거래 정보
  desiredPrice: number;
  totalSupply: number;
  minOrderQuantity: number;
  tickSize: number;
  priceBasis: string;
  // 서비스 지표
  metrics: {
    mau: number | null;
    dau: number | null;
    annualRevenue: string | null;
    revenuePeriod: string | null;
    revenueSource: string | null;
    transactionAmount: string | null;
    transactionPeriod: string | null;
    transactionSource: string | null;
  };
  evidences: ListingEvidenceFile[];
};

export type ListingEvidenceFile = {
  fileId: string;
  fileName: string;
  description: string;
  // 2.4MB
  sizeLabel: string;
  // TODO(MOTU-21-1): 미리보기 URL 로 교체합니다. 퍼블리싱 확인용 본문입니다.
  previewText: string | null;
};

// approve: 승인 / revision: 보완 요청 / reject: 반려
export type ListingReviewResult = 'approve' | 'revision' | 'reject';
