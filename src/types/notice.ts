// SERVICE 전체 공지(전체 회원 대상), PRODUCT 상품별 공지(대상 상품 필수)
// API 값은 SERVICE → ALL, PRODUCT → STOCK 입니다.
export type NoticeType = 'SERVICE' | 'PRODUCT';

export type NoticeApiType = 'ALL' | 'STOCK';

// 백엔드 공지 상태와 같은 값을 씁니다.
// DRAFT 임시 저장, SCHEDULED 게시 예약, PUBLISHED 게시 중, ENDED 게시 종료, HIDDEN 비공개, DELETED 삭제
export type NoticeStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ENDED' | 'HIDDEN' | 'DELETED';

// GET /admin/notices 목록 항목
export type AdminNoticeItem = {
  noticeId: number;
  type: NoticeApiType;
  stockId: number | null;
  stockCode: string | null;
  stockName: string | null;
  title: string;
  isImportant: boolean;
  // ISO 일시 (UTC)
  postStartDate: string | null;
  postEndDate: string | null;
  status: NoticeStatus;
  createDate: string;
  modifiedDate: string;
};

// GET /admin/notices/{noticeId}
export type AdminNoticeResponse = AdminNoticeItem & {
  content: string;
};

export type AdminNoticesParams = {
  keyword?: string;
  type?: NoticeApiType;
  status?: NoticeStatus;
  // 게시 기간 (from 포함, to 미포함, 시간대 포함 ISO 일시)
  from?: string;
  to?: string;
  page: number;
  size: number;
};

// 공지 등록·수정·게시 요청 본문
export type AdminNoticeRequest = {
  type: NoticeApiType;
  stockId: number | null;
  title: string;
  content: string;
  isImportant: boolean;
  postStartDate: string | null;
  postEndDate: string | null;
};

export type CreateAdminNoticeRequest = AdminNoticeRequest & {
  // DRAFT 임시 저장, POSTED 게시 (시작일시가 미래이면 게시 예약)
  status: 'DRAFT' | 'POSTED';
};

export type NoticeSummary = {
  // 주소·API 에 쓰는 공지 ID (숫자 문자열)
  noticeId: string;
  type: NoticeType;
  title: string;
  // 상품별 공지만 값이 있습니다. (상품 ID 는 숫자 문자열)
  productId: string | null;
  productCode: string | null;
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
  // 1부터
  page: number;
};
