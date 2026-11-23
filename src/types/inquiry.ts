// 백엔드 문의 enum 과 같은 값을 씁니다.
export type InquiryType = 'LOGIN_FAILED_LOCKED' | 'SUSPENDED' | 'PHONE_UNAVAILABLE';

// SUBMITTED 접수, IN_PROGRESS 처리 중, COMPLETED 처리 완료(이메일 답변 발송, 회원 상태와 무관)
export type InquiryStatus = 'SUBMITTED' | 'IN_PROGRESS' | 'COMPLETED';

// 답변 발송 시도 결과 (SENDING 발송 중, UNKNOWN 2분 넘게 결과를 모름, SIMULATED 모의 발송)
export type InquiryReplyAttemptStatus = 'SENDING' | 'ACCEPTED' | 'FAILED' | 'UNKNOWN' | 'SIMULATED';

export type InquiryAdminActor = {
  userId: number;
  loginId: string;
  // 관리자명, 없으면 닉네임·아이디
  nickname: string;
};

// GET /admin/inquiries 목록 항목
export type AdminInquiryItem = {
  id: number;
  source: 'RESTRICTED_ACCOUNT' | 'PUBLIC_ACCOUNT_AUTH';
  inquiryCode: string;
  inquiryType: InquiryType;
  title: string;
  status: InquiryStatus;
  statusLabel: string;
  assignedAdmin: InquiryAdminActor | null;
  // ISO 일시 (UTC)
  createDate: string;
  modifiedDate: string;
  processingStartedAt: string | null;
  completedAt: string | null;
};

export type InquiryReplyAttempt = {
  id: string;
  status: InquiryReplyAttemptStatus;
  toEmail: string;
  replyText: string;
  createDate: string;
  finishedAt: string | null;
};

// GET /admin/inquiries/{id}
export type AdminInquiryResponse = AdminInquiryItem & {
  content: string;
  replyEmail: string | null;
  replyDraft: string | null;
  // 답변 초안 버전 (최초 0, 다른 관리자의 편집과 충돌 확인용)
  replyVersion: number;
  // 처리 중이고 발송 중·결과 불명확·완료 반영 대기가 아닐 때 true
  canEdit: boolean;
  latestReplyAttempt: InquiryReplyAttempt | null;
};

export type AdminInquiriesParams = {
  // 접수번호 부분 검색
  keyword?: string;
  status?: InquiryStatus;
  inquiryType?: InquiryType;
  page: number;
  size: number;
};

// POST /admin/inquiries/{id}/send-reply
export type SendInquiryReplyRequest = {
  // 발송마다 새 UUID (응답을 못 받으면 같은 값으로 다시 요청)
  requestId: string;
  // 확인 모달 직전 초안 저장 응답의 replyVersion
  expectedDraftVersion: number;
  // 이전 발송 결과를 알 수 없을 때(UNKNOWN) 발송 이력을 확인한 뒤 재발송에 동의
  confirmResend?: boolean;
  // confirmResend 일 때 필수 (1~200자)
  retryReason?: string;
};

export type InquirySummary = {
  // 주소·API 에 쓰는 문의 ID (숫자 문자열)
  inquiryId: string;
  inquiryCode: string;
  type: InquiryType;
  status: InquiryStatus;
  // YYYY-MM-DDTHH:mm (KST)
  createdAt: string;
  // 처리 시작한 관리자 (접수 상태면 null)
  handlerName: string | null;
};

export type InquiryDetail = InquirySummary & {
  replyEmail: string;
  content: string;
  replyDraft: string | null;
  replyVersion: number;
  canEdit: boolean;
  // YYYY-MM-DDTHH:mm (KST), 처리 완료 전이면 null
  completedAt: string | null;
  latestAttempt: {
    status: InquiryReplyAttemptStatus;
    replyText: string;
    // YYYY-MM-DDTHH:mm (KST)
    sentAt: string;
  } | null;
};

export type InquiryFilters = {
  status: InquiryStatus | 'ALL';
  type: InquiryType | 'ALL';
  // 접수번호
  keyword: string;
  // 1부터
  page: number;
};
