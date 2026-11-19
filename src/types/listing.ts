// 백엔드 상장 신청 상태 enum 과 같은 값을 씁니다. (관리자 목록에서는 DRAFT·EXPIRED 를 다루지 않습니다)
export type ListingApplicationStatus =
  'SUBMITTED' | 'UNDER_REVIEW' | 'REVISION_REQUESTED' | 'APPROVED' | 'REJECTED';

export type ListingApplicant = {
  userId: number;
  loginId: string;
  nickname: string;
};

// GET /admin/listing-applications 목록 항목
export type ListingApplicationItem = {
  // 상세 조회에 쓰는 ID
  id: number;
  // 화면 표시용 신청번호 (LST-260831-018)
  applicationNumber: string;
  serviceName: string | null;
  sectorCode: number | null;
  sectorName: string | null;
  // ISO 일시 (UTC)
  submittedAt: string;
  status: ListingApplicationStatus;
  statusLabel: string;
  applicant: ListingApplicant;
};

export type ListingApplicationsParams = {
  status?: ListingApplicationStatus;
  applicant?: string;
  sectorCode?: number;
  // 접수 기간 (from 포함, to 미포함, 시간대 포함 ISO 일시)
  from?: string;
  to?: string;
  page: number;
  size: number;
};

export type ListingApplicationFilters = {
  status: ListingApplicationStatus | 'ALL';
  // 닉네임 또는 아이디
  applicant: string;
  // 카테고리 코드 (GET /sectors), 전체면 'ALL'
  sectorCode: string;
  // YYYY-MM-DD, 둘 다 비우면 전체 기간
  appliedFrom: string | null;
  appliedTo: string | null;
  // 1부터
  page: number;
};

export type ListingAttachment = {
  // UUID
  id: string;
  kind: 'FILE' | 'LINK';
  originalName?: string | null;
  contentType?: string | null;
  // byte
  size?: number | null;
  // 외부 링크 주소 (LINK)
  url?: string | null;
  saved: boolean;
  downloadPath: string | null;
};

export type ListingAttachmentCollection = {
  id: string;
  purpose: 'EVIDENCE' | 'LOGO' | 'MAIN_IMAGE';
  description: string | null;
  attachments: ListingAttachment[];
};

export type ListingRevision = {
  id: number;
  requestContent: string;
  deadline: string;
  createDate: string;
  resubmittedAt: string | null;
  evidence: ListingAttachmentCollection | null;
};

// 신청서 입력값입니다. 숫자도 입력한 문자열 그대로 내려옵니다.
export type ListingDraftData = {
  serviceName?: string | null;
  summary?: string | null;
  description?: string | null;
  officialUrl?: string | null;
  operatorName?: string | null;
  managerName?: string | null;
  businessEmail?: string | null;
  contactPhone?: string | null;
  desiredPrice?: string | null;
  totalIssuedQuantity?: string | null;
  minOrderQuantity?: string | null;
  tickSize?: string | null;
  priceCalculationBasis?: string | null;
  desiredListingDate?: string | null;
  mau?: string | null;
  mauSource?: string | null;
  mauReferenceMonth?: string | null;
  dau?: string | null;
  dauSource?: string | null;
  dauReferenceDate?: string | null;
  revenue?: string | null;
  revenueStartDate?: string | null;
  revenueEndDate?: string | null;
  revenueSource?: string | null;
  revenueExtractDate?: string | null;
  transactionVolume?: string | null;
  // LAST_12_MONTHS: 최근 완료 12개월 / SINCE_LAUNCH: 운영 전체 기간
  transactionVolumeBasis?: string | null;
  metricsStartDate?: string | null;
  metricsEndDate?: string | null;
  transactionVolumeSource?: string | null;
  transactionVolumeExtractDate?: string | null;
  evidenceDescription?: string | null;
  sectorCode?: number | null;
};

// GET /admin/listing-applications/{id}
export type ListingApplicationResponse = ListingApplicationItem & {
  reviewComment: string | null;
  revisionDeadline: string | null;
  data: ListingDraftData;
  attachments: {
    logo: ListingAttachmentCollection | null;
    mainImage: ListingAttachmentCollection | null;
    evidence: ListingAttachmentCollection | null;
  };
  revisions: ListingRevision[];
};

export type ListingDetailTab = 'basic' | 'trading' | 'metrics' | 'evidence';

// 첨부 파일·외부 링크 (증빙 자료, 대표 이미지)
export type ListingEvidenceFile = {
  attachmentId: string;
  kind: 'FILE' | 'LINK';
  // 파일명 또는 링크 주소
  fileName: string;
  description: string;
  contentType: string | null;
  // 2.4MB (링크는 '-')
  sizeLabel: string;
  // 외부 링크 주소 (LINK)
  url: string | null;
};

// 상세 화면 표시용으로 정리한 상장 신청입니다. 값이 없으면 null → 화면에 '미제출'로 표시합니다.
export type ListingApplicationDetail = {
  id: number;
  applicationNumber: string;
  applicantName: string;
  status: ListingApplicationStatus;
  // 상품 요약
  serviceName: string | null;
  sectorName: string | null;
  operatorName: string | null;
  officialUrl: string | null;
  mainImage: ListingEvidenceFile | null;
  // 신청 기본 정보
  summary: string | null;
  description: string | null;
  managerName: string | null;
  managerEmail: string | null;
  managerPhone: string | null;
  // 평가·거래 정보
  desiredPrice: number | null;
  totalSupply: number | null;
  minOrderQuantity: number | null;
  tickSize: number | null;
  priceBasis: string | null;
  // 서비스 지표 (표시 문구)
  metrics: {
    mau: string | null;
    dau: string | null;
    annualRevenue: string | null;
    revenuePeriod: string | null;
    revenueSource: string | null;
    transactionLabel: string;
    transactionAmount: string | null;
    transactionPeriod: string | null;
    transactionSource: string | null;
  };
  evidences: ListingEvidenceFile[];
};

// approve: 승인 / revision: 보완 요청 / reject: 반려
export type ListingReviewResult = 'approve' | 'revision' | 'reject';
