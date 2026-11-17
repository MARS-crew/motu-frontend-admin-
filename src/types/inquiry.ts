// 백엔드 문의 enum 과 같은 값을 씁니다.
// PHONE_UNAVAILABLE(등록 휴대폰 사용 불가)은 화면설계서 기준으로 추가했습니다. (API 반영 전)
export type InquiryType = 'LOGIN_FAILED_LOCKED' | 'SUSPENDED' | 'PHONE_UNAVAILABLE';

// SUBMITTED 접수, IN_PROGRESS 처리 중, APPROVED 처리 완료(이메일 답변 발송)
export type InquiryStatus = 'SUBMITTED' | 'IN_PROGRESS' | 'APPROVED';

export type Inquiry = {
  inquiryCode: string;
  type: InquiryType;
  status: InquiryStatus;
  replyEmail: string;
  content: string;
  // YYYY-MM-DDTHH:mm (KST)
  createdAt: string;
  // 처리 시작한 관리자 (접수 상태면 null)
  handlerLoginId: string | null;
  // 처리 완료 시 기록
  answer: string | null;
  answeredAt: string | null;
};

export type InquiryFilters = {
  status: InquiryStatus | 'ALL';
  type: InquiryType | 'ALL';
  // 접수번호
  keyword: string;
};
