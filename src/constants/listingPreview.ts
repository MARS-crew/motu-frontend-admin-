import type { ListingApplicationSummary } from '@/types/listing';

// TODO(MOTU-20-1): 상장 신청 목록 API 연동 후 제거합니다.
// 퍼블리싱 확인용 예시 데이터입니다. (Figma 18 · 관리자 상장 승인)
export const LISTING_APPLICATIONS_PREVIEW: ListingApplicationSummary[] = [
  {
    applicationId: 'LST-021',
    productName: 'SaaS Index',
    applicantName: '김신청',
    category: 'SAAS',
    appliedAt: '2026-08-31',
    status: 'SUBMITTED',
  },
  {
    applicationId: 'LST-020',
    productName: 'Creator Index',
    applicantName: '박기업',
    category: 'CONTENTS',
    appliedAt: '2026-08-30',
    status: 'UNDER_REVIEW',
  },
  {
    applicationId: 'LST-018',
    productName: 'Local Commerce',
    applicantName: '이대표',
    category: 'COMMERCE',
    appliedAt: '2026-08-29',
    status: 'REVISION_REQUESTED',
  },
  {
    applicationId: 'LST-015',
    productName: 'Health Plus',
    applicantName: '최운영',
    category: 'HEALTHCARE',
    appliedAt: '2026-08-26',
    status: 'APPROVED',
  },
];
