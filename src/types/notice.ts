// SERVICE 전체 공지(전체 회원 대상), PRODUCT 상품별 공지(대상 상품 필수)
export type NoticeType = 'SERVICE' | 'PRODUCT';

// DRAFT 임시 저장, SCHEDULED 게시 예약, PUBLISHED 게시 중, PRIVATE 비공개, DELETED 삭제
export type NoticeStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'PRIVATE' | 'DELETED';

export type NoticeSummary = {
  noticeId: string;
  type: NoticeType;
  title: string;
  // 상품별 공지만 값이 있습니다.
  productId: string | null;
  productName: string | null;
  status: NoticeStatus;
  // YYYY-MM-DDTHH:mm (KST), 임시 저장은 비어 있을 수 있습니다.
  startAt: string | null;
  endAt: string | null;
  // 사용자 공지 목록 상단 고정
  isImportant: boolean;
};

export type NoticeDetail = NoticeSummary & {
  content: string;
};

export type NoticeFilters = {
  // 제목 또는 공지 ID
  keyword: string;
  type: NoticeType | 'ALL';
  status: NoticeStatus | 'ALL';
  // YYYY-MM-DD, 둘 다 비우면 전체 기간
  from: string | null;
  to: string | null;
};
