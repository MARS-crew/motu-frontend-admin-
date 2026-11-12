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
